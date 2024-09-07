import React from 'react';
import '../styles/Register.css'; 

const Register = () => {
  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form>
        <div className="input-group">
          <label htmlFor="username">Nombre</label>
          <input type="text" id="username" placeholder="Ingresa tu nombre" />
        </div>
        <div className="input-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input type="email" id="email" placeholder="Ingresa tu correo" />
        </div>
        <div className="input-group">
          <label htmlFor="password">Clave</label>
          <input type="password" id="password" placeholder="Ingresa tu clave" />
        </div>
        <button type="submit" className="btn">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
