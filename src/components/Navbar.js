import React from 'react';
import { FaUsers, FaUserTie, FaTicketAlt, FaBars } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Logo</h1>
      </div>
  
      <div className="secciones">
        <a href="#"><i className="fas fa-users"></i> Clientes</a>
        <a href="#"><i className="fas fa-user-tie"></i> Empleados</a>
        <a href="#"><i className="fas fa-ticket-alt"></i> Boletas</a>
      </div>
      
      <div className="Menu">
        <i className="fas fa-bars"></i>
      </div>
    </nav>
  );
};

export default Navbar;
