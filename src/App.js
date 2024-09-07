import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register'; // Importa el componente Register
import Home from './components/Home';
import Clientes from './components/Clientes';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas sin Navbar */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas con Navbar */}
        <Route 
          path="/home" 
          element={
            <>
              <Navbar />
              <Home />
            </>
          } 
        />
           <Route 
          path="/clientes" 
          element={
            <>
              <Navbar />
              <Clientes />
            </>
          } 
        />

       
      </Routes>
    </Router>
  );
};

export default App;
