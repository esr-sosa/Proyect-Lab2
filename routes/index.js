// routes/index.js
const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de importar la conexión a la base de datos
const bcrypt = require('bcrypt');

// Middleware para manejar sesiones
const session = require('express-session');
router.use(session({
  secret: 'tu_secreto', // Cambia esto por un secreto fuerte
  resave: false,
  saveUninitialized: true,
}));

// Ruta para la página de login
router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Ruta para manejar el login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Busca el usuario en la base de datos
  db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).send('Error en la base de datos');
    }
    if (results.length === 0) {
      return res.status(401).send('Usuario no encontrado');
    }

    const user = results[0];

    // Compara la contraseña
    bcrypt.compare(password, user.password, (err, match) => {
      if (err) {
        return res.status(500).send('Error al comparar contraseñas');
      }
      if (match) {
        // Guarda el usuario en la sesión
        req.session.user = user;
        return res.redirect('/'); // Redirige al inicio
      } else {
        return res.status(401).send('Contraseña incorrecta');
      }
    });
  });
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/'); // Redirige al inicio
  });
});

// Ruta de inicio
router.get('/', (req, res) => {
  res.render('index', { title: 'Agenda Médica' });
});

module.exports = router;
