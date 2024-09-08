import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Asegúrate de que la ruta es correcta
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === 'email') setEmail(value);
    if (id === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Buscar el correo electrónico asociado al nombre de usuario
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email) 
        .single(); 

      if (fetchError) throw fetchError;

      if (!user) throw new Error('User not found');

      // Iniciar sesión con el correo electrónico y la clave
      const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (error) throw error;

      console.log('Login successful', data);
      navigate('/Home');
    } catch (error) {
      console.error('Login error:', error.message);
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
        <button type="submit" className="btn">Ingresar</button>
        <button type="button" className="btn btn-secondary" onClick={handleRegisterClick}>
          Crear cuenta nueva
        </button>
      </form>
    </div>
  );
};

export default Login;
