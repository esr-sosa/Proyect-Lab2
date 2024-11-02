const express = require('express');
const path = require('path');

const app = express();

// Solo una vez para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const indexRouter = require('./routes/index');
const agendaRouter = require('./routes/agenda');
const pacienteRouter = require('./routes/paciente');
const medicosRouter = require('./routes/medicos');

app.use('/', indexRouter);
app.use('/agenda', agendaRouter);
app.use('/paciente', pacienteRouter);
app.use('/medicos', medicosRouter);
app.use((req, res, next) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

module.exports = app;
