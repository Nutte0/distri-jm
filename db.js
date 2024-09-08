const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Asegúrate de cargar las variables de entorno

// Obtén estos valores del archivo .env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
