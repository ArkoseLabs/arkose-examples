# Auth0 - Cloudflare Worker proxy

This is an example of a Cloudflare worker that can be setup as a proxy with Auth0 integrations both injecting client side script and handling the verification on the CDN level. This worker would be setup to work as a proxy for Auth0 login requests, on the GET based login screen for Auth0 this proxy would inject javascript into the page that would hijack the form submission and load an Arkose challenge on submission. On the POST based login request this worker would intercept the request, extract the Arkose token from a definied cookie and verify the token. On successful verification the request would continue, on failed verification the request would redirect to a defined login page.

## Configuration
This worker includes several environment variables that can be setup to customise the behaviour of the worker.

| Variable            | Description                                                                          | Default                                |
| ------------------- | ------------------------------------------------------------------------------------ | -------------------------------------- |
| publicKey           | The Arkose public key to use in this worker                                          | `11111111-1111-1111-1111-111111111111` |
| privateKey          | The Arkose private key to use in this worker                                         | ``                                     |
| errorUrl            | A url to redirect error states to if required                                        | `https://arkoselabs.com`               |
| cookieName          | The name of the cookie that the token will be passed in                              | `arkose-token`                         |
| failOpen            | A boolean to indicate if we should fail open or not                                  | `true`                                 |
| verifyMaxRetryCount | The number of times to retry verification if there is an error                       | `3`                                    |
| scriptMaxRetryCount | The number of times to retry resetting Arkose if there is a client side error        | `3`                                    |
