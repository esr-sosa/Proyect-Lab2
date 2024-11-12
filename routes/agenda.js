const express = require('express');
const router = express.Router();
const db = require('../config/db');
const agendaController = require('../controllers/agendaController');

// Middleware para autenticar
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
}

// Rutas de agenda
router.get('/', isAuthenticated, (req, res) => {
  res.render('agenda', { 
    title: 'Agenda Médica',
    user: req.session.user 
  });
});

// Nueva ruta para listar agenda
router.get('/listar', isAuthenticated, agendaController.listarAgenda);

// Nueva ruta para crear agenda
router.post('/crear', isAuthenticated, agendaController.insertarAgenda);

module.exports = router;