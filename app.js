const express = require('express');
const path = require('path');
const session = require('express-session');
const indexRouter = require('./routes/index');
const agendaRouter = require('./routes/agenda');
const pacienteRouter = require('./routes/paciente');
const medicosRouter = require('./routes/medicos');
const usuariosRouter = require('./routes/usuarios');
const adminRouter = require('./routes/admin');
const secretariaRouter = require('./routes/secretaria');
const turnoRouter = require('./routes/turno');
const apiRoutes = require('./routes/apiRoutes');
const sucursalRoutes = require('./routes/sucursal');
const obraSocialRouter = require('./routes/obraSocial');
require('dotenv').config();

const moment = require('moment');
moment.locale('es');

const app = express();

// Configuración de sesión
app.use(session({
  secret: process.env.SESSION_SECRET,'contraseña'
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  },
  name: 'sessionId'
}));


// Middleware para hacer el usuario disponible en todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Solo una vez para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/inicio');
  } else {
    res.render('landing', { title: 'Bienvenido' });
  }
});

app.use('/', indexRouter);
app.use('/agenda', agendaRouter);
app.use('/paciente', pacienteRouter);
app.use('/pacientes', pacienteRouter);
app.use('/medicos', medicosRouter);
app.use('/usuarios', usuariosRouter);
app.use('/admin', adminRouter);
app.use('/secretaria', secretariaRouter);
app.use('/turno', turnoRouter);
app.use('/api', apiRoutes);
app.use('/sucursal', sucursalRoutes);
app.use('/obraSocial', obraSocialRouter);

// Configuración adicional para servir archivos estáticos
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Session:', req.session);
    console.log('Body:', req.body);
    next();
});

// Mover el middleware 404 aquí, después de todas las rutas
app.use((req, res, next) => {
    const err = new Error('Página no encontrada');
    err.status = 404;
    next(err);
});

// Manejador de errores
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', { 
        title: err.status === 404 ? 'Página no encontrada' : 'Error',
        message: err.status === 404 ? 'Lo sentimos, la página que buscas no existe.' : err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

app.locals.moment = moment;

module.exports = app;

