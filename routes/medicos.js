const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware para verificar si es admin
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  res.redirect('/inicio');
}

router.get('/', isAdmin, async (req, res) => {
  try {
    const [especialidades] = await db.promise().query(
      'SELECT especialidadId, nombre_esp FROM especialidad WHERE estado = 1'
    );
    
    res.render('medicos', { 
      title: 'Gestión de Profesionales',
      user: req.session.user,
      especialidades: especialidades,
      error: null
    });
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    res.status(500).send('Error al obtener especialidades');
  }
});

router.post('/agregar', isAdmin, async (req, res) => {
  const { nombre, apellido, dni, especialidad, matricula, email, telefono } = req.body;
  
  try {
    // Validar que el DNI y email no existan
    const [existingUser] = await db.promise().query(
      'SELECT p.dni, u.nombre_user FROM persona p JOIN user u ON p.userid = u.userid WHERE p.dni = ? OR u.nombre_user = ?',
      [dni, email]
    );

    if (existingUser.length > 0) {
      const [especialidades] = await db.promise().query(
        'SELECT especialidadId, nombre_esp FROM especialidad WHERE estado = 1'
      );
      
      return res.render('medicos', {
        title: 'Gestión de Profesionales',
        user: req.session.user,
        especialidades: especialidades,
        error: 'Ya existe un usuario con ese DNI o email'
      });
    }

    await db.promise().beginTransaction();

    // 1. Crear el usuario con el DNI como contraseña
    const [userResult] = await db.promise().query(
      'INSERT INTO user (nombre_user, password, idperfil, estado) VALUES (?, ?, ?, 1)',
      [email, dni, 2, 1] // Agregamos estado = 1 para activo
    );
    
    const userId = userResult.insertId;

    // 2. Ahora insertar en la tabla persona con el userid
    const [personaResult] = await db.promise().query(
      'INSERT INTO persona (nombre, apellido, dni, mail, telefono, userid) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellido, dni, email, telefono, userId]
    );
    
    const personaId = personaResult.insertId;
    
    // 3. Insertar en la tabla medicos
    const [medicoResult] = await db.promise().query(
      'INSERT INTO medicos (personaid, especialidadId, estado) VALUES (?, ?, 1)',
      [personaId, especialidad]
    );
    
    const medicoId = medicoResult.insertId;
    
    // 4. Insertar en la tabla medico_esp
    await db.promise().query(
      'INSERT INTO medico_esp (matricula, medicoid, especialidadid) VALUES (?, ?, ?)',
      [matricula, medicoId, especialidad]
    );
    
    await db.promise().commit();
    
    const [especialidades] = await db.promise().query(
      'SELECT especialidadId, nombre_esp FROM especialidad WHERE estado = 1'
    );
    
    res.render('medicos', {
      title: 'Gestión de Profesionales',
      user: req.session.user,
      especialidades: especialidades,
      success: `Profesional agregado exitosamente.\nCredenciales de acceso:\nUsuario: ${email}\nContraseña: ${dni}`,
      error: null
    });
  } catch (error) {
    await db.promise().rollback();
    console.error('Error al agregar médico:', error);
    
    const [especialidades] = await db.promise().query(
      'SELECT especialidadId, nombre_esp FROM especialidad WHERE estado = 1'
    );
    
    res.render('medicos', {
      title: 'Gestión de Profesionales',
      user: req.session.user,
      especialidades: especialidades,
      error: 'Error al agregar el médico. Por favor, intente nuevamente.'
    });
  }
});

module.exports = router;