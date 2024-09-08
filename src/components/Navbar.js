import React from 'react';
import { FaUsers, FaUserTie, FaTicketAlt, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Redirigir paginas
  const handleClientesClick = () => {
    navigate('/clientes'); 
  };

  const handleEmpleadosClick = () => {
    navigate('/empleados');
  };

  const handleBoletasClick = () => {
    navigate('/boletas'); 
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Logo</h1>
      </div>
  
      <div className="secciones">
        <a onClick={handleClientesClick}><i className="fas fa-users"></i> Clientes</a>
        <a onClick={handleEmpleadosClick}><i className="fas fa-user-tie"></i> Empleados</a>
        <a onClick={handleBoletasClick}><i className="fas fa-ticket-alt"></i> Boletas</a>
      </div>
      
      <div className="Menu">
        <i className="fas fa-bars"></i>
      </div>
    </nav>
  );
};

export default Navbar;
