export const ArkoseChallenge = ({ arkosePublicKey, arkoseHostname }) => `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0" />
    <script
      data-callback="setupEnforcement"
      src="${arkoseHostname}/v2/${arkosePublicKey}/api.js"
    ></script>
    <script type="text/javascript">
      // Setup the enforcement API
      function setupEnforcement(arkoseEnforcement) {
        var arkose = arkoseEnforcement.setConfig({
          selector: "#challenge",

          // We are using 'inline' as we want the session to be created as soon as the page loads
          mode: "inline",
          data: { id: "failwhale" },

          // These are the functions that can be called when the enforcement API is tiggered
          onCompleted: function (response) {
            // When a challenge has been completed, send the response from the challenge back to the native iOS code.
            // The token from this data will then be used within the server-side verification API call to Arkose
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
    <!-- This is the element into which the challenge will be rendered if necessary -->
    <div id="challenge"></div>
  </body>
</html>
`;
