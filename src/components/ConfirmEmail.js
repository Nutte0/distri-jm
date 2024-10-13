import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const ConfirmEmail = () => {
  const location = useLocation(); // Para obtener los parámetros de la URL
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      const query = new URLSearchParams(location.search); // Obtener los parámetros de la URL
      const token = query.get('token'); // Obtener el token del enlace

      if (token) {
        const { error } = await supabase.auth.verifyEmail(token); // Verificar el correo con Supabase
        
        if (error) {
          console.error('Error verifying email:', error.message);
        } else {
          alert('Correo confirmado exitosamente. Ahora puedes iniciar sesión.');
          navigate('/login'); // Redirigir al login después de la confirmación
        }
      }
    };

    confirmEmail();
  }, [location, navigate]);

  return <div>Confirmando correo...</div>; // Mostrar un mensaje mientras se procesa
};

export default ConfirmEmail;
