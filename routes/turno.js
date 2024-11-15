const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
const auth = require('../middleware/auth');

// Middleware de logging
router.use((req, res, next) => {
    console.log('Ruta turno:', req.path);
    console.log('Usuario:', req.session?.user);
    next();
});

// Rutas de búsqueda
router.get('/buscarAgenda', auth.isLoggedIn, auth.checkRole([1, 2, 3]), turnoController.buscarAgenda);
router.post('/procesarBusquedaTurno', auth.isLoggedIn, auth.checkRole([1, 2, 3,]), turnoController.procesarBusquedaTurno);
router.post('/buscarTurnos', auth.isLoggedIn, auth.checkRole([3]), turnoController.buscarTurnos);
router.post('/reservar-paciente', auth.isLoggedIn, auth.checkRole([3]), turnoController.reservarTurnoPaciente);
router.post('/confirmar-secretaria', auth.isLoggedIn, auth.checkRole([3]), turnoController.confirmarTurnoSecretaria);
router.post('/cancelar/:turnoId', auth.isLoggedIn, auth.checkRole([3]), turnoController.cancelarTurno);
router.get('/secretario', auth.isLoggedIn, auth.checkRole([3]), turnoController.secretarioTurnos);
router.get('/ver/:turnoId', auth.isLoggedIn, auth.checkRole([1,2,3]), turnoController.verTurno);
router.post('/reservar', turnoController.reservarTurno);
router.get('/turno/comprobante/:id', turnoController.generarComprobantePDF);
router.get('/comprobante/:id', turnoController.generarComprobantePDF);
router.get('/paciente', turnoController.buscarAgendaPaciente);
router.post('/buscarTurnosPaciente', turnoController.buscarTurnosPaciente);

module.exports = router; 
