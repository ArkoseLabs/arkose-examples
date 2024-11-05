import React, { useMemo, forwardRef, useImperativeHandle, useCallback } from 'react';
import PropTypes from 'prop-types';

import { useLoadScript } from '../customHooks/useLoadScript';
import { useEnforcement } from '../customHooks/useEnforcement';

function ArkoseFunc (props, ref) {
  const {
    publicKey,
    nonce,
    selector,
    mode,
    retries,
    retryDelay,
    timeout,
    onReady,
    onShown,
    onShow,
    onSuppress,
    onCompleted,
    onReset,
    onHide,
    onError,
    onFailed
  } = props;

  const scriptAttributes = useMemo(
    () => ({
      'data-callback': 'setupEnforcement',
      ...(nonce && { 'data-nonce': nonce })
    }),
    [nonce]
  );

  const { status: scriptStatus, dataCallback: scriptDataCallback } = useLoadScript({
    url: `https://client-api.arkoselabs.com/v2/${publicKey}/api.js`,
    attributes: scriptAttributes,
    retries,
    retryDelay,
    timeout
  });
    // Memoize the callbacks individually at the top level
  const memoizedOnReady = useCallback(onReady, [onReady]);
  const memoizedOnShown = useCallback(onShown, [onShown]);
  const memoizedOnShow = useCallback(onShow, [onShow]);
  const memoizedOnSuppress = useCallback(onSuppress, [onSuppress]);
  const memoizedOnCompleted = useCallback(onCompleted, [onCompleted]);
  const memoizedOnReset = useCallback(onReset, [onReset]);
  const memoizedOnHide = useCallback(onHide, [onHide]);
  const memoizedOnError = useCallback(onError, [onError]);
  const memoizedOnFailed = useCallback(onFailed, [onFailed]);

  // Memoize configProps using useMemo
  const configProps = useMemo(
    () => ({
      selector,
      mode,
      onReady: memoizedOnReady,
      onShown: memoizedOnShown,
      onShow: memoizedOnShow,
      onSuppress: memoizedOnSuppress,
      onCompleted: memoizedOnCompleted,
      onReset: memoizedOnReset,
      onHide: memoizedOnHide,
      onError: memoizedOnError,
      onFailed: memoizedOnFailed
    }),
    [
      selector,
      mode,
      memoizedOnReady,
      memoizedOnShown,
      memoizedOnShow,
      memoizedOnSuppress,
      memoizedOnCompleted,
      memoizedOnReset,
      memoizedOnHide,
      memoizedOnError,
      memoizedOnFailed
    ]
  );

  const { status: enforcementStatus, enforcement } = useEnforcement({
    scriptStatus,
    scriptDataCallback,
    configProps,
    retries,
    timeout
  });

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    run: () => {
      if (enforcement) {
        enforcement.run();
      } else {
        console.error('Arkose enforcement is not ready yet.');
      }
    }
  }));

  if (scriptStatus === 'error' || enforcementStatus === 'error') {
    return <div>Error loading Arkose Labs challenge.</div>;
  }

  return (
    <>
      {mode === 'inline' && <div id={selector?.slice(1)}></div>}
    </>
  );
};

const Arkose = forwardRef(ArkoseFunc);

ArkoseFunc.propTypes = {
  publicKey: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['inline', 'lightbox']),
  selector: PropTypes.string,
  nonce: PropTypes.string,
  retries: PropTypes.number,
  retryDelay: PropTypes.number,
  timeout: PropTypes.number,
  onReady: PropTypes.func,
  onShown: PropTypes.func,
  onShow: PropTypes.func,
  onSuppress: PropTypes.func,
  onCompleted: PropTypes.func,
  onReset: PropTypes.func,
  onHide: PropTypes.func,
  onError: PropTypes.func,
  onFailed: PropTypes.func
};

ArkoseFunc.defaultProps = {
  mode: 'lightbox',
  selector: '#arkose-enforcement-container',
  retries: 3,
  timeout: 7000, // 7 seconds
  onReady: () => {},
  onShown: () => {},
  onShow: () => {},
  onSuppress: () => {},
  onCompleted: () => {},
  onReset: () => {},
  onHide: () => {},
  onError: () => {},
  onFailed: () => {}
};

// Also assign propTypes and defaultProps to the outer component
Arkose.propTypes = ArkoseFunc.propTypes;
Arkose.defaultProps = ArkoseFunc.defaultProps;

export default Arkose;
