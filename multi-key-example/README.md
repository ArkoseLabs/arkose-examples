# arkose-multi-key-example

This example provides a simple HTML/JS page that utilises the Arkose Labs Client API with two different Public Keys on the same page. This allows a single page to load and trigger multiple Enforcement Challenges, i.e. different buttons can trigger different ECs on the same page.
More details of how to implement the Arkose Labs API can be found at https://developer.arkoselabs.com

## Run Locally

#### Install dependencies

```bash
  npm install
```

#### Setup Public Keys

Replace `<YOUR_PUBLIC_KEY_1>` and `<YOUR_PUBLIC_KEY_2>` with the public keys set up for your account in both the index.html file and, if applicable, the iframe.html file.

#### Start the server

```bash
  npm run start
```

#### Start the server with multi iFrame example

```bash
  npm run start-iframe
```

Access the page at http://localhost:1234/.

## Documentation

The `Load JS` button will load the JS relevant to the Public Key above the button. Once the JS loads, the `Open EC` button should be enabled. Click the `Open EC` button to open the Challenge relevant to the Public Key.
