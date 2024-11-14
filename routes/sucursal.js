const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');
const auth = require('../middleware/auth');

router.get('/', auth.isLoggedIn, auth.checkRole([1]), sucursalController.listarSucursales);
router.get('/nuevo', auth.isLoggedIn, auth.checkRole([1]), sucursalController.verFormulario);
router.get('/editar/:id', auth.isLoggedIn, auth.checkRole([1]), sucursalController.verFormulario);
router.post('/guardar', auth.isLoggedIn, auth.checkRole([1]), sucursalController.guardarSucursal);
router.post('/guardar/:id', auth.isLoggedIn, auth.checkRole([1]), sucursalController.guardarSucursal);
router.delete('/eliminar/:id', auth.isLoggedIn, auth.checkRole([1]), sucursalController.eliminarSucursal);

module.exports = router; 