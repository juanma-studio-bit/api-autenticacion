// Importamos Express, el framework para crear el servidor web
const express = require('express');

// Importamos las rutas de autenticación
const authRoutes = require('./routes/auth.routes');

// Creamos la aplicación
const app = express();

// Middleware: permite que el servidor entienda cuerpos en formato JSON
app.use(express.json());

// Todas las rutas de autenticación quedan bajo el prefijo /api
app.use('/api', authRoutes);

// Ruta base para verificar que el servicio está activo
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de autenticación en funcionamiento' });
});

// Puerto en el que escuchará el servidor
const PORT = process.env.PORT || 3000;

// Iniciamos el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
