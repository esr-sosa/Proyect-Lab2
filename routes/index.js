const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../config/db');

router.use(session({
  secret: 'perrito', 
  resave: false,
  saveUninitialized: true,
}));

// Ruta para la página de login
router.get('/login', (req, res) => {
  res.render('index', { title: 'Login', error: null });
});

// Ruta POST para el inicio de sesión
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.render('index', { title: 'Login', error: 'Error en la base de datos' });
    }

    if (results.length === 0) {
      return res.render('index', { title: 'Login', error: 'Usuario no encontrado' });
    }

    const user = results[0];

    if (password === user.password) {
      req.session.user = user; // Guarda al usuario en la sesión
      return res.redirect('/inicio'); // Redirige a la página de inicio
    }

    res.render('index', { title: 'Login', error: 'Contraseña incorrecta' });
  });
});

// Ruta para la página de registro
router.get('/register', (req, res) => {
  res.render('register', { title: 'Registrar', error: null });
});

// Ruta POST para registrar un nuevo usuario
router.post('/register', (req, res) => {
  const { username, password, tipo } = req.body;

  db.query('SELECT * FROM usuarios WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.render('register', { title: 'Registrar', error: 'Error al verificar el usuario' });
    }
    
    if (results.length > 0) {
      return res.render('register', { title: 'Registrar', error: 'El usuario ya existe' });
    }

    db.query('INSERT INTO usuarios (username, password, tipo) VALUES (?, ?, ?)', [username, password, tipo], (err) => {
      if (err) {
        return res.render('register', { title: 'Registrar', error: 'Error al registrar el usuario' });
      }
      res.redirect('/login'); // Redirige al login después del registro
    });
  });
});

// Ruta para mostrar la lista de usuarios
router.get('/usuarios', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirige al login si no hay sesión
  }

  db.query('SELECT * FROM usuarios', (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener los usuarios');
    }
    res.render('usuarios', { title: 'Lista de Usuarios', usuarios: results });
  });
});

// Ruta POST para eliminar un usuario
router.post('/usuarios/eliminar/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
    if (err) {
      return res.status(500).send('Error al eliminar el usuario');
    }
    res.redirect('/usuarios'); // Redirige a la lista de usuarios después de eliminar
  });
});

// Ruta GET para mostrar el formulario de edición
router.get('/usuarios/editar/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).render('404', { title: 'Usuario no encontrado' });
    }
    res.render('editarUsuario', { title: 'Editar Usuario', usuario: results[0] });
  });
});
// Ruta POST para actualizar el usuario
router.post('/usuarios/editar/:id', (req, res) => {
  const { id } = req.params;
  const { username, password, tipo } = req.body;

  db.query('UPDATE usuarios SET username = ?, password = ?, tipo = ? WHERE id = ?', [username, password, tipo, id], (err, result) => {
    if (err) {
      return res.status(500).send('Error al actualizar el usuario');
    }
    res.redirect('/usuarios'); // Redirige a la lista de usuarios después de actualizar
  });
});

// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error al cerrar sesión');
    }
    res.redirect('/'); // Redirige a la página de inicio
  });
});


router.get('/inicio', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirige al login si no hay sesión
  }
  res.render('inicio', { title: 'Inicio', user: req.session.user }); // Renderiza la vista de inicio
});


// Ruta para la página principal
router.get('/', (req, res) => {
  res.render('index', { title: 'Agenda Médica' });
});

module.exports = router;
