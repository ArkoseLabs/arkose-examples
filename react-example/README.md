# arkose-react-example
This example project provides a simple React 19 component that wraps the Arkose Labs Client API.
More details of how to implement the Arkose Labs API can be found at https://developer.arkoselabs.com

## Run Locally

#### Install dependencies

```bash
  npm install
```

#### Setup VITE_ARKOSE_PUBLIC_KEY

Copy `.env.example` to `.env` and replace `<YOUR_PUBLIC_KEY>` with the public key set up for your account.

#### Start the server

```bash
  npm run dev
```

## Documentation

It contains a shared arkose component.

- Arkose: Arkose Enforcement Challenge over a Modal mode or in Inline mode on HTML page

#### To Show Arkose Modal

```http
  http://localhost:5173/
```

#### To Show Inline Arkose

```http
  http://localhost:5173/forgot-password
```

Once Arkose Verification/Challenge is completed in login page, it will navigate to

```http
  http://localhost:5173/dashboard
```

The Arkose integration uses a shared component that injects the Arkose Client API script. The public key is stored in an environment file and passed to the script URL. A callback function is bound to the Window Object before the script loads to avoid race conditions. The various usages of Callback Functions are available for perusal in [Arkose Development Documentation](https://developer.arkoselabs.com)

## Notes

- This demo navigates to `/dashboard` on `onCompleted`. In production, send the token to your backend and verify it with the Arkose Verify API before trusting it — never authenticate on the client token alone.
- Pass a `nonce` prop to `<Arkose>` if you serve a strict `script-src` Content Security Policy.
- In modal mode, call the component's `run()` method (via a ref) to trigger the challenge on form submit; inline mode renders the challenge in place via the `selector` prop.
