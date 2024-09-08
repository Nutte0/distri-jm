import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; 
import '../styles/Clientes.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [nuevoCliente, setNuevoCliente] = useState({
    control: '',
    id: '',
    nombre: '',
    direccion: '',
    barrio: '',
    ciudad: '',
    tel: '',
    pago: '',
    correo: '',
  });

  useEffect(() => {
    // Obtener los clientes desde Supabase
    const fetchClientes = async () => {
      try {
        const { data, error } = await supabase.from('clientes').select('*');
        if (error) throw error;
        setClientes(data);
      } catch (error) {
        console.error('Error al obtener los clientes', error);
      }
    };

    fetchClientes();
  }, []);

  const handleAdd = async () => {
    try {
      const { data, error } = await supabase.from('clientes').insert([nuevoCliente]);
      if (error) throw error;
      setNuevoCliente({
        control: '',
        id: '',
        nombre: '',
        direccion: '',
        barrio: '',
        ciudad: '',
        tel: '',
        pago: '',
        correo: '',
      });
      setClientes([...clientes, ...data]);
      alert('Cliente agregado');
    } catch (error) {
      console.error('Error al agregar cliente', error);
    }
  };

  const handleEdit = async (id) => {
    // Lógica para editar el cliente (similar a agregar)
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('clientes').delete().eq('id', id);
      if (error) throw error;
      setClientes(clientes.filter((cliente) => cliente.id !== id));
      alert('Cliente eliminado');
    } catch (error) {
      console.error('Error al eliminar cliente', error);
    }
  };

  return (
    <div className="clientes-container">
      <div className="clientes-controls">
        <button onClick={handleAdd}>Agregar</button>
        
        {/* Inputs para agregar cliente */}
        <input
          type="text"
          placeholder="Control"
          value={nuevoCliente.control}
          onChange={(e) => setNuevoCliente({ ...nuevoCliente, control: e.target.value })}
        />
        
      </div>
      <table className="clientes-table">
        <thead>
          <tr>
            <th>Control</th>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Barrio</th>
            <th>Ciudad</th>
            <th>Teléfono</th>
            <th>Pago</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.control}</td>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.barrio}</td>
              <td>{cliente.ciudad}</td>
              <td>{cliente.tel}</td>
              <td>{cliente.pago}</td>
              <td>{cliente.correo}</td>
              <td>
                <button onClick={() => handleEdit(cliente.id)}>Editar</button>
                <button onClick={() => handleDelete(cliente.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Clientes;
