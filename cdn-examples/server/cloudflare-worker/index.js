/**
 * Example code for a Cloudflare Worker that can proxy requests, extract an Arkose Labs token from the
 * request and verify the token on the CDN layer
 *
 * This requires the following environment variables being setup for the Cloudflare Worker
 * @param {string} publicKey The Arkose Labs public key to use
 * @param {string} privateKey The Arkose Labs private key to use for verification
 * @param {string} verifySubdomain A customer's specific subdomain used for the verification call (if setup)
 * @param {string} errorUrl A url to redirect to if there has been an error
 * @param {string} tokenMethod The storage method of the Arkose Labs token, this can be either "header" or "cookie".
 * @param {string} tokenIdentifier The property name for the header / cookie that contains the Arkose Labs token
 * @param {string} failOpen A boolean string to indicate if the current session should fail
 * open if there is a problem with the Arkose Labs platform.
 * @param {string} verifyMaxRetryCount A numeric string to represent the number of times we should retry
 * Arkose Labs verification if there is an issue.
 */

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
  const cookieString = request.headers.get('Cookie');
  if (cookieString) {
    const allCookies = cookieString.split('; ');
    const targetCookie = allCookies.find((cookie) =>
      cookie.includes(cookieKey)
    );
    if (targetCookie) {
      const [, value] = targetCookie.split(`${cookieKey}=`);
      return value;
    }
  }
  return null;
};

/**
 * Returns a specified header value from a request
 * @param  {Object} request The request to fetch the header from
 * @param  {string} headerKey The header key to extract the value for
 * @return {string} the header value of the specified key
 */
const getTokenHeader = (request, headerKey) => {
  return request.headers.get(headerKey);
};

/**
 * Checks the current status of the Arkose Labs platform
 * @return {boolean} A boolean representation of the current Arkose Labs platform status,
 * true means the platform is stable, false signifies an outage.
 */
const checkArkoseStatus = async () => {
  try {
    const healthResponse = await fetch(
      'https://status.arkoselabs.com/api/v2/status.json'
    );
    const healthJson = await healthResponse.json();
    const status = healthJson.status.indicator;
    return !(status === 'critical');
  } catch (error) {
    return false;
  }
};

/**
 * Verifies an arkose token, including retry and platform status logic
 * @param  {string} token The Arkose Labs session token value
 * @param  {string} privateKey The Arkose Labs private key
 * @param  {string} verifySubdomain The subdomain of the verify endpoint to use
 * @param  {string} retryMaxCount The number of retries that should be performed if there is an issue
 * @param  {string} [currentRetry=0] The count of the current number of retries being performed
 * @return {Object} status The current verification and Arkose Labs platform status
 * @return {boolean} status.verified Has the token verified successfully
 * @return {boolean} statis.arkoseStatus The current status of the Arkose Labs platform
 */
const verifyArkoseToken = async (
  token,
  privateKey,
  verifySubdomain,
  retryMaxCount,
  currentRetry = 0
) => {
  let verified = false;
  let arkoseStatus = true;
  try {
    const payload = {
      private_key: privateKey,
      session_token: token,
    };
    const response = await fetch(
      `https://${verifySubdomain}.arkoselabs.com/api/v4/verify/`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
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
      return verifyArkoseToken(
        token,
        privateKey,
        verifySubdomain,
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

/**
 * Handles failures to verify and redirects to a specified url
 * @param  {string} errorUrl A string representing a url to redirect to on failure
 * @return {Object} The response to handle the error
 */
const handleFailure = (errorUrl) => {
  return Response.redirect(errorUrl, '301');
};


export default {
  async fetch(request, env) {
    const { privateKey } = env;
    const { verifySubdomain = 'client-api' } = env;
    const { errorUrl } = env;
    const { tokenIdentifier = 'arkose-token' } = env;
    const { tokenMethod = 'header' } = env;
    const failOpen = parseBoolean(env.failOpen);
    const verifyMaxRetryCount = parseNumber(env.verifyMaxRetryCount);

    // extracts the Arkose Labs token from the request
    const arkoseToken = getArkoseToken(request, tokenMethod, tokenIdentifier);

    // if an Arkose Labs token is found, process it
    if (arkoseToken && arkoseToken !== '') {
      const verifyStatus = await verifyArkoseToken(
        arkoseToken,
        privateKey,
        verifySubdomain,
        verifyMaxRetryCount
      );

      // If session is verified, continue with response
      if (verifyStatus.verified) {
        const response = await fetch(request);
        return response;
      }

      // If Arkose has an outage and failOpen is configured to true, continue with response
      if (!verifyStatus.arkoseStatus && failOpen) {
        const response = await fetch(request);
        return response;
      }

      // If session is not verified and Arkose does not have an outage, handle failure
      return handleFailure(errorUrl);
    }
    // If no token is found, handle failure
    return handleFailure(errorUrl);
  },
};
