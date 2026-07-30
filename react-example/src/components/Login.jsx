import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import Arkose from './Arkose';

export default function Login() {
  const arkoseRef = useRef();
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const publicKey = import.meta.env.VITE_ARKOSE_PUBLIC_KEY;

  const onSubmit = () => {
    if (!token) {
      arkoseRef.current?.run();
      return;
    }
    navigate('/dashboard');
  };

  const onCompleted = (arkoseToken) => {
    setToken(arkoseToken);
    navigate('/dashboard');
  };

  const onError = (message) => { alert(message); };

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
        ref={arkoseRef}
      />
    </>
  );
}
