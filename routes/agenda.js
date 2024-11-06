const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware para autenticar
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login'); // Redirige a login si no está autenticado
}

// Ruta GET para mostrar la vista del calendario
router.get('/', isAuthenticated, (req, res) => {
  res.render('agenda', { title: 'Agenda Médica' });
});

// Ruta POST para crear un nuevo turno
router.post('/agregar-turno', isAuthenticated, (req, res) => {
  const { fecha, hora, paciente_id } = req.body;
  
  db.query('INSERT INTO turnos (fecha, hora, paciente_id) VALUES (?, ?, ?)', 
  [fecha, hora, paciente_id], (err) => {
    if (err) {
      return res.status(500).send('Error al agregar el turno');
    }
    res.redirect('/agenda');
  });
});

// Ruta para cargar los turnos en el calendario
router.get('/cargar-turnos', isAuthenticated, (req, res) => {
  db.query('SELECT * FROM turnos', (err, results) => {
    if (err) {
      return res.status(500).send('Error al cargar los turnos');
    }
    res.json(results);
  });
});

module.exports = router;
