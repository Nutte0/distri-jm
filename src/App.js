import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Clientes from './components/Clientes';
import Empleados from './components/Empleados';
import Boletas from './components/Boletas';
import ConfirmEmail from './components/ConfirmEmail';

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

          <Route 
          path="/empleados" 
          element={
            <>
              <Navbar />
              <Empleados/>
            </>
          } 
        />
   
       
          <Route 
          path="/ConfirmEmail" 
          element={
            <>
              <Navbar />
              <ConfirmEmail/>
            </>
          } 
        />
   

          <Route 
          path="/Boletas" 
          element={
            <>
              <Navbar />
              <Boletas/>
            </>
          } 
        />
        </Routes>
    </Router>
  );
};

export default App;
