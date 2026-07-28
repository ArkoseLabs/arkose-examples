# arkose-angular-example
This example project provides a simple Angular 22 component that wraps the Arkose Labs Client API.
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

## Notes

- This demo navigates to `/dashboard` on the `completed` event. In production, send the token to your backend and verify it with the Arkose Verify API before trusting it — never authenticate on the client token alone.
- Pass a `nonce` input to `<arkose>` if you serve a strict `script-src` Content Security Policy.
- In modal mode, call the component's `run()` method (via `viewChild`) to trigger the challenge on form submit; inline mode renders the challenge in place via the `selector` input (a full CSS selector, e.g. `#arkose-inline`).
- On error the component checks the Arkose status page and auto-retries up to `maxRetries` times (default 2) before emitting `error`. Pass `[maxRetries]="0"` to disable.