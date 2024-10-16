const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  res.render('agenda', { title: 'Agenda Médica' });
});

module.exports = router;
