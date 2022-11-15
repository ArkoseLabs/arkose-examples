import React from 'react';
import PropTypes from 'prop-types';

export default class Arkose extends React.Component {
  constructor () {
    super();
    this.myEnforcement = null;
  }

  // Append the JS tag to the Document Body.
  loadScript = () => {
    const scriptId = 'arkose-script';
    const currentScript = document.getElementById(scriptId);
    if (currentScript) {
      currentScript.remove();
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.src = `https://client-api.arkoselabs.com/v2/${this.props.publicKey}/api.js`;
    script.setAttribute('data-callback', 'setupEnforcement');
    script.async = true;
    script.defer = true;
    if (this.props.nonce) {
      script.setAttribute('data-nonce', this.props.nonce);
    }
    document.body.appendChild(script);
    return script;
  };

  setupEnforcement = (myEnforcement) => {
    this.myEnforcement = myEnforcement;
    this.myEnforcement.setConfig({
      selector: this.props.selector && `#${this.props.selector}`,
      mode: this.props.mode,
      onReady: () => {
        if (this.props.onReady) {
          this.props.onReady();
        }
      },
      onShown: () => {
        if (this.props.onShown) {
          this.props.onShown();
        }
      },
      onShow: () => {
        if (this.props.onShow) {
          this.props.onShow();
        }
      },
      onSuppress: () => {
        if (this.props.onSuppress) {
          this.props.onSuppress();
        }
      },
      onCompleted: (response) => {
        if (this.props.onCompleted) {
          this.props.onCompleted(response.token);
        }
      },
      onReset: () => {
        if (this.props.onReset) {
          this.props.onReset();
        }
      },
      onHide: () => {
        if (this.props.onHide) {
          this.props.onHide();
        }
      },
      onError: (response) => {
        if (this.props.onError) {
          this.props.onError(response?.error);
        }
      },
      onFailed: (response) => {
        if (this.props.onFailed) {
          this.props.onFailed(response);
        }
      }
    });
  };

  componentDidMount () {
    const scriptElement = this.loadScript();
    // This will inject required html and css after the Arkose script is properly loaded
    scriptElement.onload = () => {
      console.log('Arkose API Script loaded');
      window.setupEnforcement = this.setupEnforcement.bind(this);
    };
    // If there is an error loading the Arkose script this callback will be called
    scriptElement.onerror = () => {
      console.log('Could not load the Arkose API Script!');
    };
  }

  componentWillUnmount () {
    if (window.setupEnforcement) {
      delete window.setupEnforcement;
    }
  }

  render () {
    return (
      <>
        {this.props.mode === 'inline' && <div id={this.props.selector}></div>}
      </>
    );
  }
}

Arkose.propTypes = {
  publicKey: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['inline', 'lightbox']),
  selector: PropTypes.string,
  nonce: PropTypes.string,
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
