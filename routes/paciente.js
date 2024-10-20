const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware para verificar autenticación
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login'); // Redirige a la página de login si no está autenticado
}

// Ruta para mostrar el formulario de agregar paciente
router.get('/', isAuthenticated, (req, res) => {
  res.render('paciente', { title: 'Agregar Paciente' });
});

// Ruta para mostrar la lista de pacientes
router.get('/pacientes', isAuthenticated, (req, res) => {
  db.query(`
    SELECT p.*, os.nombre AS obra_social_nombre
    FROM paciente p
    LEFT JOIN obra_social os ON p.obra_social_id = os.id
  `, (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).send('Error al obtener los pacientes: ' + err.message);
    }
    res.render('listarPacientes', { title: 'Lista de Pacientes', pacientes: results });
  });
});

// Ruta para editar paciente
router.get('/editar/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM paciente WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).render('404', { title: 'Paciente no encontrado' });
    }
    const paciente = results[0];
    db.query('SELECT * FROM obra_social', (err, obras_sociales) => {
      if (err) {
        return res.status(500).send('Error al obtener las obras sociales');
      }
      res.render('editarPaciente', { title: 'Editar Paciente', paciente, obras_sociales });
    });
  });
});

// Ruta POST para actualizar el paciente
router.post('/editar/:id', isAuthenticated, (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, dni, obra_social_id, datos_contacto } = req.body;

  db.query('UPDATE paciente SET nombre = ?, apellido = ?, dni = ?, obra_social_id = ?, datos_contacto = ? WHERE id = ?', 
  [nombre, apellido, dni, obra_social_id, datos_contacto, id], (err) => {
    if (err) {
      return res.status(500).send('Error al actualizar el paciente');
    }
    res.redirect('/pacientes'); // Redirige a la lista de pacientes después de actualizar
  });
});

module.exports = router;

