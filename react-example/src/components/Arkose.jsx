import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

const Arkose = forwardRef(function Arkose({
  publicKey,
  mode,
  selector,
  nonce,
  onReady = () => {},
  onShown = () => {},
  onShow = () => {},
  onSuppress = () => {},
  onCompleted = () => {},
  onReset = () => {},
  onHide = () => {},
  onError = () => {},
  onFailed = () => {},
}, ref) {
  const enforcementRef = useRef(null);
  const scriptId = `arkose-script-${publicKey}`;

  useImperativeHandle(ref, () => ({
    run: () => enforcementRef.current?.run(),
  }));

  const callbacksRef = useRef({
    onReady, onShown, onShow, onSuppress, onCompleted,
    onReset, onHide, onError, onFailed,
  });
  callbacksRef.current = {
    onReady, onShown, onShow, onSuppress, onCompleted,
    onReset, onHide, onError, onFailed,
  };

  const setupEnforcement = useCallback((myEnforcement) => {
    enforcementRef.current = myEnforcement;
    myEnforcement.setConfig({
      selector,
      mode,
      onReady: () => callbacksRef.current.onReady(),
      onShown: () => callbacksRef.current.onShown(),
      onShow: () => callbacksRef.current.onShow(),
      onSuppress: () => callbacksRef.current.onSuppress(),
      onCompleted: (response) => callbacksRef.current.onCompleted(response.token),
      onReset: () => callbacksRef.current.onReset(),
      onHide: () => callbacksRef.current.onHide(),
      onError: (response) => callbacksRef.current.onError(response?.error?.error),
      onFailed: (response) => callbacksRef.current.onFailed(response),
    });
  }, [selector, mode]);

  useEffect(() => {
    window.setupEnforcement = setupEnforcement;

    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://client-api.arkoselabs.com/v2/${publicKey}/api.js`;
    script.setAttribute('data-callback', 'setupEnforcement');
    script.async = false;
    script.onerror = () => callbacksRef.current.onError('Script load failed');
    if (nonce) {
      script.setAttribute('data-nonce', nonce);
    }
    document.body.appendChild(script);

    return () => {
      if (window.setupEnforcement === setupEnforcement) { delete window.setupEnforcement; }
      const el = document.getElementById(scriptId);
      if (el) el.remove();
    };
  }, [publicKey, nonce, setupEnforcement]);

  if (mode === 'inline' && selector) {
    return <div id={selector.replace(/^#/, '')} />;
  }
  return null;
});

export default Arkose;
