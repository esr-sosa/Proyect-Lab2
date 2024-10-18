const express = require('express');
const session = require('express-session'); // Asegúrate de importar express-session
const router = express.Router();
const db = require('../config/db');

// Configuración de sesiones
router.use(session({
  secret: 'perrito', // Cambia esto por un secreto seguro en producción
  resave: false,
  saveUninitialized: true,
}));

// Ruta para mostrar el formulario de login
router.get('/login', (req, res) => {
  res.render('index', { title: 'Login', error: null });
});

// Ruta para procesar el formulario de login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Consulta a la base de datos
  db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
    if (err || results.length === 0) {
      return res.render('index', { title: 'Login', error: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Verificar la contraseña
    if (password === user.password) {
      req.session.user = user; // Almacenar información del usuario en la sesión
      return res.redirect('/agenda');
    }

    res.render('index', { title: 'Login', error: 'Contraseña incorrecta' });
  });
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/');
  });
});

// Ruta para mostrar la página de inicio
router.get('/', (req, res) => {
  res.render('index', { title: 'Agenda Médica' });
});

module.exports = router;
