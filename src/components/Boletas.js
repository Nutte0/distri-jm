import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient'; 
import '../styles/Boletas.css';

const Boletas = ({ onBoletaSeleccionada }) => {
  const [boletas, setBoletas] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [cantidadBoletas, setCantidadBoletas] = useState(0);

  useEffect(() => {
    // Obtener las boletas desde Supabase
    const fetchBoletas = async () => {
      try {
        const { data, error } = await supabase.from('boletas').select('*');
        if (error) throw error;
        setBoletas(data);
      } catch (error) {
        console.error('Error al obtener las boletas', error);
      }
    };

    fetchBoletas();
  }, []);

  const handleCantidadBoletasChange = (e) => {
    setCantidadBoletas(e.target.value);
  };

  const handleGenerateBoletas = async () => {
    const generateRandomNumber = () => {
      return String(Math.floor(1000 + Math.random() * 9000));
    };

    const generateRandomBoleta = () => {
      return {
        boleta_id: `0${Math.floor(Math.random() * 1000)}`,
        sorteo_1: generateRandomNumber(),
        sorteo_2: generateRandomNumber(),
        sorteo_3: generateRandomNumber(),
        sorteo_4: generateRandomNumber(),
        sorteo_5: generateRandomNumber(),
        sorteo_6: generateRandomNumber(),
      };
    };

    const boletas = Array.from({ length: cantidadBoletas }, generateRandomBoleta);

    try {
      const { data, error } = await supabase.from('boletas').insert(boletas);
      if (error) throw error;
      alert('Boletas agregadas');
      setBoletas((prev) => [...prev, ...boletas]);  // Actualiza la lista de boletas en el estado
    } catch (error) {
      console.error('Error al agregar boletas', error);
    }
  };

  const handleAsignarBoleta = async (boletaId, empleadoId) => {
    try {
      // Actualizar el estado de la boleta en Supabase
      const { error } = await supabase
        .from('boletas')
        .update({ estado: 'asignada' })
        .eq('boleta_id', boletaId);
      if (error) throw error;

      // Actualizar las boletas asignadas del empleado en Supabase
      const { error: empError } = await supabase
        .from('empleados')
        .update({ id_boletas_asignadas: supabase.raw('array_append(id_boletas_asignadas, ?)', [boletaId]) })
        .eq('id', empleadoId);
      if (empError) throw empError;

      // Actualizar la lista local de boletas
      setBoletas((prev) =>
        prev.map((boleta) =>
          boleta.boleta_id === boletaId ? { ...boleta, estado: 'asignada' } : boleta
        )
      );

      // Informar sobre la boleta seleccionada
      if (onBoletaSeleccionada) {
        onBoletaSeleccionada(boletaId);
      }

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
            <button onClick={handleGenerateBoletas}>Generar Boletas</button>
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
              <td>{boleta.estado || 'disponible'}</td>
              <td>
                <button onClick={() => handleAsignarBoleta(boleta.boleta_id)}>Asignar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Boletas;
