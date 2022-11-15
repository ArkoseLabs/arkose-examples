# arkose-vue-example
This example project provides a simple React(v18) component that wraps the Arkose Labs Client API.
More details of how to implement the Arkose Labs API can be found at https://developer.arkoselabs.com

## Run Locally

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Documentation

It contains a shared arkose component.

- Arkose: Arkose Enforcement Challenge over a Modal mode or in Inline mode on HTML page

#### To Show Arkose Modal

```http
  http://localhost:3000/
```

#### To Show Inline Arkose

```http
  http://localhost:3000/forgot-password
```

Once Arkose Verification/Challenge is completed in login page, it will navigate to

```http
  http://localhost:3000/dashboard
```

We have integrated Arkose security enforcement as a shared component. There is a loadScript function which injects the requisite script. When the script is injected, the passing public key which is stored on an environment file is also passed along. Once the script is loaded, the workflow binds the callback function to a Window Object. The various usages of Callback Functions are available for perusal in [Arkose Development Documentation](https://developer.arkoselabs.com)
