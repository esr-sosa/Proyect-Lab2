const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('paciente', { 
    title: 'Gestión de Pacientes',
    user: req.session.user 
  });
});

module.exports = router;
