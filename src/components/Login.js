import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'email') setEmail(value);
    if (id === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      if (data && data.user) {
        console.log('Login successful', data);
        navigate('/Home');
      } else {
        setError('No se recibió ningún usuario en la respuesta');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message);
    }
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleChange}
            placeholder="Ingresa tu correo electrónico"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Clave</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handleChange}
            placeholder="Ingresa tu clave"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="btn">Ingresar</button>
        <button type="button" className="btn btn-secondary" onClick={handleRegisterClick}>
          Crear cuenta nueva
        </button>
      </form>
    </div>
  );
};

export default Login;