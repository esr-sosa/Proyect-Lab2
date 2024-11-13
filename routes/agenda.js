const express = require('express');
const router = express.Router();
const db = require('../config/db');
const agendaController = require('../controllers/agendaController');
const calendarioController = require('../controllers/calendarioController');

// Middleware para autenticar
function isAuthenticated(req, res, next) {
  // if (req.session.user) {
  //   return next();
  // }
  // res.redirect('/login');
  return next();
}

// Rutas de agenda
router.get('/', isAuthenticated, agendaController.listarAgenda);
router.get('/gestion', isAuthenticated, agendaController.listarAgenda);
router.get('/crear', isAuthenticated, agendaController.crearAgenda);
router.post('/crear', isAuthenticated, agendaController.insertarAgenda);
router.get('/horarios/:id', isAuthenticated, agendaController.gestionHorarios);
router.post('/horarios/crear', isAuthenticated, calendarioController.crearHorarios);
router.get('/obtenerHorarios/:agendaId', calendarioController.obtenerHorarios);
router.post('/cambiarEstado', isAuthenticated, agendaController.cambiarEstadoAgenda);

module.exports = router;