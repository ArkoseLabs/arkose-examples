# Server Side - Cloudflare Worker proxy

This is an example of a Cloudflare worker that can be setup as a cdn proxy. This worker would be setup to work as a proxy for requests, it would intercept any requests extract an Arkose token from the request and verify the token. If the verification is successful the request would continue, if not successful the proxy can redirect to an error page.

For more details on how to use this worker please refer to our [developer docs](https://developer.arkoselabs.com/docs/arkose-on-cloudflare-reference-architecture).

## Configuration
This worker includes several environment variables that can be setup to custmise the behaviour of the worker.

| Variable                  | Description                                                     | Default                                |
| ------------------- | --------------------------------------------------------------------- | -------------------------------------- |
| publicKey           | The Arkose public key to use in this worker                           | `11111111-1111-1111-1111-111111111111` |
| privateKey          | The Arkose private key to use in this worker                          | ``                                     |
| errorUrl            | A url to redirect error states to if required                         | `https://arkoselabs.com`               |
| tokenMethod         | The method used for extracting the token, can be `header` or `cookie` | `header`                               |
| tokenIdentifier     | The name of the field or cookie the token will be passed in           | `arkose-token`                         |
| failOpen            | A boolean to indicate if we should fail open or not                   | `true`                                 |
| verifyMaxRetryCount | The number of times to retry verification if there is an error        | `3`                                    |
