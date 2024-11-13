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
router.post('/procesarBusquedaTurno', auth.isLoggedIn, auth.checkRole([1, 2, 3]), turnoController.procesarBusquedaTurno);
router.post('/buscarTurnos', auth.isLoggedIn, auth.checkRole([1, 2, 3]), turnoController.buscarTurnos);

module.exports = router; 
