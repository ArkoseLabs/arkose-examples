import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Arkose from './Arkose';

export default function ForgotPassword() {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const publicKey = import.meta.env.VITE_ARKOSE_PUBLIC_KEY;

  const onSubmit = () => {
    if (!token) return;
    navigate('/');
  };

  const onCompleted = (arkoseToken) => {
    setToken(arkoseToken);
  };

  return (
    <>
      <h2>Forgot Password</h2>
      <input type="text" id="email" name="email" placeholder="Email" />
      <button onClick={onSubmit} disabled={!token}>
        Reset
      </button>
      <br />
      <Link to="/">Login</Link>
      <Arkose
        publicKey={publicKey}
        selector="#arkose-ec"
        mode="inline"
        onCompleted={onCompleted}
      />
    </>
  );
}
