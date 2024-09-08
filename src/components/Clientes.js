import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; 
import '../styles/Clientes.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [formVisible, setFormVisible] = useState(false); // Estado para mostrar/ocultar formulario
  const [editMode, setEditMode] = useState(false); // Estado para saber si estamos en modo edición
  const [clienteEditado, setClienteEditado] = useState(null); // Estado para el cliente a editar
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNuevoCliente((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAdd = async () => {
    if (!editMode) {
      try {
        const { data, error } = await supabase.from('clientes').insert([nuevoCliente]);
        if (error) throw error;


        if (data && Array.isArray(data)) {
          setClientes((prev) => [...prev, ...data]); // Actualizar el estado de clientes
        }

        resetForm();
        alert('Cliente agregado');
      } catch (error) {
        console.error('Error al agregar cliente', error);
      }
    } else {
      try {
        const { error } = await supabase
          .from('clientes')
          .update(nuevoCliente)
          .eq('id', clienteEditado.id);

        if (error) throw error;

        // Actualiza la lista de clientes
        setClientes((prev) =>
          prev.map(cliente => cliente.id === clienteEditado.id ? nuevoCliente : cliente)
        );
        
        resetForm();
        alert('Cliente actualizado');
      } catch (error) {
        console.error('Error al actualizar cliente', error);
      }
    }
  };

  const handleEdit = (cliente) => {
    setEditMode(true);
    setFormVisible(true);
    setClienteEditado(cliente);
    setNuevoCliente(cliente);
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase.from('clientes').delete().eq('id', id);
      if (error) throw error;
      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
      alert('Cliente eliminado');
    } catch (error) {
      console.error('Error al eliminar cliente', error);
    }
  };

  const resetForm = () => {
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
    setFormVisible(false);
    setEditMode(false);
    setClienteEditado(null);
  };

  return (
    
    <div className="clientes-container">
      <div className="clientes-controls">
      <button onClick={() => { setFormVisible(true); setEditMode(false); }}>Agregar Cliente</button>
        {formVisible && (
          
          <div className="cliente-form">
            <input
              type="text"
              id="control"
              placeholder="Control"
              value={nuevoCliente.control}
              onChange={handleInputChange}
            />
            <input
              type="text"
              id="id"
              placeholder="ID"
              value={nuevoCliente.id}
              onChange={handleInputChange}
            />
            <input
              type="text"
              id="nombre"
              placeholder="Nombre"
              value={nuevoCliente.nombre}
              onChange={handleInputChange}
            />
            <input
              type="text"
              id="direccion"
              placeholder="Dirección"
              value={nuevoCliente.direccion}
              onChange={handleInputChange}
            />
            <input
              type="text"
              id="barrio"
              placeholder="Barrio"
              value={nuevoCliente.barrio}
              onChange={handleInputChange}
            />
            <input
              type="text"
              id="ciudad"
              placeholder="Ciudad"
              value={nuevoCliente.ciudad}
              onChange={handleInputChange}
            />
            <input
              type="text"
              id="tel"
              placeholder="Teléfono"
              value={nuevoCliente.tel}
              onChange={handleInputChange}
            />
            <input
              type="text"
              id="pago"
              placeholder="Pago"
              value={nuevoCliente.pago}
              onChange={handleInputChange}
            />
            <input
              type="email"
              id="correo"
              placeholder="Correo"
              value={nuevoCliente.correo}
              onChange={handleInputChange}
            />

            <input
              type="numeric"
              id="id_vendedor"
              placeholder="vendedor"
              value={nuevoCliente.id_vendedor}
              onChange={handleInputChange}
            />

            <button onClick={handleAdd}>{editMode ? 'Actualizar' : 'Agregar'}</button>
            <button onClick={resetForm}>Cancelar</button>
          </div>
        )}
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
            <th>ID vendedor</th>
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
              <td>{cliente.id_vendedor}
              </td>
              <button onClick={() => handleEdit(cliente)}>Editar</button>
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
