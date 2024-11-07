const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configurar multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/dni')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
  res.render('paciente', { 
    title: 'Gestión de Pacientes',
    user: req.session.user 
  });
});

router.post('/agregar', upload.single('foto_dni'), async (req, res) => {
  const { nombre, apellido, dni, email, telefono, direccion, localidad } = req.body;
  const foto_dni = req.file ? req.file.filename : null;
  
  try {
    await db.promise().beginTransaction();

    // 1. Crear usuario con el DNI como contraseña
    const [userResult] = await db.promise().query(
      'INSERT INTO user (nombre_user, password, idperfil, estado, createdAt, updateAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [email, dni, 4, 1]
    );
    
    const userId = userResult.insertId;

    // 2. Insertar en la tabla persona
    const [personaResult] = await db.promise().query(
      'INSERT INTO persona (nombre, apellido, dni, mail, telefono, foto_dni, userid, direccion, localidad, createdAt, updateAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [nombre, apellido, dni, email, telefono, foto_dni, userId, direccion, localidad]
    );

    await db.promise().commit();
    
    res.render('paciente', {
      title: 'Agregar Paciente',
      user: req.session.user,
      success: `Paciente agregado exitosamente.\nCredenciales de acceso:\nUsuario: ${email}\nContraseña: ${dni}`,
      error: null
    });
  } catch (error) {
    await db.promise().rollback();
    console.error('Error al agregar paciente:', error);
    res.render('paciente', {
      title: 'Agregar Paciente',
      user: req.session.user,
      error: 'Error al agregar el paciente. Por favor, intente nuevamente.'
    });
  }
});

module.exports = router;
