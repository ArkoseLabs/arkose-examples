# Client Side Form Submit Takeover Example

This is an example client side integration that allows a form submission to be protected by the Arkose Labs platform with little effort. This integration hijacks the form submit event and initilises either Arkose Detect or Enforcement when the submit event is triggered, after the Arkose Labs onComplete callback is triggered the resultant token is stored on a cookie and then the form continues submission as per normal. The server side code that handles the submision can then access the Arkose Labs token via the cookie and verify the token.

## Setup

This example replicates the Arkose Labs api.js file being injected and loaded into the page head tag and the remaining javascript to be injected before the closing body tag. Depending on CDN these would be injected by different methods.

Note: the Arkose Labs api.js file can be injected and loaded before the closing body tag if required.

## Configuration
In the example the Client-API file is loaded for the demo public key: `11111111-1111-1111-1111-111111111111`, to switch to another key the api.js script will need its url updated to point at the required key.

In the javascript loaded at the end of the body tag the following variables can be modified to allow specific behaviours

| Variable                  | Description                                                                  | Default            |
| ------------------------- | ---------------------------------------------------------------------------- | ------------------ |
| arkoseMaxRetryCount       | The number of retries to perform when there is an error                      | 2                  |
| arkoseCookieName          | The name of the cookie that the Arkose token will be stored in               | `arkoseToken`      |
| arkoseErrorCookieName     | The name of the cookie that an Arkose error will be stored in                | `arkoseError`      |
| arkoseCookieLife          | The length of time the Arkose cookies should be active for (in milliseconds) | 300000 (5 minutes) |
| formSelector              | The querySelector string used for selecting the required form to protect     | `#submitForm`      |

