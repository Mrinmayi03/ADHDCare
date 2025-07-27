// src/pages/Login.tsx
import React, { useState, useContext } from 'react';
import { AuthContext } from '../pages/AuthText';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [u, setU] = useState(''), [p, setP] = useState('');
  const nav = useNavigate();

  return (
    <form onSubmit={async e => {
      e.preventDefault();
      try {
        await login(u, p);
        nav('/tasks');
      } catch {
        alert('Invalid creds');
      }
    }}>
      <input value={u} onChange={e => setU(e.target.value)} placeholder="Username"/>
      <input type="password" value={p} onChange={e => setP(e.target.value)} placeholder="Password"/>
      <button type="submit">Log in</button>
    </form>
  );
}
