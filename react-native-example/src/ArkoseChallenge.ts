interface ArkoseChallengeOptions {
  publicKey: string;
  hostname?: string;
}

export function buildArkoseHtml({ publicKey, hostname = 'https://client-api.arkoselabs.com' }: ArkoseChallengeOptions): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
    <script
      data-callback="setupEnforcement"
      src="${hostname}/v2/${publicKey}/api.js"
      async
    ></script>
    <script type="text/javascript">
      function setupEnforcement(arkoseEnforcement) {
        arkoseEnforcement.setConfig({
          selector: "#challenge",
          mode: "inline",
          onCompleted: function (response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ callback: "onCompleted", token: response.token }));
          },
          onReady: function () {
            window.ReactNativeWebView.postMessage(JSON.stringify({ callback: "onReady" }));
          },
          onReset: function () {
            window.ReactNativeWebView.postMessage(JSON.stringify({ callback: "onReset" }));
          },
          onHide: function () {
            window.ReactNativeWebView.postMessage(JSON.stringify({ callback: "onHide" }));
          },
          onSuppress: function () {
            window.ReactNativeWebView.postMessage(JSON.stringify({ callback: "onSuppress" }));
          },
          onShown: function () {
            window.ReactNativeWebView.postMessage(JSON.stringify({ callback: "onShown" }));
          },
          onShow: function () {
            window.ReactNativeWebView.postMessage(JSON.stringify({ callback: "onShow" }));
          },
          onError: function (response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ callback: "onError", response: response }));
          },
          onFailed: function (response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ callback: "onFailed", response: response }));
          },
        });
      }
    </script>
  </head>
  <body style="display: flex; justify-content: center; margin: 0 auto;">
    <div id="challenge"></div>
  </body>
</html>`;
}
