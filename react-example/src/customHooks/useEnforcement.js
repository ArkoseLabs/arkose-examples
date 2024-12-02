import { useState, useEffect, useRef } from 'react';

export function useEnforcement ({ scriptDataCallback, scriptStatus, configProps, retries = 3, timeout = 7000 }) {
  const [enforcement, setEnforcement] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'complete', 'error'
  const retryCountRef = useRef(0);
  const timeoutIdRef = useRef(null);

  // useEffect to add the setupEnforcement callback to the window
  useEffect(() => {
    if (scriptStatus !== 'complete' || !scriptDataCallback) return;

    const setupEnforcement = (enforcementObject) => {
      setEnforcement(enforcementObject);
    };

    window[scriptDataCallback] = setupEnforcement;

    return () => {
      delete window.setupEnforcement;
    };
  }, [scriptStatus]);

  // useEffect to add
  useEffect(() => {
    if (!enforcement) return;

    const handleOnReady = () => {
      clearTimeout(timeoutIdRef.current);
      setStatus('complete');
      configProps.onReady && configProps.onReady();
    };

    const handleOnError = (error) => {
      clearTimeout(timeoutIdRef.current);
      setStatus('error');
      configProps.onError && configProps.onError(error);
    };

    const attemptSetConfig = () => {
      if (retryCountRef.current >= retries) {
        setStatus('error');
        configProps.onError && configProps.onError(new Error('ENFORCEMENT_MAX_RETRIES_ERROR'));
        return;
      }

      setStatus('loading');

      enforcement.setConfig({
        ...configProps,
        onReady: handleOnReady,
        onError: handleOnError
      });

      timeoutIdRef.current = setTimeout(() => {
        retryCountRef.current += 1;
        enforcement.reset();
        attemptSetConfig();
      }, timeout);
    };

    attemptSetConfig();

    return () => {
      clearTimeout(timeoutIdRef.current);
    };
  }, [enforcement, configProps, retries, timeout]);

  return { enforcement, status };
}

export default useEnforcement;
