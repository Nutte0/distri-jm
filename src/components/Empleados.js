import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import '../styles/Empleados.css';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [boletasDisponibles, setBoletasDisponibles] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [boletaId, setBoletaId] = useState('');
  const [empleadoId, setEmpleadoId] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [nuevoCliente, setNuevoCliente] = useState('');

  useEffect(() => {
    fetchEmpleados();
    fetchBoletasDisponibles();
    fetchClientes();
  }, []);

  // Función para obtener empleados con las boletas asignadas
  const fetchEmpleados = async () => {
    try {
      const { data, error } = await supabase
        .from('empleados')
        .select(`
          id, nombre, direccion, telefono, barrio, ciudad, correo,
          empleado_boleta (boleta_id)
        `); 

      if (error) throw error;

      // Mapear los empleados con sus respectivas boletas asignadas
      const empleadosMap = data.map((empleado) => ({
        ...empleado,
        boletas: empleado.empleado_boleta ? empleado.empleado_boleta.map((boleta) => boleta.boleta_id) : []
      }));

      setEmpleados(empleadosMap);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    }
  };

  // Función para obtener boletas disponibles
  const fetchBoletasDisponibles = async () => {
    try {
      const { data, error } = await supabase
        .from('boletas')
        .select('*')
        .eq('estado', 'disponible');
      if (error) throw error;
      setBoletasDisponibles(data);
    } catch (error) {
      console.error('Error al obtener boletas disponibles:', error);
    }
  };

  // Función para obtener clientes
  const fetchClientes = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nombre');
      if (error) throw error;
      setClientes(data);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  // Función para crear un nuevo cliente
  const handleCrearCliente = async () => {
    if (nuevoCliente.trim() === '') {
      console.error('El nombre del cliente no puede estar vacío');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('clientes')
        .insert({ nombre: nuevoCliente });
      if (error) throw error;
      setClienteId(data[0].id); // Seleccionar automáticamente el cliente creado
      fetchClientes(); // Actualizar la lista de clientes
    } catch (error) {
      console.error('Error al crear cliente:', error);
    }
  };

  // Función para asignar una boleta a un empleado y un cliente
  const handleAsignarBoleta = async () => {
    try {
      if (!empleadoId || !boletaId || !clienteId) {
        console.error('Empleado, boleta o cliente no seleccionados');
        return;
      }

      // Verificar si la boleta ya está asignada
      const { data: boletaData, error: boletaCheckError } = await supabase
        .from('boletas')
        .select('*')
        .eq('boleta_id', boletaId);
      if (boletaCheckError) throw boletaCheckError;
      if (boletaData.length === 0) {
        console.error('Boleta no encontrada');
        return;
      }

      // Asignar la boleta al empleado y cliente
      const { error: relError } = await supabase
        .from('empleado_boleta')
        .insert({ empleado_id: empleadoId, boleta_id: boletaId, cliente_id: clienteId });
      if (relError) throw relError;

      // Actualizar el estado de la boleta a 'vendida'
      const { error: boletaError } = await supabase
        .from('boletas')
        .update({ estado: 'vendida' })
        .eq('boleta_id', boletaId);
      if (boletaError) throw boletaError;

      // Actualizar la lista de empleados y boletas disponibles
      fetchEmpleados();
      fetchBoletasDisponibles();
    } catch (error) {
      console.error('Error al asignar boleta:', error);
    }
  };

  return (
    <div className="empleados-container">
      <h2>Empleados</h2>

      <table className="empleados-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Barrio</th>
            <th>Ciudad</th>
            <th>Correo</th>
            <th>Boletas Asignadas</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => (
            <tr key={empleado.id}>
              <td>{empleado.nombre}</td>
              <td>{empleado.direccion}</td>
              <td>{empleado.telefono}</td>
              <td>{empleado.barrio}</td>
              <td>{empleado.ciudad}</td>
              <td>{empleado.correo}</td>
              <td>
                {empleado.boletas.length > 0 ? (
                  <ul>
                    {empleado.boletas.map((boleta_id) => (
                      <li key={boleta_id}>
                        <strong>ID Boleta:</strong> {boleta_id}
                      </li>
                    ))}
                  </ul>
                ) : (
                  'Sin boletas asignadas'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Asignar Boleta</h3>
      <div className="asignar-boleta-form">
        <select
          value={empleadoId}
          onChange={(e) => setEmpleadoId(e.target.value)}
        >
          <option value="">Seleccionar Empleado</option>
          {empleados.map((empleado) => (
            <option key={empleado.id} value={empleado.id}>
              {empleado.nombre}
            </option>
          ))}
        </select>

        <select
          value={boletaId}
          onChange={(e) => setBoletaId(e.target.value)}
        >
          <option value="">Seleccionar Boleta</option>
          {boletasDisponibles.map((boleta) => (
            <option key={boleta.id} value={boleta.boleta_id}>
              {boleta.boleta_id}
            </option>
          ))}
        </select>

        <select
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="">Seleccionar Cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nombre}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={nuevoCliente}
          onChange={(e) => setNuevoCliente(e.target.value)}
          placeholder="Agregar nuevo cliente"
        />
        <button onClick={handleCrearCliente}>Crear Cliente</button>

        <button onClick={handleAsignarBoleta}>Asignar Boleta</button>
      </div>
    </div>
  );
};

export default Empleados;
