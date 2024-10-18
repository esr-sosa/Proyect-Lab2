const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../config/db');

// Configuración de la sesión
router.use(session({
  secret: 'perrito', // Cambia esto a un valor más seguro en producción
  resave: false,
  saveUninitialized: true,
}));

// Ruta para mostrar el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('index', { title: 'Login', error: null });
});

// Ruta para manejar el inicio de sesión
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Consultar usuario en la base de datos
  db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
    if (err || results.length === 0) {
      return res.render('index', { title: 'Login', error: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Comparación simple de contraseñas
    if (password === user.password) {
      req.session.user = user; // Guardar usuario en la sesión
      return res.redirect('/agenda'); // Redirigir a la agenda después de iniciar sesión
    }

    res.render('index', { title: 'Login', error: 'Contraseña incorrecta' });
  });
});

// Ruta para mostrar el formulario de registro
router.get('/register', (req, res) => {
  res.render('register', { title: 'Registrar', error: null });
});

// Ruta para manejar el registro de nuevos usuarios
router.post('/register', (req, res) => {
  const { username, password, tipo } = req.body;

  // Verificar si el usuario ya existe
  db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.render('register', { title: 'Registrar', error: 'Error al verificar el usuario' });
    }
    if (results.length > 0) {
      return res.render('register', { title: 'Registrar', error: 'El usuario ya existe' });
    }

    // Insertar el nuevo usuario en la base de datos
    db.query('INSERT INTO usuarios (username, password, tipo) VALUES (?, ?, ?)', [username, password, tipo], (err) => {
      if (err) {
        return res.render('register', { title: 'Registrar', error: 'Error al registrar el usuario' });
      }
      res.redirect('/login'); // Redirigir a la página de inicio de sesión después del registro
    });
  });
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/'); // Redirigir a la página principal después de cerrar sesión
  });
});

// Ruta para la página principal
router.get('/', (req, res) => {
  res.render('index', { title: 'Agenda Médica' });
});

module.exports = router;
