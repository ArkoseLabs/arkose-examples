# Client Side Proxy Verify Example

This is an example of client side integration that allows a form submission to be protected by the Arkose Labs platform via a proxy call to Arkose's Verify endpoint. This integration hijacks the click event of a button and initilises either Arkose Detect or Enforcement when the click event is triggered. When onComplete is triggered, a POST request is made to trigger the Akamai EdgeWorker that will proxy the request to Arkose Verify and, if appropriate, make the subsequent request to verify the user's login credentials.

This example is in conjunction with the Akamai EdgeWorker Proxy example.

## Configuration
The placeholder `<YOUR_PUBLIC_KEY>` in the example must be replaced with the public key setup for your account to ensure the api.js script works properly.

In the javascript loaded at the end of the body tag the following variables can be modified to allow specific behaviours.

| Variable                  | Description                                                                  | Default            |
| ------------------------- | ---------------------------------------------------------------------------- | ------------------ |
| arkoseCookieName          | The name of the cookie that the Arkose token will be stored in               | `arkoseToken`      |
| arkoseErrorCookieName     | The name of the cookie that an Arkose error will be stored in                | `arkoseError`      |
| arkoseCookieLife          | The length of time the Arkose cookies should be active for (in milliseconds) | 300000 (5 minutes) |
| buttonSelector            | The querySelector string used for selecting the required button to protect   | `#submitButton`    |

