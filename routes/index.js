const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.use(session({
  secret: 'perrito',
  resave: false,
  saveUninitialized: true,
}));

router.get('/login', (req, res) => {
  res.render('index', { title: 'Login', error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
    if (err || results.length === 0) {
      return res.render('index', { title: 'Login', error: 'Usuario no encontrado' });
    }

    const user = results[0];

    if (password === user.password) {
      req.session.user = user;
      return res.redirect('/agenda');
    }

    res.render('index', { title: 'Login', error: 'Contraseña incorrecta' });
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/');
  });
});

router.get('/', (req, res) => {
  res.render('index', { title: 'Agenda Médica' });
});

module.exports = router;

