// Librería para cifrar y comparar contraseñas
const bcrypt = require('bcryptjs');

// "Base de datos" en memoria: arreglo de objetos { usuario, contrasena }
// Nota: se pierde al reiniciar el servidor.
const usuarios = [];

/**
 * REGISTRO
 * Recibe usuario y contraseña, y guarda el usuario con la contraseña cifrada.
 */
const registro = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    // 1. Validar que lleguen ambos datos
    if (!usuario || !contrasena) {
      return res.status(400).json({
        mensaje: 'Debe enviar usuario y contraseña'
      });
    }

    // 2. Verificar que el usuario no exista previamente
    const existe = usuarios.find((u) => u.usuario === usuario);
    if (existe) {
      return res.status(409).json({
        mensaje: 'El usuario ya se encuentra registrado'
      });
    }

    // 3. Cifrar la contraseña (10 = número de rondas de cifrado)
    const contrasenaCifrada = await bcrypt.hash(contrasena, 10);

    // 4. Guardar el usuario
    usuarios.push({ usuario, contrasena: contrasenaCifrada });

    // 5. Responder con éxito (201 = recurso creado)
    return res.status(201).json({
      mensaje: 'Usuario registrado correctamente'
    });
  } catch (error) {
    // Cualquier fallo inesperado devuelve error 500
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

/**
 * LOGIN
 * Recibe usuario y contraseña, y verifica si son correctos.
 */
const login = async (req, res) => {
  try {
    const { usuario, contrasena } = req.body;

    // 1. Validar que lleguen ambos datos
    if (!usuario || !contrasena) {
      return res.status(400).json({
        mensaje: 'Debe enviar usuario y contraseña'
      });
    }

    // 2. Buscar el usuario en el arreglo
    const usuarioEncontrado = usuarios.find((u) => u.usuario === usuario);

    // 3. Si no existe, la autenticación falla
    if (!usuarioEncontrado) {
      return res.status(401).json({
        mensaje: 'Error en la autenticación'
      });
    }

    // 4. Comparar la contraseña recibida con la cifrada almacenada
    const coincide = await bcrypt.compare(
      contrasena,
      usuarioEncontrado.contrasena
    );

    // 5. Si la contraseña no coincide, la autenticación falla
    if (!coincide) {
      return res.status(401).json({
        mensaje: 'Error en la autenticación'
      });
    }

    // 6. Credenciales correctas
    return res.status(200).json({
      mensaje: 'Autenticación satisfactoria'
    });
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
};

// Exportamos las funciones para usarlas en las rutas
module.exports = { registro, login };
