import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Arkose from './Arkose';

const ForgotPassword = () => {
  const arkoseRef = useRef();
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const publicKey = process.env.REACT_APP_ARKOSE_PUBLIC_KEY;

  const onSubmit = () => {
    if (!token) return;
    navigate('/');
  };

  const onCompleted = (token) => {
    console.log('Token:', token);
    setToken(token);
  };

  const onError = (error) => {
    console.log('Error:', error);
  };

  return (
    <>
      <h2>Login</h2>
      <input type="text" id="email" name="email" placeholder="Email" />
      <button onClick={onSubmit} disabled={!token}>
        Reset
      </button>
      <br />
      <Link to="/">Login</Link>
      <Arkose
        publicKey={publicKey}
        selector="arkose-ec"
        mode="inline"
        onCompleted={onCompleted}
        onError={onError}
        ref={arkoseRef}
      />
    </>
  );
};
export default ForgotPassword;
