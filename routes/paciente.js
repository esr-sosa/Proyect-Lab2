const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('paciente', { title: 'Gestión de Pacientes' });
});

module.exports = router;
