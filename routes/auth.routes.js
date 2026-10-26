const express = require('express');
const { registro, login } = require('../controllers/auth.controller');

// Router de Express para agrupar las rutas de autenticación
const router = express.Router();

// POST /api/registro -> crea un nuevo usuario
router.post('/registro', registro);

// POST /api/login -> valida las credenciales de un usuario
router.post('/login', login);

module.exports = router;
