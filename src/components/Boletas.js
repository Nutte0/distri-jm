import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import '../styles/Boletas.css';

const Boletas = () => {
  const [boletas, setBoletas] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [cantidadBoletas, setCantidadBoletas] = useState(0);
  const [empleadoId, setEmpleadoId] = useState('');
  const [selectedBoletaId, setSelectedBoletaId] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [asignarFormVisible, setAsignarFormVisible] = useState(false);

  useEffect(() => {
    const fetchBoletas = async () => {
      const { data, error } = await supabase.from('boletas').select('*');
      if (error) console.error('Error al obtener las boletas:', error);
      else setBoletas(data);
    };

    const fetchEmpleados = async () => {
      const { data, error } = await supabase.from('empleados').select('id_empleado, nombre'); 
      if (error) console.error('Error al obtener los empleados:', error);
      else setEmpleados(data);
    };

    fetchBoletas();
    fetchEmpleados();
  }, []);

  const handleCantidadBoletasChange = (e) => {
    setCantidadBoletas(e.target.value);
  };

  const handleGenerateBoletas = async () => {
    const generateRandomNumber = () => String(Math.floor(1000 + Math.random() * 9000));

    const generateRandomBoleta = () => ({
      boleta_id: `0${Math.floor(Math.random() * 1000)}`,
      sorteo_1: generateRandomNumber(),
      sorteo_2: generateRandomNumber(),
      sorteo_3: generateRandomNumber(),
      sorteo_4: generateRandomNumber(),
      sorteo_5: generateRandomNumber(),
      sorteo_6: generateRandomNumber(),
      estado: 'disponible'
    });

    const nuevasBoletas = Array.from({ length: cantidadBoletas }, generateRandomBoleta);

    try {
      const { error } = await supabase.from('boletas').insert(nuevasBoletas);
      if (error) throw error;
      alert('Boletas generadas correctamente');
      setBoletas((prev) => [...prev, ...nuevasBoletas]);
    } catch (error) {
      console.error('Error al generar las boletas:', error);
    }
  };

  const handleAsignarBoleta = async () => {
    try {
      // Actualizar el estado de la boleta en Supabase
      const { error: boletaError } = await supabase
        .from('boletas')
        .update({ estado: 'asignada' })
        .eq('boleta_id', selectedBoletaId); // Usar selectedBoletaId
      if (boletaError) throw boletaError;

      // Insertar la relación en la tabla intermedia
      const { error: relError } = await supabase
        .from('empleado_boleta')
        .insert({ empleado_id: empleadoId, boleta_id: selectedBoletaId });
      if (relError) throw relError;

      // Actualizar la lista local de boletas para reflejar la asignación
      setBoletas((prev) =>
        prev.map((boleta) =>
          boleta.boleta_id === selectedBoletaId ? { ...boleta, estado: 'asignada' } : boleta
        )
      );

      // Cerrar el formulario de asignación
      setAsignarFormVisible(false);
      setEmpleadoId(''); // Limpiar el empleado seleccionado
      setSelectedBoletaId(null); // Limpiar la boleta seleccionada

    } catch (error) {
      console.error('Error al asignar boleta', error);
    }
  };

  return (
    <div className="boletas-container">
      <div className="boletas-controls">
        <button onClick={() => setFormVisible(true)}>Generar Boletas</button>
        {formVisible && (
          <div className="boleta-form">
            <input
              type="number"
              placeholder="Cantidad de Boletas"
              value={cantidadBoletas}
              onChange={handleCantidadBoletasChange}
            />
            <button onClick={handleGenerateBoletas}>Generar</button>
            <button onClick={() => setFormVisible(false)}>Cancelar</button>
          </div>
        )}
      </div>

      <table className="boletas-table">
        <thead>
          <tr>
            <th>ID Boleta</th>
            <th>Sorteo 1</th>
            <th>Sorteo 2</th>
            <th>Sorteo 3</th>
            <th>Sorteo 4</th>
            <th>Sorteo 5</th>
            <th>Sorteo 6</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {boletas.map((boleta) => (
            <tr key={boleta.id}>
              <td>{boleta.boleta_id}</td>
              <td>{boleta.sorteo_1}</td>
              <td>{boleta.sorteo_2}</td>
              <td>{boleta.sorteo_3}</td>
              <td>{boleta.sorteo_4}</td>
              <td>{boleta.sorteo_5}</td>
              <td>{boleta.sorteo_6}</td>
              <td>{boleta.estado}</td>
              <td>
                {boleta.estado === 'disponible' && (
                  <button onClick={() => { 
                    setSelectedBoletaId(boleta.boleta_id); // Guardar el ID de la boleta seleccionada
                    setAsignarFormVisible(true); 
                  }}>
                    Asignar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

//Espacio para ver los empleados y asignar una boleta
      {asignarFormVisible && (
        <div className="asignar-form">
          <h3>Asignar Boleta</h3>
          <label>Empleado</label>
          <select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)}>
            <option value="">Selecciona un empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado.id_empleado} value={empleado.id_empleado}>{empleado.nombre}</option>
            ))}
          </select>
          <button onClick={handleAsignarBoleta}>Asignar Boleta</button>
          <button onClick={() => setAsignarFormVisible(false)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default Boletas;
