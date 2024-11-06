const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('medicos', { 
    title: 'Gestión de Profesionales',
    user: req.session.user 
  });
});

module.exports = router;