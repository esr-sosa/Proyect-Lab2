const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../config/db');
const { error } = require('jquery');
const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las fotos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Renombramos el archivo con la fecha actual y su extensión
  }
});

const upload = multer({ storage });

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

  db.query(`
    SELECT 'personal' AS userType, dniEmpleado AS id, nombreEmpleado AS nombre, apellidoEmpleado AS apellido, mail, password FROM personal WHERE mail = ?
    UNION ALL
    SELECT 'paciente' AS userType, dni AS id, nombre, apellido, mail, password FROM paciente WHERE mail = ?
    UNION ALL
    SELECT 'medicos' AS userType, cuit AS id, nombre, apellido, mail, password FROM medicos WHERE mail = ?`,
    [username, username, username], (err, results) => {
      if (err) {
        console.error('Error en la consulta SQL:', err); // Imprime el error en la consola
        return res.render('index', { title: 'Login', error: 'Error en la base de datos: ' + err.message });
      }

      if (results.length === 0) {
        return res.render('index', { title: 'Login', error: 'Usuario no encontrado' });
      }

      const user = results[0];

      // Verifica la contraseña según el tipo de usuario
      if (user.userType === 'personal') {
        if (password === user.password) {
          req.session.user = user; 
          return res.redirect('/inicio');
        }
      } else if (user.userType === 'paciente') {
        if (password === user.password) {
          req.session.user = user; 
          return res.redirect('/inicio');
        }
      } else if (user.userType === 'medicos') {
        if (password === user.password) {
          req.session.user = user; 
          return res.redirect('/inicio');
        }
      }

      res.render('index', { title: 'Login', error: 'Contraseña incorrecta' });
    });
});














// Ruta para la página de registro
router.get('/register', (req, res) => {
  res.render('register', { title: 'Registrar', error: null });
});


router.post('/register', upload.single('fotoDni'), (req, res) => {
  const { dni, name, lastname, obraSocial, phone, username, password } = req.body;
  const fotoDniPath = req.file ? req.file.path : null; 

  if (!fotoDniPath) {
    return res.render('register', { title: 'Registrar', error: 'Error al cargar la foto del DNI' });
  }

  // Verificamos si ya existe un paciente con el mismo DNI
  db.query('SELECT * FROM paciente WHERE dni = ?', [dni], (err, results) => {
    if (err) {
      console.error('Error al verificar el paciente:', err.message);
      return res.render('register', { title: 'Registrar', error: 'Error al verificar el paciente' });
    }

    if (results.length > 0) {
      return res.render('register', { title: 'Registrar', error: 'El paciente ya existe' });
    }

    // Insertamos el nuevo paciente en la base de datos
    db.query(
      'INSERT INTO paciente (dni, nombre, apellido, obraSocial, telefono, mail, password, fotoDni, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [dni, name, lastname, obraSocial, phone, username, password, fotoDniPath, 1], // Guardamos el path de la foto del DNI
      (err) => {
        if (err) {
          console.error('Error al registrar el paciente:', err.message);
          return res.render('register', { title: 'Registrar', error: 'Error al registrar el paciente' });
        }
        res.redirect('/login'); // Redirigimos al usuario al login después del registro
      }
    );
  });
});






// Ruta para mostrar la lista de usuarios
router.get('/usuarios', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login'); // Redirige al login si no hay sesión
  }

  db.query('SELECT * FROM personal', (err, results) => {
    if (err) {
      return res.status(500).send('Error al obtener los usuarios');
    }
    res.render('usuarios', { title: 'Lista de Usuarios', usuarios: results, user: req.session.user }); // Pasa el usuario
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
    res.render('editarUsuario', { title: 'Editar Usuario', usuario: results[0], user: req.session.user }); // Pasa el usuario
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

// Ruta para la página de inicio
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
