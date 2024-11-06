// routes/index.js
const express = require('express');
const router = express.Router();
const mainController = require('../controllers/mainController');

// Ruta principal que renderiza index.pug
router.get('/', mainController.home);

module.exports = router;
