const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Middleware para verificar si es admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  res.redirect('/inicio');
}

// Ruta para mostrar el formulario de crear secretaria
router.get('/crear', isAdmin, (req, res) => {
  res.render('crearSecretaria', {
    title: 'Crear Secretaria',
    user: req.session.user,
    error: null,
    success: null
  });
});

// Ruta para procesar la creación de secretaria
router.post('/crear', isAdmin, async (req, res) => {
  const { 
    nombre, 
    apellido, 
    dni, 
    email,
    password,
    confirm_password, 
    telefono, 
    direccion, 
    localidad 
  } = req.body;
  
  try {
    // Validar que las contraseñas coincidan
    if (password !== confirm_password) {
      return res.render('crearSecretaria', {
        title: 'Crear Secretaria',
        user: req.session.user,
        error: 'Las contraseñas no coinciden'
      });
    }

    await db.promise().beginTransaction();

    // Validar que el DNI y email no existan
    const [existingUser] = await db.promise().query(
      'SELECT p.dni, u.nombre_user FROM persona p JOIN user u ON p.userid = u.userid WHERE p.dni = ? OR u.nombre_user = ?',
      [dni, email]
    );

    if (existingUser.length > 0) {
      return res.render('crearSecretaria', {
        title: 'Crear Secretaria',
        user: req.session.user,
        error: 'Ya existe un usuario con ese DNI o email'
      });
    }

    // Encriptar la contraseña ingresada
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario con la contraseña encriptada
    const [userResult] = await db.promise().query(
      'INSERT INTO user (nombre_user, password, idperfil, estado, createdAt, updateAt) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [email, hashedPassword, 3, 1]
    );
    
    const userId = userResult.insertId;

    // Crear persona
    await db.promise().query(
      'INSERT INTO persona (nombre, apellido, dni, mail, telefono, userid, direccion, localidad, createdAt, updateAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [nombre, apellido, dni, email, telefono, userId, direccion, localidad]
    );

    await db.promise().commit();
    
    res.render('crearSecretaria', {
      title: 'Crear Secretaria',
      user: req.session.user,
      success: `Secretaria creada exitosamente.\nCredenciales de acceso:\nUsuario: ${email}`,
      error: null
    });
  } catch (error) {
    await db.promise().rollback();
    console.error('Error al crear secretaria:', error);
    res.render('crearSecretaria', {
      title: 'Crear Secretaria',
      user: req.session.user,
      error: 'Error al crear la secretaria'
    });
  }
});

module.exports = router;
