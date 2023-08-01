# Akamai EdgeWorker Proxy Pattern Example
This example pattern utilises an EdgeWorker to work as a proxy for requests, it would intercept any requests extract an Arkose token from the request and verify the token. If the verification is successful; another request is made to mimic a customer's login credential verification flow, if not successful the proxy can redirect to an error page.

This example is in conjunction with the akamai-proxy Client example.

## Configuration
This worker includes several environment variables that can be setup to customise the behaviour of the worker. Akamai uses User Defined Variables which can be added via property configuration.

| Variable                  | Description                                                     | Default                                |
| ------------------- | --------------------------------------------------------------------- | -------------------------------------- |
| privateKey          | The Arkose private key to use in this worker                          | ``                                     |
| errorUrl            | A url to redirect error states to if required                         | `https://arkoselabs.com`               |
| tokenMethod         | The method used for extracting the token, can be `header` or `cookie` | `header`                               |
| tokenIdentifier     | The name of the field or cookie the token will be passed in           | `arkose-token`                         |
| failOpen            | A bolean to indicate if we should fail open or not                    | `true`                                 |
| verifyMaxRetryCount | The number of times to retry verification if there is an error        | `3`                                    |
