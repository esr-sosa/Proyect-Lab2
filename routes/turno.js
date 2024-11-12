const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
const auth = require('../middleware/auth');

// Rutas unificadas para gestión de turnos
router.use((req, res, next) => {
    console.log('Ruta turno:', req.path);
    console.log('Usuario:', req.session?.user);
    next();
});

router.get('/secretario', auth.isLoggedIn, auth.checkRole([1]), turnoController.secretarioTurnos);
router.get('/buscarAgenda', auth.isLoggedIn, auth.checkRole([1, 2, 3]), turnoController.buscarAgenda);
router.post('/buscarTurno', auth.isLoggedIn, auth.checkRole([1, 2, 3]), turnoController.buscarTurnos);
router.get('/ver', auth.isLoggedIn, turnoController.verTurno);
router.get('/reservar', auth.isLoggedIn, turnoController.reservarTurno);
router.get('/misTurnos', auth.isLoggedIn, turnoController.misTurnos);
router.post('/confirmar/:id', auth.isLoggedIn, turnoController.confirmarTurnoSecretario);
router.get('/disponibles/:idCalendario', auth.isLoggedIn, turnoController.turnosDisponibles);

module.exports = router; 