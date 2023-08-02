/**
 * Example code for an Akamai EdgeWorker that can proxy requests, extract an Arkose Labs token from the
 * request and verify the token on the CDN layer
 *
 * This requires the following variables being setup for the Akamai Property User variables
 * @param {string} privateKey The Arkose Labs private key to use for verification
 * @param {string} errorUrl A url to redirect to if there has been an error
 * @param {string} tokenIdentifier The property name for the header / cookie that contains the Arkose Labs token
 * @param {string} tokenMethod The storage method of the Arkose Labs token, this can be either "header" or "cookie".
 * @param {string} failOpen A boolean string to indicate if the current session should fail
 * open if there is a problem with the Arkose Labs platform.
 * @param {string} verifyMaxRetryCount A numeric string to represent the number of times we should retry
 * Arkose Labs verification if there is an issue.
 */

import { Cookies } from 'cookies';
import { createResponse } from 'create-response';
import { httpRequest } from 'http-request';

/**
 * Parses a numeric string as a number
 * @param  {string} value The string to parse as a number
 * @return {integer} The parsed integer value
 */
const parseNumber = (value) =>
  // eslint-disable-next-line no-restricted-globals
  isNaN(parseInt(value, 10)) ? 0 : parseInt(value, 10);

/**
 * Parses a boolean like string as a boolean
 * @param  {string} value The string to parse as a boolean
 * @return {boolean} The parsed boolean value
 */
const parseBoolean = (value) => String(value).toLowerCase() === 'true';

/**
 * Returns a specified cookie value from request object
 * @param  {object} request The request to extract the cookie value from
 * @param  {string} cookieKey The cookie key to extract the value for
 * @return {string} the cookie value of the specified key
 */

const getTokenCookie = (request, cookieKey) => {
  const cookies = new Cookies(request.getHeader('Cookie'));
  if (cookies.get(cookieKey) === null) {
    return null;
  }
  return cookies.get(cookieKey);
};

/**
 * Returns a specified header value from a request
 * @param  {Object} request The request to fetch the header from
 * @param  {string} headerKey The header key to extract the value for
 * @return {string} the header value of the specified key
 */
const getTokenHeader = (request, headerKey) => {
  return request.getHeader(headerKey)[0];
};

/**
 * Checks the current status of the Arkose Labs platform
 * @return {boolean} A boolean representation of the current Arkose Labs platform status,
 * true means the platform is stable, false signifies an outage.
 */
const checkArkoseStatus = async () => {
  try {
    const healthResponse = await httpRequest('/api/v2/status.json');
    const healthJson = await healthResponse.json();
    const status = healthJson.status.indicator;
    if (status === 'critical') {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Verifies an arkose token, including retry and platform status logic
 * @param  {string} token The Arkose Labs session token value
 * @param  {string} privateKey The Arkose Labs private key
 * @param  {string} retryMaxCount The number of retries that should be performed if there is an issue
 * @param  {string} [currentRetry=0] The count of the current number of retries being performed
 * @return {Object} status The current verification and Arkose Labs platform status
 * @return {boolean} status.verified Has the token verified successfully
 * @return {boolean} statis.arkoseStatus The current status of the Arkose Labs platform
 */
const verifyArkoseToken = async (
  token,
  privateKey,
  retryMaxCount,
  currentRetry = 0
) => {
  let verified = false;
  let arkoseStatus = true;
  try {
    const response = await httpRequest(
      `/api/v4/verify?private_key=${privateKey}&session_token=${token}`
    );

    const data = await response.json();

    if (data.session_details && data.session_details.solved) {
      verified = true;
    }
    return { verified, arkoseStatus };
  } catch {
    arkoseStatus = await checkArkoseStatus();

    if (arkoseStatus) {
      if (currentRetry === retryMaxCount) {
        return { verified, arkoseStatus };
      }
      return await verifyArkoseToken(
        token,
        privateKey,
        retryMaxCount,
        currentRetry + 1
      );
    }
    return { verified, arkoseStatus };
  }
};

/**
 * Returns an Arkose Labs token from the current request
 * @param  {Object} request The request to fetch the header from
 * @param  {string} tokenMethod The method to use for extracting the Arkose Labs token, this has two
 * potential values "cookie" and "header"
 * @param  {string} tokenIdentifier An identifier string of the property the token is stored in
 * @return {string} the specified Arkose Labs token
 */
const getArkoseToken = (request, tokenMethod, tokenIdentifier) => {
  const tokenFunction =
    tokenMethod === 'cookie' ? getTokenCookie : getTokenHeader;
  return tokenFunction(request, tokenIdentifier);
};

export async function responseProvider(request) {
  const privateKey = request.getVariable('PMUSER_ARKOSE_PRIVATE_KEY');
  const errorUrl = request.getVariable('PMUSER_ERROR_URL');
  const tokenIdentifier = request.getVariable('PMUSER_TOKEN_IDENTIFIER');
  const tokenMethod = request.getVariable('PMUSER_TOKEN_METHOD');
  const failOpen = parseBoolean(request.getVariable('PMUSER_FAIL_OPEN'));
  const verifyMaxRetryCount = parseNumber(
    request.getVariable('PMUSER_VERIFY_MAX_RETRY_COUNT')
  );

  // extracts the Arkose Labs token from the request
  const arkoseToken = getArkoseToken(request, tokenMethod, tokenIdentifier);

  // if an Arkose Labs token is found, process it
  if (arkoseToken && arkoseToken !== '') {
    const verifyStatus = await verifyArkoseToken(
      arkoseToken,
      privateKey,
      verifyMaxRetryCount
    );

    const requestBody = await request.json();

    // If session is verified, continue with response.
    // NOTE: this is where the request is to be made to verify login credentials.
    if (verifyStatus.verified) {
      const loginResponse = await httpRequest('/api/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const responseBody = await loginResponse.json();

      return createResponse(
        200,
        request.getHeaders(),
        JSON.stringify(responseBody)
      );
    }

    // If Arkose has an outage and failOpen is configured to true, continue with response
    // NOTE: this is where the request is to be made to verify login credentials.
    if (!verifyStatus.arkoseStatus && failOpen) {
      const loginResponse = await httpRequest('/api/', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      const responseBody = await loginResponse.json();

      return createResponse(
        200,
        request.getHeaders(),
        JSON.stringify(responseBody)
      );
    }

    // If session is not verified and Arkose does not have an outage, handle failure
    return createResponse(
      302,
      { Location: [errorUrl] },
      'Session is not verified and Arkose is healthy'
    );
  }
  // If no token is found, handle failure
  return createResponse(302, { Location: [errorUrl] }, 'No token found');
}
