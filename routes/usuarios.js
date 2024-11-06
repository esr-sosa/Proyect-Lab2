const express = require('express');
const router = express.Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/profile')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

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
      p.tipo as tipo_perfil,
      per.foto_perfil,
      per.nombre,
      per.apellido
    FROM user u
    JOIN perfil p ON u.idperfil = p.perfilid
    LEFT JOIN persona per ON per.userid = u.userid
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

router.post('/editar/:id', upload.single('foto_perfil'), async (req, res) => {
  try {
    const { username, password, tipo } = req.body;
    const foto_perfil = req.file ? req.file.filename : null;
    
    // Si hay una nueva foto, actualizarla
    if (foto_perfil) {
      await db.promise().query(
        'UPDATE persona SET foto_perfil = ? WHERE userid = ?',
        [foto_perfil, req.params.id]
      );
    }
    
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
        ? [username, password, perfil[0].perfilid, req.params.id]
        : [username, perfil[0].perfilid, req.params.id];
        
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
  } catch (error) {
    console.error(error);
    res.render('editarUsuario', { 
      error: 'Error al actualizar el usuario',
      usuario: req.body
    });
  }
});

module.exports = router; 