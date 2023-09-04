# Auth0 - Cloudflare Worker proxy

This is an example of a Cloudflare worker that can be setup as a proxy with Auth0 integrations both injecting client side script and handling the verification on the CDN level. This worker would be setup to work as a proxy for Auth0 requests, on the GET based login screen for Auth0 this proxy would inject javascript into the page that would hijack the form submission and load an Arkose challenge on submission. On the POST based request this worker would intercept the request, extract the Arkose token from a definied cookie and verify the token. On successful verification the request would continue, on failed verification the request would redirect to a defined login page.

## Configuration
This worker includes several environment variables that can be setup to customise the behaviour of the worker.

| Variable              | Description                                                                          | Default                                |
| --------------------- | ------------------------------------------------------------------------------------ | -------------------------------------- |
| publicKey             | The Arkose public key to use in this worker, avaliable via the portal                | `11111111-1111-1111-1111-111111111111` |
| privateKey            | The Arkose private key to use in this worker, avaliable via the portal               | `11111111-1111-1111-1111-111111111111` |
| clientSubdomain       | Client subdomain name provided to you via the Arkose Labs team                       | `client-api`                           |
| verifySubdomain       | Verify subdomain name provided to you via Arkose Labs team                           | `verify-api`                           |
| errorUrl              | A page to route the user to when an error occurs (outside of fail open)              | `"https://www.arkoselabs.com"`         |
| arkoseCookieLife      | The length of time the Arkose cookies should be active for (in milliseconds)         | `30000 (5 minutes)`                    |
| arkoseCookieName      | The name of the cookie that the Arkose token will be stored in                       | `arkoseToken`                          |
| arkoseErrorCookieName | The name of the cookie that an Arkose error will be stored in                        | `arkoseError`                          |
| scriptMaxRetryCount   | The number of times to retry resetting Arkose if there is a client side error        | `3`                                    |
| verifyMaxRetryCount   | The number of times to retry verification if there is an error                       | `3`                                    |
| failOpen              | A boolean to indicate if we should fail open or not in case of outage                | `true`                                 |
