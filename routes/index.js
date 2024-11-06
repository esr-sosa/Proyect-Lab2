const express = require('express');
const session = require('express-session');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');


// Configuración de multer para almacenar las fotos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/dni')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// Ruta para la página de login
router.get('/login', (req, res) => {
  res.render('index', { title: 'Login', error: null });
});

// Ruta POST para el inicio de sesión
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  db.query(`
    SELECT 
      u.userid,
      u.nombre_user,
      u.estado,
      p.perfilid,
      p.tipo as tipo_perfil,
      p.permisos,
      per.nombre,
      per.apellido,
      per.personaid
    FROM user u
    JOIN perfil p ON u.idperfil = p.perfilid
    LEFT JOIN persona per ON per.userid = u.userid
    WHERE u.nombre_user = ? AND u.password = ? AND u.estado = 1`,
    [username, password],
    (err, results) => {
      if (err) {
        console.error('Error en login:', err);
        return res.render('index', { 
          title: 'Login', 
          error: 'Error en la base de datos' 
        });
      }

      if (results.length === 0) {
        return res.render('index', { 
          title: 'Login', 
          error: 'Usuario o contraseña incorrectos' 
        });
      }

      const user = results[0];
      req.session.user = {
        id: user.userid,
        nombre: user.nombre,
        apellido: user.apellido,
        username: user.nombre_user,
        tipo_perfil: user.tipo_perfil,
        isAdmin: user.tipo_perfil === 'admin',
        isMedico: user.tipo_perfil === 'medico',
        isSecretaria: user.tipo_perfil === 'secretaria',
        isPaciente: user.tipo_perfil === 'paciente'
      };
      
      res.redirect('/inicio');
    }
  );
});

// Ruta para la página de registro
router.get('/register', (req, res) => {
  res.render('register', { title: 'Registrar', error: null });
});

router.post('/register', upload.single('foto_dni'), async (req, res) => {
  const { 
    dni, 
    name: nombre, 
    lastname: apellido, 
    phone: telefono, 
    username: mail, 
    password,
    direccion,
    localidad 
  } = req.body;
  
  const foto_dni = req.file ? `/uploads/dni/${req.file.filename}` : null;

  try {
    // Verificación de usuario existente
    const [existingUser] = await db.promise().query(
      'SELECT * FROM persona WHERE dni = ? OR mail = ?',
      [dni, mail]
    );

    if (existingUser.length > 0) {
      return res.render('register', { 
        title: 'Registro de Paciente', 
        error: 'Ya existe un paciente con ese DNI o email' 
      });
    }

    await db.promise().beginTransaction();

    // Primero creamos el usuario
    const [userResult] = await db.promise().query(
      'INSERT INTO user (nombre_user, password, estado, idperfil) VALUES (?, ?, ?, ?)',
      [mail, password, 1, 4]
    );

    const userid = userResult.insertId;

    // Luego creamos la persona
    await db.promise().query(
      'INSERT INTO persona (userid, dni, nombre, apellido, telefono, mail, direccion, localidad, foto_dni) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userid, dni, nombre, apellido, telefono, mail, direccion, localidad, foto_dni]
    );

    await db.promise().commit();
    res.redirect('/login');
  } catch (error) {
    await db.promise().rollback();
    console.error('Error en el registro:', error);
    
    res.render('register', { 
      title: 'Registro de Paciente', 
      error: 'Error al registrar el paciente. Por favor, intente nuevamente.' 
    });
  }
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
    return res.redirect('/login');
  }
  res.render('inicio', { title: 'Inicio', user: req.session.user });
});

// Ruta para la página principal
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Agenda Médica',
    user: req.session.user 
  });
});

module.exports = router;