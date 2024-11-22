# Client Side Button Takeover Example

This is an example client side integration that allows a button click action to be protected by the Arkose Labs platform with little effort. This integration hijacks the click event of a button and initilises either Arkose Detect or Enforcement when the click event is triggered, after the Arkose Labs onComplete callback is triggered the resultant token is stored on a cookie and then click action performs as per normal.

## Setup

This example replicates the Arkose Labs api.js file being injected and loaded into the page head tag and the remaining javascript to be injected before the closing body tag. Depending on CDN these would be injected by different methods.

Note: the Arkose Labs api.js file can be injected and loaded before the closing body tag if required.

## Configuration
The placeholder `<YOUR_PUBLIC_KEY>` in the example must be replaced with the public key setup for your account to ensure the api.js script works properly.

In the javascript loaded at the end of the body tag the following variables can be modified to allow specific behaviours

| Variable                  | Description                                                                  | Default            |
| ------------------------- | ---------------------------------------------------------------------------- | ------------------ |
| arkoseMaxRetryCount       | The number of retries to perform when there is an error                      | 2                  |
| arkoseCookieName          | The name of the cookie that the Arkose token will be stored in               | `arkoseToken`      |
| arkoseErrorCookieName     | The name of the cookie that an Arkose error will be stored in                | `arkoseError`      |
| arkoseCookieLife          | The length of time the Arkose cookies should be active for (in milliseconds) | 300000 (5 minutes) |
| buttonSelector            | The querySelector string used for selecting the required button to protect   | `#submitButton`    |
