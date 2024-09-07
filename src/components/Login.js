import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'username') setUsername(value);
    if (id === 'password') setPassword(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted', { username, password });
  };

  const handleRegisterClick = () => {
    navigate('/register'); 
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Nombre</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
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
        <button type="submit" className="btn">Ingresar</button>
        <button type="button" className="btn btn-secondary" onClick={handleRegisterClick}>
          Crear cuenta nueva
        </button>
      </form>
    </div>
  );
};

export default Login;
