# Akamai EdgeWorker Inject Pattern Example
This example pattern utilises an EdgeWorker to inject Arkose into a HTML file. Using Akamai's `responseProvider`, a HTML file is fetched and then the required code to setup an Arkose Challenge is injected. There are a multiple configurable variables required, which can be found [here](#configuration).

## Configuration
This worker includes several variables that can be setup to customise the behaviour of the worker.

| Variable              | Description                                                           | Default                                |
| --------------------- | --------------------------------------------------------------------- | -------------------------------------- |
| publicKey             | The Arkose public key to use in this worker                           | `11111111-1111-1111-1111-111111111111` |
| filePath              | The path to the HTML to be injected                                   | `/path/to/file.html`                   |
| arkoseMaxRetryCount   | The number of retries to perform when there is an error               | `2`                                    |
| arkoseCookieName      | The name of the cookie that the Arkose token will be stored in        | `arkose-token`                         |
| arkoseErrorCookieName | The name of the cookie that an Arkose error will be stored in         | `arkoseError`                          |
| arkoseCookieLife      | The length of time that the cookie should be active for               | `5 * 60 * 1000`                        |
| buttonSelector        | String used for selecting the required button to protect              | `submitButton`                         |
