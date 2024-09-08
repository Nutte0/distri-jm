import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import '../styles/Empleados.css';

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: '',
    direccion: '',
    barrio: '',
    ciudad: '',
    telefono: '',
    correo: '',
    id_boletas_vendidas: [],
    id_boletas_asignadas: []
  });
  const [formVisible, setFormVisible] = useState(false);
  const [boletasDisponibles, setBoletasDisponibles] = useState([]);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState('');
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState('');

  useEffect(() => {
    // Obtener los empleados desde Supabase
    const fetchEmpleados = async () => {
      try {
        const { data, error } = await supabase.from('empleados').select('*');
        if (error) throw error;
        setEmpleados(data);
      } catch (error) {
        console.error('Error al obtener los empleados', error);
        setEmpleados([]);
      }
    };

    // Obtener boletas disponibles
    const fetchBoletas = async () => {
      try {
        const { data, error } = await supabase.from('boletas').select('*').eq('estado', 'disponible');
        if (error) throw error;
        setBoletasDisponibles(data);
      } catch (error) {
        console.error('Error al obtener las boletas disponibles', error);
        setBoletasDisponibles([]);
      }
    };

    fetchEmpleados();
    fetchBoletas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEmpleado = async () => {
    try {
      const { data, error } = await supabase.from('empleados').insert([nuevoEmpleado]);
      if (error) throw error;
      alert('Empleado agregado');
      setEmpleados((prev) => [
        ...prev,
        { ...nuevoEmpleado, id: data[0].id }
      ]);
      setNuevoEmpleado({
        nombre: '',
        direccion: '',
        barrio: '',
        ciudad: '',
        telefono: '',
        correo: '',
        id_boletas_vendidas: [],
        id_boletas_asignadas: []
      });
      setFormVisible(false);
    } catch (error) {
      console.error('Error al agregar empleado', error);
    }
  };

  const handleAsignarBoleta = async () => {
    if (!boletaSeleccionada || !empleadoSeleccionado) {
      alert('Selecciona una boleta y un empleado para asignar.');
      return;
    }

    try {
      // Actualizar el estado de la boleta en Supabase
      const { error } = await supabase
        .from('boletas')
        .update({ estado: 'asignada' })
        .eq('boleta_id', boletaSeleccionada);
      if (error) throw error;

      // Actualizar las boletas asignadas del empleado en Supabase
      const { error: empError } = await supabase
        .from('empleados')
        .update({ id_boletas_asignadas: supabase.raw('array_append(id_boletas_asignadas, ?)', [boletaSeleccionada]) })
        .eq('id', empleadoSeleccionado);
      if (empError) throw empError;

      // Actualizar las boletas y empleados en el estado
      setEmpleados((prev) =>
        prev.map((emp) =>
          emp.id === empleadoSeleccionado
            ? { ...emp, id_boletas_asignadas: [...emp.id_boletas_asignadas, boletaSeleccionada] }
            : emp
        )
      );
      setBoletasDisponibles((prev) =>
        prev.map((boleta) =>
          boleta.boleta_id === boletaSeleccionada ? { ...boleta, estado: 'asignada' } : boleta
        )
      );
      setBoletaSeleccionada('');
      setEmpleadoSeleccionado('');

      alert('Boleta asignada');
    } catch (error) {
      console.error('Error al asignar boleta', error);
    }
  };

  return (
    <div className="empleados-container">
      <div className="empleados-controls">
        <button onClick={() => setFormVisible(true)}>Agregar Empleado</button>

        {formVisible && (
          <div className="empleado-form">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={nuevoEmpleado.nombre}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="direccion"
              placeholder="Dirección"
              value={nuevoEmpleado.direccion}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="barrio"
              placeholder="Barrio"
              value={nuevoEmpleado.barrio}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="ciudad"
              placeholder="Ciudad"
              value={nuevoEmpleado.ciudad}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={nuevoEmpleado.telefono}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="correo"
              placeholder="Correo"
              value={nuevoEmpleado.correo}
              onChange={handleInputChange}
            />
            <button onClick={handleAddEmpleado}>Agregar</button>
            <button onClick={() => setFormVisible(false)}>Cancelar</button>
          </div>
        )}
      </div>

      <table className="empleados-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Barrio</th>
            <th>Ciudad</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Boletas Vendidas</th>
            <th>Boletas Asignadas</th>
            <th>Asignar Boleta</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map((empleado) => (
            <tr key={empleado.id}>
              <td>{empleado.id}</td>
              <td>{empleado.nombre}</td>
              <td>{empleado.direccion}</td>
              <td>{empleado.barrio}</td>
              <td>{empleado.ciudad}</td>
              <td>{empleado.telefono}</td>
              <td>{empleado.correo}</td>
              <td>{(empleado.id_boletas_vendidas || []).join(', ')}</td>
              <td>{(empleado.id_boletas_asignadas || []).join(', ')}</td>
              <td>
                <select
                  value={boletaSeleccionada}
                  onChange={(e) => setBoletaSeleccionada(e.target.value)}
                >
                  <option value="">Seleccionar Boleta</option>
                  {boletasDisponibles.map((boleta) => (
                    <option key={boleta.id} value={boleta.boleta_id}>
                      {boleta.boleta_id}
                    </option>
                  ))}
                </select>
                
                <select
                  value={empleadoSeleccionado}
                  onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
                >
                  <option value="">Seleccionar Empleado</option>
                  {empleados.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nombre}
                    </option>
                  ))}
                </select>
                <button onClick={handleAsignarBoleta}>Asignar Boleta</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Empleados;
