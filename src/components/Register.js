import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import '../styles/Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'username') setUsername(value);
    if (id === 'email') setEmail(value);
    if (id === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            username: username,
          }
        }
      });

      if (error) throw error;

      if (data && data.user) {
        console.log('Usuario registrado:', data.user);
        navigate('/Home');
      } else {
        setError('No se pudo completar el registro. Por favor, intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error de registro:', error);
      if (error.message.includes('Email address') && error.message.includes('not authorized')) {
        setError('Este correo electrónico no está autorizado para registrarse. Por favor, usa un correo electrónico diferente o contacta al administrador.');
      } else if (error.message.includes('48 seconds')) {
        setError('Por razones de seguridad, solo puedes intentar registrarte de nuevo después de 48 segundos.');
      } else {
        setError('Error al registrar usuario: ' + error.message);
      }
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">Nombre</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleChange}
            placeholder="Ingresa tu nombre"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleChange}
            placeholder="Ingresa tu correo"
            required
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
            required
          />
        </div>
        <button type="submit" className="btn">Registrarse</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Register;