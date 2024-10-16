const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Configuración de Pug como motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const indexRouter = require('./routes/index');
const agendaRouter = require('./routes/agenda');
const pacienteRouter = require('./routes/paciente');

app.use('/', indexRouter);
app.use('/agenda', agendaRouter);
app.use('/paciente', pacienteRouter);

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

module.exports = app;
