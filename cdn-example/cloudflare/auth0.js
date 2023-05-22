/**
 * Example code for a Cloudflare Worker that can proxy Auth0 requests and inject an
 * Arkose Labs integration into and then process the Arkose Labs result on the
 * Cloudflare CDN layer.
 *
 * This requires the following environment variables being setup for the Cloudflare Worker
 * @param {string} publicKey The Arkose Labs public key to use
 * @param {string} privateKey The Arkose Labs private key to use for verification
 * @param {string} clientSubdomain A customer's specific subdomain used for the loading of the Client-API (if setup)
 * @param {string} verifySubdomain A customer's specific subdomain used for the verification call (if setup)
 * @param {string} errorUrl A url to redirect to if there has been an error
 * @param {string} cookieName The name of the cookie to store the Arkose Labs session token in
 * @param {string} failOpen A boolean string to indicate if the current session should fail
 * open if there is a problem with the Arkose Labs platform.
 * @param {string} verifyMaxRetryCount A numeric string to represent the number of times we should retry
 * Arkose Labs verification if there is an issue.
 * @param {string} scriptMaxRetryCount A numeric string to represent the number of times we should retry
 * loading an Arkose Labs challenge if there is an issue.
 */

/**
 * Parses a numeric string as a number
 * @param  {string} value The string to parse as a number
 * @return {integer} The parsed integer value
 */
const parseNumber = (value) => (isNaN(parseInt(value)) ? 0 : parseInt(value));

/**
 * Parses a boolean like string as a boolean
 * @param  {string} value The string to parse as a boolean
 * @return {boolean} The parsed boolean value
 */
const parseBoolean = (value) => String(value).toLowerCase() == 'true';

/**
 * Returns a cookie value from a cookie header string
 * @param  {string} cookieString The string to extract the cookie value from
 * @param  {string} cookieKey The cookie key to extract the value for
 * @return {string} the cookie value of the specified key
 */
const getCookie = (cookieString, cookieKey) => {
  if (cookieString) {
    const allCookies = cookieString.split('; ');
    const targetCookie = allCookies.find((cookie) =>
      cookie.includes(cookieKey)
    );
    if (targetCookie) {
      const [_, value] = targetCookie.split(`${cookieKey}=`);
      return value;
    }
  }
  return null;
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
      return await verifyArkoseToken(
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
 * Handles failures to verify and redirects to a specified url
 * @param  {string} errorUrl A string representing a url to redirect to on failure
 * @return {Object} The response to handle the error
 */
const handleFailure = (errorUrl) => {
  return Response.redirect(errorUrl, '301');
}

export default {
  async fetch(request, env, ctx) {
    const { publicKey } = env;
    const { privateKey } = env;
    const { clientSubdomain = 'client-api' } = env;
    const { verifySubdomain = 'client-api' } = env;
    const { errorUrl } = env;
    const { cookieName = 'arkose-session' } = env;
    const formSelector = '._form-login-password';
    const failOpen = parseBoolean(env.failOpen);
    const verifyMaxRetryCount = parseNumber(env.verifyMaxRetryCount);
    const scriptMaxRetryCount = parseNumber(env.scriptMaxRetryCount);

    /**
     * Checks the current response and if it should have Arkose injected
     * @param  {Object} response The current response to check
     * @return  {Object} the modified response
     */
    const checkResponse = (response) => {
      if (response.status === 302) {
        return response;
      }
      return injectArkose(response);
    };

    /**
     * Injects the Arkose Labs Client-API code into the current response
     * @param  {Object} response The current response to inject code into
     * @return  {Object} the modified response
     */
    const injectArkose = (response) => {
      var newResponse = new HTMLRewriter()
        .on('body', {
          element(element) {
            element.append(
              `<script>
var publicKey = '${publicKey}';
var clientSubdomain = '${clientSubdomain}';
var errorUrl = '${errorUrl}';
var cookieName = '${cookieName}';
var formSelector = '${formSelector}';
var failOpen = ${failOpen};
var arkoseRetryMax = ${scriptMaxRetryCount};
var arkoseScriptSrc = 'https://' + clientSubdomain + '.arkoselabs.com/v2/' + publicKey + '/api.js';

var arkose = null;
var arkoseRetry = 0;
var arkoseReady = false;
var arkoseResetting = false;
var arkoseCompleted = false;
var loginForm = document.querySelector(formSelector);
var loginButton = null;

if (loginForm) {
    loginButton = loginForm.querySelector('[type="submit"]');
    loginButton.setAttribute('disabled', true);
    loginForm.addEventListener('submit', function (event) {
        if (!arkoseCompleted) {
            event.preventDefault();
            arkose.run();
            return;
        }
        if (!arkoseReady) {
            event.preventDefault();
            return;
        }
    });
}

function createArkoseScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = arkoseScriptSrc;
    script.setAttribute('data-callback', 'setupEnforcement');
    script.async = true;
    script.defer = true;
    script.id = 'arkose-script';
    document.getElementsByTagName('head')[0].appendChild(script);
}

function checkArkoseStatus(callback) {
    try {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://status.arkoselabs.com/api/v2/status.json', false);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                if (this.status == 200) {
                    var res = JSON.parse(xhr.responseText);
                    var status = res.status.indicator;
                    callback(!(status === 'critical'));
                    return;
                }
                callback(false);
            }
        };
        xhr.send(null);
    } catch (error) {
        callback(false);
    }
}
  
function setupEnforcement(enforcement) {
    arkose = enforcement;
    arkose.setConfig({
        onReady: function() {
            arkoseReady = true;
            loginButton.removeAttribute('disabled');
            document.cookie = cookieName + '=' + '""' + ';expires=' + new Date(Date.now() - 1).toUTCString() + ';path=/';
            if (arkoseResetting) {
                arkoseResetting = false;
                arkose.run();
            }
        },
        onCompleted: function(response) {
            var cookieValue = response.token;
            document.cookie = cookieName + '=' + cookieValue + ';expires=' + new Date(Date.now() + 60 * 5 * 1000).toUTCString() + ';path=/';
            arkoseCompleted = true;
            loginForm.submit();
        },
        onError: function(response) {
            checkArkoseStatus(function (isHealthy) {
                if (isHealthy && arkoseRetry < arkoseRetryMax) {
                    arkoseResetting = true;
                    arkose.reset();
                    arkoseRetry = arkoseRetry + 1;
                    return;
                }
                if (failOpen) {
                    arkoseCompleted = true;
                    arkoseReady = true;
                    loginButton.removeAttribute('disabled');
                    loginForm.submit();
                    return;
                }
                window.location.replace(errorUrl);
            });
        },
    });
}
createArkoseScript();
</script>`,
              { html: true }
            );
          },
        })
        .transform(response);
      return newResponse;
    };

    // If the request is a GET request inject the Arkose Labs Client-API script
    if (request.method == 'GET') {
      const res = await fetch(request);
      return injectArkose(res);
    }
    // If the request is not a GET request and has an Arkose Labs session cookie, process it
    const arkoseToken = getCookie(request.headers.get('Cookie'), cookieName);
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
        return checkResponse(response);
      }

      // If Arkose has an outage and failOpen is configured to true, continue with response
      if (!verifyStatus.arkoseStatus && failOpen) {
        const response = await fetch(request);
        return checkResponse(response);
      }
      // If session is not verified and Arkose does not have an outage, handle failure
      return handleFailure(errorUrl);
    }
    // If no token is found, handle failure
    return handleFailure(errorUrl);
  },
};