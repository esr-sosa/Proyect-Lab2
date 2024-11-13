const db = require('../config/db');
const moment = require('moment');
const nodemailer = require('nodemailer');

const transporter = require("../config/mailer").transporter;

const turnoController = {
    turnosDisponibles: async (req, res) => {
        try {
            if (![1, 3].includes(req.session.user.idperfil)) {
                return res.redirect('/');
            }

            const [turnos] = await db.promise().query(`
                SELECT t.*, e.tipo as estado_tipo,
                       c.fechaturno, c.inicioturno, c.finalturno,
                       a.nombreagenda, m.medicoid,
                       p.nombre as medico_nombre, p.apellido as medico_apellido,
                       s.nombre_sucrsal as sucursal_nombre
                FROM turno t
                JOIN estado e ON t.estadoturno_id = e.estadoid
                JOIN calendar c ON t.calendar_id = c.calendarid
                JOIN agenda a ON c.agendaid = a.agendaid
                JOIN medicos m ON a.medico_id = m.medicoid
                JOIN persona p ON m.personaid = p.personaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                WHERE t.calendar_id = ? AND t.estadoturno_id = 1
            `, [req.params.idCalendario]);

            res.render('turno/turnosDisponibles', {
                turnos,
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener turnos disponibles');
        }
    },

    verTurno: async (req, res) => {
        try {
            const turnoId = req.query.id;
            const [turno] = await db.promise().query(`
                SELECT t.*, e.tipo as estado_tipo,
                       c.fechaturno, c.inicioturno,
                       a.nombreagenda,
                       s.nombre_sucrsal as sucursal_nombre, s.direccion as sucursal_direccion,
                       m.medicoid,
                       p.nombre as medico_nombre, p.apellido as medico_apellido,
                       pac.nombre as paciente_nombre, pac.apellido as paciente_apellido
                FROM turno t
                JOIN estado e ON t.estadoturno_id = e.estadoid
                JOIN calendar c ON t.calendar_id = c.calendarid
                JOIN agenda a ON c.agendaid = a.agendaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN medicos m ON a.medico_id = m.medicoid
                JOIN persona p ON m.personaid = p.personaid
                LEFT JOIN persona pac ON t.persona_id = pac.personaid
                WHERE t.turniid = ?
            `, [turnoId]);

            if (!turno.length) {
                return res.status(404).send('Turno no encontrado');
            }

            // Obtener lista de pacientes para el select si es secretario
            let pacientes = [];
            if (req.session.user.idperfil !== 3) {
                [pacientes] = await db.promise().query(`
                    SELECT personaid as id, nombre, apellido 
                    FROM persona 
                    WHERE userid IN (SELECT userid FROM user WHERE idperfil = 3)
                `);
            }

            const viewName = req.session.user.idperfil === 3 ? 
                'turno/pacienteConfirmarTurno' : 
                'turno/secretarioConfirmarTurno';

            res.render(viewName, {
                title: 'Ver Turno',
                turno: turno[0],
                user: req.session.user,
                pacientes: pacientes,
                clinica: {
                    nombre: turno[0].sucursal_nombre,
                    direccion: turno[0].sucursal_direccion
                },
                calendario: {
                    fecha: turno[0].fechaturno
                },
                persona: req.session.user,
                moment: require('moment')
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar el turno');
        }
    },

    secretarioTurnos: async (req, res) => {
        try {
            if (![1, 2].includes(req.session.user.idperfil)) {
                return res.redirect('/');
            }

            const [turnos] = await db.promise().query(`
                SELECT t.*, e.tipo as estado_tipo,
                       c.fechaturno, c.inicioturno,
                       a.nombreagenda,
                       s.nombre_sucrsal as sucursal_nombre,
                       m.medicoid,
                       p.nombre as medico_nombre, p.apellido as medico_apellido,
                       pac.nombre as persona_nombre, pac.apellido as persona_apellido,
                       pac.personaid as PersonaId
                FROM turno t
                JOIN estado e ON t.estadoturno_id = e.estadoid
                JOIN calendar c ON t.calendar_id = c.calendarid
                JOIN agenda a ON c.agendaid = a.agendaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN medicos m ON a.medico_id = m.medicoid
                JOIN persona p ON m.personaid = p.personaid
                LEFT JOIN persona pac ON t.persona_id = pac.personaid
                WHERE t.estadoturno_id IN (2, 4)
                ORDER BY c.fechaturno DESC, c.inicioturno ASC
            `);

            res.render('turno/turnosSecretario', {
                title: 'Gestión de Turnos',
                user: req.session.user,
                turnos: turnos
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar los turnos');
        }
    },

    reservarTurno: async (req, res) => {
        try {
            const { turnoId, personaId } = req.query;
            
            // Verificar si el turno existe y está disponible
            const [turnoExistente] = await db.promise().query(`
                SELECT * FROM turno WHERE turniid = ? AND estadoturno_id = 1
            `, [turnoId]);

            if (!turnoExistente.length) {
                return res.status(400).send('El turno no está disponible');
            }

            // Actualizar el turno
            await db.promise().query(`
                UPDATE turno 
                SET persona_id = ?,
                    estadoturno_id = 2
                WHERE turniid = ?
            `, [personaId, turnoId]);

            res.redirect('/turno/misTurnos');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al reservar el turno');
        }
    },

    buscarAgenda: async (req, res) => {
        try {
            console.log('Usuario:', req.session.user);
            
            if (![1, 2, 3].includes(req.session.user.idperfil)) {
                console.log('Perfil no autorizado');
                return res.redirect('/');
            }

            const [[sucursalCount], [medicoCount], [especialidadCount]] = await Promise.all([
                db.promise().query('SELECT COUNT(*) as count FROM sucursal WHERE estado = 1'),
                db.promise().query('SELECT COUNT(*) as count FROM medicos WHERE estado = 1'),
                db.promise().query('SELECT COUNT(*) as count FROM especialidad WHERE estado = 1')
            ]);

            if (!sucursalCount.count || !medicoCount.count || !especialidadCount.count) {
                console.log('Faltan datos básicos en las tablas');
                return res.render('error', {
                    message: 'No hay datos suficientes para buscar turnos',
                    error: { status: 400, stack: 'Contacte al administrador' }
                });
            }

            const [sucursales, medicos, especialidades] = await Promise.all([
                db.promise().query('SELECT sucursalid, nombre_sucrsal as nombre FROM sucursal WHERE estado = 1'),
                db.promise().query(`
                    SELECT m.medicoid, p.nombre, p.apellido, e.nombre_esp as especialidad 
                    FROM medicos m 
                    JOIN persona p ON m.personaid = p.personaid
                    JOIN especialidad e ON m.especialidadid = e.especialidadid
                    WHERE m.estado = 1
                `),
                db.promise().query('SELECT * FROM especialidad WHERE estado = 1')
            ]);

            const viewName = req.session.user.idperfil === 3 ? 
                'turno/pacienteBusAgenda' : 
                'turno/secretarioBuscarAgenda';

            console.log('Datos recuperados:', {
                sucursales: sucursales[0].length,
                medicos: medicos[0].length,
                especialidades: especialidades[0].length
            });

            res.render(viewName, {
                title: 'Buscar Turnos',
                user: req.session.user,
                sucursales: sucursales[0],
                medicos: medicos[0],
                especialidades: especialidades[0],
                moment: require('moment')
            });

        } catch (error) {
            console.error('Error completo:', error);
            res.status(500).render('error', {
                message: 'Error al cargar búsqueda de turnos',
                error: { status: 500, stack: error.stack }
            });
        }
    },

    buscarTurnos: async (req, res) => {
        try {
            const { radioBtn, sucursal, medico, especialidad } = req.body;
            const today = moment().format('YYYY-MM-DD');
            let query = '';
            let params = [];

            const baseQuery = `
                SELECT t.*, e.tipo as estado_tipo,
                       c.fechaturno, c.inicioturno,
                       a.nombreagenda,
                       s.nombre_sucrsal as sucursal_nombre,
                       m.medicoid,
                       p.nombre as medico_nombre, p.apellido as medico_apellido,
                       esp.nombre_esp as especialidad
                FROM turno t
                JOIN estado e ON t.estadoturno_id = e.estadoid
                JOIN calendar c ON t.calendar_id = c.calendarid
                JOIN agenda a ON c.agendaid = a.agendaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN medicos m ON a.medico_id = m.medicoid
                JOIN persona p ON m.personaid = p.personaid
                JOIN especialidad esp ON m.especialidadId = esp.especialidadId
                WHERE t.estadoturno_id = 1 
                AND c.fechaturno >= ?`;

            params.push(today);

            switch(radioBtn) {
                case 'sucursal':
                    query = baseQuery + ' AND s.sucursalid = ?';
                    params.push(sucursal);
                    break;
                case 'medico':
                    query = baseQuery + ' AND m.medicoid = ?';
                    params.push(medico);
                    break;
                case 'especialidad':
                    query = baseQuery + ' AND esp.especialidadId = ?';
                    params.push(especialidad);
                    break;
                default:
                    query = baseQuery;
            }

            // Obtener datos para los selectores
            const [turnos] = await db.promise().query(query, params);
            const [sucursales] = await db.promise().query('SELECT sucursalid, nombre_sucrsal FROM sucursal WHERE estado = 1');
            const [medicos] = await db.promise().query(`
                SELECT m.medicoid, p.nombre, p.apellido, e.nombre_esp as especialidad 
                FROM medicos m 
                JOIN persona p ON m.personaid = p.personaid 
                JOIN especialidad e ON m.especialidadId = e.especialidadId 
                WHERE m.estado = 1`);
            const [especialidades] = await db.promise().query('SELECT especialidadId, nombre_esp FROM especialidad WHERE estado = 1');

            const viewName = req.session.user.idperfil === 3 ? 
                'turno/pacienteBuscarTurnos' : 
                'turno/secretarioBuscarTurnos';

            res.render(viewName, {
                turnos,
                sucursales,
                medicos,
                especialidades,
                user: req.session.user,
                selectedRadio: radioBtn,
                selectedSucursal: sucursal,
                selectedMedico: medico,
                selectedEspecialidad: especialidad
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error al buscar turnos');
        }
    },

    misTurnos: async (req, res) => {
        try {
            if (req.session.user.idperfil !== 3) {
                return res.redirect('/');
            }

            const [turnos] = await db.promise().query(`
                SELECT t.*, e.tipo as estado_tipo,
                       c.fechaturno, c.inicioturno,
                       a.nombreagenda,
                       s.nombre_sucrsal as sucursal_nombre,
                       m.medicoid, p.nombre as medico_nombre, p.apellido as medico_apellido,
                       esp.descripcion as especialidad
                FROM turno t
                JOIN estado e ON t.estadoturno_id = e.estadoid
                JOIN calendar c ON t.calendar_id = c.calendarid
                JOIN agenda a ON c.agendaid = a.agendaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN medicos m ON a.medico_id = m.medicoid
                JOIN persona p ON m.personaid = p.personaid
                JOIN especialidad esp ON m.especialidadid = esp.especialidadid
                WHERE t.persona_id = ? 
                AND t.estadoturno_id IN (2,3,4,5)
                ORDER BY c.fechaturno DESC
            `, [req.session.user.personaid]);

            res.render('turno/misTurnos', {
                title: 'Mis Turnos',
                turnos,
                user: req.session.user
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener mis turnos');
        }
    },

    confirmarTurno: async (req, res) => {
        try {
            const [turno] = await db.promise().query(`
                SELECT t.*, e.tipo as estado_tipo,
                       c.fechaturno, c.inicioturno,
                       a.nombreagenda,
                       s.nombre_sucrsal as sucursal_nombre, s.direccion as sucursal_direccion,
                       m.medicoid, p.nombre as medico_nombre, p.apellido as medico_apellido,
                       esp.descripcion as especialidad
                FROM turno t
                JOIN estado e ON t.estadoturno_id = e.estadoid
                JOIN calendar c ON t.calendar_id = c.calendarid
                JOIN agenda a ON c.agendaid = a.agendaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN medicos m ON a.medico_id = m.medicoid
                JOIN persona p ON m.personaid = p.personaid
                JOIN especialidad esp ON m.especialidadid = esp.especialidadid
                WHERE t.turniid = ?
            `, [req.params.idTurno]);

            if (!turno.length) {
                return res.status(404).send('Turno no encontrado');
            }

            const viewName = req.session.user.idperfil === 3 ? 
                'turno/pacienteConfirmarTurno' : 
                'turno/secretarioConfirmarTurno';

            res.render(viewName, {
                title: 'Confirmar Turno',
                turno: turno[0],
                user: req.session.user
            });

        } catch (error) {
            console.error(error);
            res.status(500).send('Error al confirmar el turno');
        }
    },

    confirmarTurnoSecretario: async (req, res) => {
        try {
            const turnoId = req.params.id;
            
            // Primero verificar si el turno existe y su estado actual
            const [turnoExistente] = await db.promise().query(`
                SELECT * FROM turno WHERE turniid = ? AND estadoturno_id = 2
            `, [turnoId]);

            if (!turnoExistente.length) {
                return res.status(400).json({ error: 'Turno no encontrado o no puede ser confirmado' });
            }

            // Actualizar el turno
            await db.promise().query(`
                UPDATE turno 
                SET estadoturno_id = 4,
                    fecha_confirmacion = NOW()
                WHERE turniid = ?
            `, [turnoId]);

            // Enviar respuesta exitosa
            res.status(200).json({ success: true, message: 'Turno confirmado exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al confirmar el turno' });
        }
    },

    cancelarTurno: async (req, res) => {
        try {
            const turnoId = req.params.id;
            
            // Actualizar el estado del turno a cancelado (estado 3)
            await db.promise().query(`
                UPDATE turno 
                SET estadoturno_id = 3
                WHERE turniid = ?
            `, [turnoId]);

            res.status(200).json({ success: true, message: 'Turno cancelado exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al cancelar el turno' });
        }
    }
};

module.exports = turnoController; 