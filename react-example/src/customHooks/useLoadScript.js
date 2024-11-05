import { useState, useEffect, useRef } from 'react';

export function useLoadScript (options) {
  const { url, attributes = {}, retries, retryDelay, timeout = 7500 } = options;

  const [status, setStatus] = useState('loading'); // 'idle', 'loading', 'complete', 'error'
  const [error, setError] = useState(null);
  const [dataCallback, setDataCallback] = useState(null);
  const retriesRef = useRef(0);

  // useEffect
  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    let script = document.querySelector(`script[src='${url}']`) || document.createElement('script');
    let timeoutId = null;

    const handleLoad = () => {
      if (!isMounted) return;
      clearTimeout(timeoutId);
      setStatus('complete');
    };

    const handleFailure = () => {
      if (!isMounted) return;
      clearTimeout(timeoutId);
      retriesRef.current += 1;

      if (retriesRef.current < retries) {
        setTimeout(() => {
          // Remove the failed script
          script.parentNode.removeChild(script);
          script = document.createElement('script');
          loadScript();
        }, retryDelay);
      } else {
        setStatus('error');
        setError(new Error('LOAD_SCRIPT_MAX_RETRIES_ERROR'));
      }
    };

    const loadScript = () => {
      if (!isMounted) return;

      setStatus('loading');

      // Set script attributes
      script.type = 'text/javascript';
      script.src = url;
      script.defer = true;

      // Apply additional attributes (e.g., data-callback)
      Object.entries(attributes)
      // replace boolean attribute with empty string
        .map(([key, value]) => [key, typeof value === 'boolean' ? '' : value])
        .forEach(([key, value]) => {
          script.setAttribute(key, value);
        });

      // add the listeners here to watch the script.
      script.addEventListener('load', handleLoad);
      script.addEventListener('error', handleFailure);

      // Set up a timeout for the script load
      timeoutId = setTimeout(() => {
        handleFailure(`${timeout}ms timeout elapsed loading third-party script: ${url}`);
      }, timeout);

      document.body.appendChild(script);
    };

    loadScript();
    if (script.getAttribute('data-callback')) {
      setDataCallback(script.getAttribute('data-callback'));
    } else {
      setStatus('error');
      setError(new Error('DATA-CALLBACK-REQUIRED'));
    }

    return () => {
      isMounted = false;
      if (script) {
        script.removeEventListener('load', handleLoad);
        script.removeEventListener('error', handleFailure);
      }
      clearTimeout(timeoutId);
    };
  }, [url, retries, retryDelay, timeout, attributes]);

  return { status, error, dataCallback };
}
