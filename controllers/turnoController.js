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
           //  if (![1, 2].includes(req.session.user.idperfil)) {
            //     return res.redirect('/');
            // }

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
            // Obtener datos necesarios para las vistas
            const [sucursales] = await db.promise().query(`
                SELECT sucursalid, nombre_sucrsal 
                FROM sucursal 
                WHERE estado = 1
            `);
            
            const [medicos] = await db.promise().query(`
                SELECT m.medicoid, p.nombre, p.apellido 
                FROM medicos m 
                JOIN persona p ON m.personaid = p.personaid 
                WHERE m.estado = 1
            `);
            
            const [especialidades] = await db.promise().query(`
                SELECT especialidadId, nombre_esp 
                FROM especialidad 
                WHERE estado = 1
            `);

            // Determinar qué vista mostrar según el perfil
            let viewName;
            if (req.session.user.isAdmin || req.session.user.tipo_perfil === 'secretaria') {
                viewName = 'turno/secretarioBuscarAgenda';
            } else {
                viewName = 'turno/pacienteBusAgenda';
            }

            // Renderizar vista con todos los datos necesarios
            return res.render(viewName, {
                title: 'Buscar Turnos',
                sucursales: sucursales,
                medicos: medicos,
                especialidades: especialidades,
                user: req.session.user
            });

        } catch (error) {
            console.error('Error en buscarAgenda:', error);
            res.status(500).send('Error al cargar la página de búsqueda');
        }
    },

    buscarTurnos: async (req, res) => {
        try {
            const { sucursal, especialidad, medico } = req.body;
            
            // Obtener información del médico y sus turnos disponibles
            const [infoMedico] = await db.promise().query(`
                SELECT 
                    p.nombre, 
                    p.apellido, 
                    e.nombre_esp, 
                    s.nombre_sucrsal,
                    a.agendaid
                FROM medicos m
                JOIN persona p ON m.personaid = p.personaid
                JOIN especialidad e ON m.especialidadId = e.especialidadId
                JOIN agenda a ON m.medicoid = a.medico_id
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                WHERE m.medicoid = ?
                LIMIT 1
            `, [medico]);

            // Obtener días disponibles
            const [diasDisponibles] = await db.promise().query(`
                SELECT DISTINCT 
                    DATE(c.fecha) as fecha
                FROM calendar c
                JOIN agenda a ON c.agendaid = a.agendaid
                WHERE a.medico_id = ?
                AND c.estado = 1
                AND c.fecha >= CURDATE()
                ORDER BY c.fecha
            `, [medico]);

            res.render('turno/calendario', {
                title: 'Seleccionar Fecha',
                fechasDisponibles: diasDisponibles,
                medico: infoMedico[0],
                sucursal,
                especialidad,
                medicoId: medico,
                user: req.session.user
            });

        } catch (error) {
            console.error('Error en buscarTurnos:', error);
            res.status(500).send('Error al buscar turnos disponibles');
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
            
            // Obtener información completa del turno
            const [turno] = await db.promise().query(`
                SELECT t.*, c.fechaturno, c.inicioturno,
                       p.nombre as paciente_nombre, p.apellido as paciente_apellido,
                       m.nombre as medico_nombre, m.apellido as medico_apellido,
                       s.nombre_sucrsal, s.direccion as sucursal_direccion,
                       esp.nombre_esp as especialidad
                FROM turno t
                JOIN calendar c ON t.calendar_id = c.calendarid
                JOIN agenda a ON c.agendaid = a.agendaid
                JOIN persona p ON t.persona_id = p.personaid
                JOIN medicos med ON a.medico_id = med.medicoid
                JOIN persona m ON med.personaid = m.personaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN especialidad esp ON med.especialidadid = esp.especialidadid
                WHERE t.turniid = ? AND t.estadoturno_id = 2
            `, [turnoId]);

            if (!turno.length) {
                return res.status(400).json({ error: 'Turno no encontrado o no puede ser confirmado' });
            }

            const [turnoExistente] = await db.promise().query(`
                SELECT estadoturno_id 
                FROM turno 
                WHERE turniid = ?
            `, [turnoId]);

            if (turnoExistente[0].estadoturno_id !== 2) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'El turno ya ha sido procesado o no está en estado pendiente' 
                });
            }

            // Actualizar el turno
            await db.promise().query(`
                UPDATE turno 
                SET estadoturno_id = 4,
                    fecha_confirmacion = NOW()
                WHERE turniid = ?
            `, [turnoId]);

            // Enviar email de confirmación
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: 'Confirmación de Turno Médico',
                html: `
                    <h2>Turno Confirmado</h2>
                    <p>Estimado/a ${turno[0].paciente_nombre} ${turno[0].paciente_apellido},</p>
                    <p>Su turno ha sido confirmado:</p>
                    <ul>
                        <li>Especialidad: ${turno[0].especialidad}</li>
                        <li>Médico: Dr/a. ${turno[0].medico_nombre} ${turno[0].medico_apellido}</li>
                        <li>Fecha: ${moment(turno[0].fechaturno).format('DD/MM/YYYY')}</li>
                        <li>Hora: ${moment(turno[0].inicioturno, 'HH:mm:ss').format('HH:mm')}</li>
                        <li>Lugar: ${turno[0].nombre_sucrsal}</li>
                        <li>Dirección: ${turno[0].sucursal_direccion}</li>
                    </ul>
                    <p>Por favor, llegue 10 minutos antes de su turno.</p>
                `
            };

            await transporter.sendMail(mailOptions);

            res.json({ 
                success: true, 
                message: 'Turno confirmado exitosamente',
                turno: turno[0]
            });

        } catch (error) {
            console.error('Error en confirmarTurnoSecretario:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Error al confirmar el turno' 
            });
        }
    },

    cancelarTurno: async (req, res) => {
        try {
            const turnoId = req.params.id;
            
            // Verificar el estado actual del turno
            const [turnoExistente] = await db.promise().query(`
                SELECT t.estadoturno_id, t.persona_id, t.calendar_id,
                       p.nombre as paciente_nombre,
                       p.apellido as paciente_apellido,
                       m.nombre as medico_nombre,
                       m.apellido as medico_apellido,
                       c.fechaturno, c.inicioturno,
                       s.nombre_sucrsal as sucursal_nombre,
                       s.direccion as sucursal_direccion
                FROM turno t
                JOIN persona p ON t.persona_id = p.personaid
                JOIN calendar c ON t.calendar_id = c.calendarid
                JOIN agenda a ON c.agendaid = a.agendaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN medicos med ON a.medico_id = med.medicoid
                JOIN persona m ON med.personaid = m.personaid
                WHERE t.turniid = ?
            `, [turnoId]);

            if (!turnoExistente.length) {
                return res.status(404).json({ 
                    success: false, 
                    error: 'Turno no encontrado' 
                });
            }

            // Verificar que el turno esté en estado válido para cancelar (2-Pendiente o 4-Confirmado)
            if (![2, 4].includes(turnoExistente[0].estadoturno_id)) {
                return res.status(400).json({ 
                    success: false, 
                    error: 'El turno no puede ser cancelado en su estado actual' 
                });
            }

            // Actualizar el estado del turno a cancelado (3)
            await db.promise().query(`
                UPDATE turno 
                SET estadoturno_id = 3
                WHERE turniid = ?
            `, [turnoId]);

            // Enviar email de cancelación
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: 'Turno Médico Cancelado',
                html: `
                    <h1>Turno Cancelado</h1>
                    <p>El turno ha sido cancelado:</p>
                    <ul>
                        <li>Paciente: ${turnoExistente[0].paciente_nombre} ${turnoExistente[0].paciente_apellido}</li>
                        <li>Fecha: ${moment(turnoExistente[0].fechaturno).format('DD/MM/YYYY')}</li>
                        <li>Hora: ${moment(turnoExistente[0].inicioturno, 'HH:mm:ss').format('HH:mm')}</li>
                        <li>Médico: ${turnoExistente[0].medico_nombre} ${turnoExistente[0].medico_apellido}</li>
                        <li>Sucursal: ${turnoExistente[0].sucursal_nombre}</li>
                        <li>Dirección: ${turnoExistente[0].sucursal_direccion}</li>
                    </ul>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (emailError) {
                console.error('Error al enviar email:', emailError);
            }

            res.json({ 
                success: true, 
                message: 'Turno cancelado exitosamente' 
            });

        } catch (error) {
            console.error('Error al cancelar el turno:', error);
            res.status(500).json({ 
                success: false, 
                error: 'Error al cancelar el turno' 
            });
        }
    },

    mostrarFormularioBusqueda: async (req, res) => {
        try {
            const [sucursales] = await db.promise().query(`
                SELECT sucursalid, nombre_sucrsal 
                FROM sucursal 
                WHERE estado = 1
            `);
            
            res.render('turno/buscarTurnos', {
                title: 'Buscar Turnos',
                sucursales,
                user: req.session.user
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error al cargar el formulario de búsqueda');
        }
    },

    procesarBusquedaTurno: async (req, res) => {
        try {
            const { sucursal, especialidad, medico } = req.body;
            
            // Obtener información del médico
            const [infoMedico] = await db.promise().query(`
                SELECT p.nombre, p.apellido, e.nombre_esp, s.nombre_sucrsal
                FROM medicos m
                JOIN persona p ON m.personaid = p.personaid
                JOIN especialidad e ON m.especialidadId = e.especialidadId
                JOIN agenda a ON m.medicoid = a.medico_id
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                WHERE m.medicoid = ?
                LIMIT 1
            `, [medico]);

            // Obtener turnos disponibles
            const [turnosDisponibles] = await db.promise().query(`
                SELECT c.calendarid, c.fechaturno, c.inicioturno, c.finalturno,
                       a.nombreagenda, s.nombre_sucrsal,
                       p.nombre as medico_nombre, p.apellido as medico_apellido,
                       e.nombre_esp as especialidad
                FROM calendar c
                JOIN agenda a ON c.agendaid = a.agendaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN medicos m ON a.medico_id = m.medicoid
                JOIN persona p ON m.personaid = p.personaid
                JOIN especialidad e ON m.especialidadId = e.especialidadId
                WHERE m.medicoid = ?
                AND c.estado = 1
                AND c.fechaturno >= CURDATE()
                ORDER BY c.fechaturno, c.inicioturno
            `, [medico]);

            // Agrupar turnos por fecha
            const turnosAgrupados = turnosDisponibles.reduce((acc, turno) => {
                const fecha = moment(turno.fechaturno).format('YYYY-MM-DD');
                if (!acc[fecha]) {
                    acc[fecha] = [];
                }
                acc[fecha].push(turno);
                return acc;
            }, {});

            res.render('turno/resultadosBusqueda', {
                title: 'Turnos Disponibles',
                turnosAgrupados,
                medico: infoMedico[0],
                user: req.session.user
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error al procesar la búsqueda');
        }
    }
};

module.exports = turnoController; 