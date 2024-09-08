const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('./db'); // Asegúrate de importar el cliente de Supabase
require('dotenv').config(); // Asegúrate de cargar las variables de entorno

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Middleware para parsear JSON

// Registro de usuario
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password: hashedPassword }]);

    if (error) {
      throw error;
    }
    res.status(201).send('Usuario registrado');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al registrar usuario');
  }
});

// Login de usuario
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).send('Credenciales inválidas');
    }

    const user = data;

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).send('Credenciales inválidas');
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error al iniciar sesión');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
