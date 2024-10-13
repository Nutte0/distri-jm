import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import bcrypt from 'bcryptjs'; // Importar bcrypt para hashear contraseñas
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

    // Validar que la contraseña tenga al menos 6 caracteres
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    try {
      // Registro en Supabase Auth
      const { user, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (authError) {
        if (authError.message.includes('48 seconds')) {
          setError('Por razones de seguridad, solo puedes intentar registrarte de nuevo después de 48 segundos.');
        } else {
          setError('Error de autenticación: ' + authError.message);
        }
        return;
      }

      if (!user) {
        setError('No se recibió ningún usuario en la respuesta.');
        return;
      }

      // Hashear la contraseña antes de insertarla en la base de datos
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Insertar el usuario en la tabla 'users'
      const { data, error: dbError } = await supabase
        .from('users')
        .insert([{ 
          username, 
          email, 
          password: hashedPassword // Guardar la contraseña hasheada
        }]);

      if (dbError) throw dbError;

      console.log('Usuario registrado en la tabla users:', data);
      navigate('/Home'); // Redirigir al usuario después del registro
    } catch (error) {
      setError('Error al registrar usuario: ' + error.message);
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
        <button type="submit" className="btn">Registrarse</button>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default Register;
