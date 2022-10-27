# arkose-angular-example
This example project provides a simple Angular (14) component that wraps the Arkose Labs Client API.
More details of how to implement the Arkose Labs API can be found at https://developer.arkoselabs.com

## Run Locally

Go to the project directory

```bash
  cd arkose-angular-example
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Documentation

It contains a shared module which has arkose component.

- arkose: Arkose Enforcement Challenge over a Modal mode or in Inline mode on HTML page

#### To Show Arkose Modal

```http
  http://localhost:4200/login/modal
```

#### To Show Inline Arkose

```http
  http://localhost:4200/login/inline
```

Once Arkose Verification/Challenge is completed in login page, it will navigate to

```http
  http://localhost:4200/dashboard
```

In the Shared Modules, we have integrated Arkose security enforcement components. There is an Arkose Script Service which injects the requisite script. When the script is injected, the passing public key which is stored on an environment file is also passed along. Once the script is loaded, the workflow binds the callback function to a Window Object. The various usages of Callback Functions are available for perusal in [Arkose Development Documentation](https://developer.arkoselabs.com)

#### We have used NgZone in order to reenter Angular zone from a arkose task that was executed outside of the Angular zone.