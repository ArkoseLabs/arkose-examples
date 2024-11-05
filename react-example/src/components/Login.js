import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Arkose from './Arkose';

const Login = () => {
  const arkoseRef = useRef();
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const publicKey = process.env.REACT_APP_ARKOSE_PUBLIC_KEY;

  const onSubmit = () => {
    if (!token) {
      if (arkoseRef.current && arkoseRef.current.run) {
        arkoseRef.current.run();
      } else {
        console.error('Arkose is not ready yet.');
      }
      return;
    }
    navigate('/dashboard');
  };

  const onCompleted = (token) => {
    console.log('Token:', token);
    setToken(token);
    navigate('/dashboard');
  };

  const onError = (error) => {
    console.log('Error:', error);
  };

  return (
    <>
      <h2>Login</h2>
      <input type="text" id="email" name="email" placeholder="Email" />
      <input type="password" id="password" name="password" placeholder="Password" />
      <button onClick={onSubmit}>Login</button>
      <br />
      <Link to="/forgot-password">Forgot Password</Link>
      <Arkose
        publicKey={publicKey}
        onCompleted={onCompleted}
        onError={onError}
        retries={3}
        timeout={7000} // 7 seconds
        retryDelay={500} // 0.5 seconds
        ref={arkoseRef}
      />
    </>
  );
};

export default Login;
