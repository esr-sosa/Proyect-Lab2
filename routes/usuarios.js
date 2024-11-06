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

// Listar usuarios
router.get('/', isAdmin, (req, res) => {
  db.query(`
    SELECT 
      u.userid,
      u.nombre_user,
      u.estado,
      per.nombre,
      per.apellido,
      p.tipo as tipo_perfil
    FROM user u
    JOIN perfil p ON u.idperfil = p.perfilid
    LEFT JOIN persona per ON per.userid = u.userid
    ORDER BY u.userid`,
    (err, usuarios) => {
      if (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).send('Error al obtener usuarios');
      }
      
      res.render('usuarios', { 
        title: 'Lista de Usuarios',
        user: req.session.user,
        usuarios: usuarios 
      });
    }
  );
});

// Editar usuario
router.get('/editar/:id', isAdmin, (req, res) => {
  const userId = req.params.id;
  db.query(`
    SELECT 
      u.*,
      p.tipo as tipo_perfil
    FROM user u
    JOIN perfil p ON u.idperfil = p.perfilid
    WHERE u.userid = ?
  `, [userId], (err, usuario) => {
    if (err || !usuario[0]) {
      return res.redirect('/usuarios');
    }
    res.render('editarUsuario', {
      title: 'Editar Usuario',
      user: req.session.user,
      usuario: usuario[0]
    });
  });
});

router.post('/editar/:id', isAdmin, (req, res) => {
  const userId = req.params.id;
  const { username, password, tipo } = req.body;
  
  // Primero obtener el perfilid basado en el tipo
  db.query('SELECT perfilid FROM perfil WHERE tipo = ?', [tipo], (err, perfil) => {
    if (err || !perfil[0]) {
      return res.render('editarUsuario', {
        error: 'Error al actualizar usuario',
        user: req.session.user,
        usuario: req.body
      });
    }

    // Construir la consulta SQL según si hay nueva contraseña o no
    const updateData = password 
      ? [username, password, perfil[0].perfilid, userId]
      : [username, perfil[0].perfilid, userId];
      
    const query = password
      ? 'UPDATE user SET nombre_user = ?, password = ?, idperfil = ? WHERE userid = ?'
      : 'UPDATE user SET nombre_user = ?, idperfil = ? WHERE userid = ?';

    db.query(query, updateData, (err) => {
      if (err) {
        return res.render('editarUsuario', {
          error: 'Error al actualizar usuario',
          user: req.session.user,
          usuario: req.body
        });
      }
      res.redirect('/usuarios');
    });
  });
});

module.exports = router; 