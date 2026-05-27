# arkose-angular-example
This example project provides a simple Angular 19 component that wraps the Arkose Labs Client API.
More details of how to implement the Arkose Labs API can be found at https://developer.arkoselabs.com

## Run Locally

#### Install dependencies

```bash
  npm install
```

#### Setup Public Key

Replace `<YOUR_PUBLIC_KEY>` with the public key set up for your account in both the environment.ts file and, if applicable, the environment.prod.ts file.

#### Start the server

```bash
  npm run start
```

## Documentation

It contains a standalone Arkose component.

- arkose: Arkose Enforcement Challenge over a Modal mode or in Inline mode on HTML page

#### To Show Arkose Modal

```http
  http://localhost:4200/login-modal
```

#### To Show Inline Arkose

```http
  http://localhost:4200/
```

Once Arkose Verification/Challenge is completed in login page, it will navigate to

```http
  http://localhost:4200/dashboard
```

The Arkose integration uses a standalone component with an injectable script service. The public key is stored in environment files. Once the script loads, the callback function is bound to a Window Object. NgZone is used to re-enter Angular's zone from Arkose callbacks that execute outside it. The various usages of Callback Functions are available for perusal in [Arkose Development Documentation](https://developer.arkoselabs.com)