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
            const { turnoId } = req.params;
            
            // Consulta ajustada a la estructura real de la BD
            const [turno] = await db.promise().query(`
                SELECT 
                    t.*,
                    e.tipo as estado_tipo,
                    c.fechaturno,
                    c.inicioturno,
                    a.nombreagenda,
                    s.nombre_sucrsal as sucursal_nombre,
                    s.direccion as sucursal_direccion,
                    p_pac.nombre as paciente_nombre,
                    p_pac.apellido as paciente_apellido,
                    p_pac.mail as paciente_email,
                    p_med.nombre as medico_nombre,
                    p_med.apellido as medico_apellido,
                    esp.nombre_esp as especialidad
                FROM turno t
                JOIN estado e ON t.estadoturno_id = e.estadoid
                JOIN calendar c ON t.calendar_id = c.calendarid
                JOIN agenda a ON c.agendaid = a.agendaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN persona p_pac ON t.persona_id = p_pac.personaid
                JOIN medicos m ON a.medico_id = m.medicoid
                JOIN persona p_med ON m.personaid = p_med.personaid
                JOIN especialidad esp ON m.especialidadId = esp.especialidadId
                WHERE t.turniid = ?
            `, [turnoId]);

            if (!turno.length) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Turno no encontrado' 
                });
            }

            console.log('Datos del turno encontrado:', turno[0]); // Para debug

            res.render('turno/secretarioConfirmarTurno', {
                title: 'Ver Turno',
                turno: turno[0],
                user: req.session.user,
                moment: require('moment') // Aseguramos que moment esté disponible
            });

        } catch (error) {
            console.error('Error detallado:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al ver el turno',
                error: error.message 
            });
        }
    },

    secretarioTurnos: async (req, res) => {
        try {
            // Primero hagamos un console.log para ver qué turnos hay
            const [checkTurnos] = await db.promise().query('SELECT * FROM turno');
            console.log('Todos los turnos:', checkTurnos);

            const [turnos] = await db.promise().query(`
                SELECT 
                    t.turniid,
                    t.persona_id,
                    t.calendar_id,
                    t.estadoturno_id,
                    e.tipo as estado_tipo,
                    c.fechaturno,
                    c.inicioturno,
                    a.nombreagenda,
                    s.nombre_sucrsal as sucursal_nombre,
                    p.nombre as persona_nombre,
                    p.apellido as persona_apellido,
                    med.nombre as medico_nombre,
                    med.apellido as medico_apellido
                FROM turno t
                INNER JOIN estado e ON t.estadoturno_id = e.estadoid
                INNER JOIN calendar c ON t.calendar_id = c.calendarid
                INNER JOIN agenda a ON c.agendaid = a.agendaid
                INNER JOIN sucursal s ON a.sucursal_id = s.sucursalid
                INNER JOIN persona p ON t.persona_id = p.personaid
                INNER JOIN medicos m ON a.medico_id = m.medicoid
                INNER JOIN persona med ON m.personaid = med.personaid
                WHERE t.estadoturno_id IN (2,4)
                ORDER BY c.fechaturno ASC, c.inicioturno ASC
            `);

            console.log('Turnos filtrados:', turnos);

            res.render('turno/turnosSecretario', {
                title: 'Gestión de Turnos',
                user: req.session.user,
                turnos: turnos,
                moment: require('moment')
            });

        } catch (error) {
            console.error('Error completo:', error);
            res.status(500).send('Error al cargar los turnos');
        }
    },

    reservarTurno: async (req, res) => {
        try {
            console.log('Datos recibidos:', req.body);
            const { calendarId, personaId } = req.body;

            // Verificar si el turno ya está reservado
            const [turnoExistente] = await db.promise().query(`
                SELECT * FROM turno WHERE calendar_id = ?
            `, [calendarId]);

            if (turnoExistente.length > 0) {
                return res.json({
                    success: false,
                    message: 'El turno ya no está disponible'
                });
            }

            // Obtener la fecha y hora del calendar
            const [calendarInfo] = await db.promise().query(`
                SELECT fechaturno, inicioturno 
                FROM calendar 
                WHERE calendarid = ?
            `, [calendarId]);

            if (!calendarInfo.length) {
                return res.json({
                    success: false,
                    message: 'Calendario no encontrado'
                });
            }

            // Crear el turno con estado 4 (confirmado) y fecha_confirmacion
            const [result] = await db.promise().query(`
                INSERT INTO turno (
                    calendar_id, 
                    persona_id, 
                    estadoturno_id, 
                    fecha,
                    hora,
                    observaciones,
                    fecha_confirmacion
                )
                VALUES (?, ?, 4, ?, ?, ?, NOW())
            `, [
                calendarId, 
                personaId, 
                calendarInfo[0].fechaturno,
                calendarInfo[0].inicioturno,
                ''  // observaciones vacías por defecto
            ]);

            // Actualizar estado del calendar
            await db.promise().query(`
                UPDATE calendar 
                SET estado = 2
                WHERE calendarid = ?
            `, [calendarId]);

            res.json({
                success: true,
                message: 'Turno confirmado exitosamente',
                turnoId: result.insertId
            });

        } catch (error) {
            console.error('Error detallado:', error);
            res.status(500).json({
                success: false,
                message: 'Error al reservar el turno',
                error: error.message
            });
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
            
            // Agregar consulta para obtener pacientes
            const [pacientes] = await db.promise().query(`
                SELECT p.personaid, p.nombre, p.apellido, p.dni 
                FROM persona p
                JOIN user u ON p.userid = u.userid
                WHERE u.idperfil = 4
                ORDER BY p.apellido, p.nombre
            `);

            return res.render('turno/secretarioBuscarAgenda', {
                title: 'Buscar Turnos',
                sucursales: sucursales,
                pacientes: pacientes,
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
            // Removemos la verificación de rol para permitir al admin
            // if (req.session.user.idperfil !== 3) {
            //     return res.redirect('/');
            // }

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

            res.render('turno/secretarioConfirmarTurno', {
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
            const { turnoId } = req.params;
            
            // Actualizar estado del turno a cancelado (3)
            await db.promise().query(`
                UPDATE turno 
                SET estadoturno_id = 3
                WHERE turniid = ?
            `, [turnoId]);

            // Liberar el calendar
            const [turno] = await db.promise().query(
                'SELECT calendar_id FROM turno WHERE turniid = ?', 
                [turnoId]
            );

            if (turno.length) {
                await db.promise().query(`
                    UPDATE calendar 
                    SET estado = 1
                    WHERE calendarid = ?
                `, [turno[0].calendar_id]);
            }

            res.json({ 
                success: true, 
                message: 'Turno cancelado exitosamente' 
            });

        } catch (error) {
            console.error('Error al cancelar turno:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al cancelar el turno' 
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
            const { sucursal, especialidad, medico, paciente } = req.body;
            
            const [turnos] = await db.promise().query(`
                SELECT c.calendarid, c.fechaturno, c.inicioturno, c.finalturno,
                       a.nombreagenda, s.nombre_sucrsal as sucursal_nombre,
                       p.nombre as medico_nombre, p.apellido as medico_apellido,
                       e.nombre_esp as especialidad,
                       COALESCE(t.estadoturno_id, 1) as estado_turno
                FROM calendar c
                JOIN agenda a ON c.agendaid = a.agendaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN medicos m ON a.medico_id = m.medicoid
                JOIN persona p ON m.personaid = p.personaid
                JOIN especialidad e ON m.especialidadId = e.especialidadId
                LEFT JOIN turno t ON c.calendarid = t.calendar_id
                WHERE m.medicoid = ?
                AND c.estado = 1
                AND c.fechaturno >= CURDATE()
                ORDER BY c.fechaturno, c.inicioturno
            `, [medico]);

            // Agrupar turnos por fecha
            const turnosAgrupados = turnos.reduce((acc, turno) => {
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
                pacienteId: paciente,
                user: req.session.user,
                moment: require('moment')
            });

        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error al procesar la búsqueda');
        }
    },

    reservarTurnoPaciente: async (req, res) => {
        try {
            console.log('Datos recibidos:', req.query, req.body); // Log agregado
            
            const { calendarId } = req.query;
            const personaId = req.body.personaId || req.session.user.personaid;

            console.log('Verificando disponibilidad del turno...'); // Log agregado
            
            // Verificar si el turno ya está reservado
            const [turnoExistente] = await db.promise().query(`
                SELECT * FROM turno WHERE calendar_id = ?
            `, [calendarId]);

            if (turnoExistente.length > 0) {
                console.log('Turno ya reservado'); // Log agregado
                return res.status(400).json({
                    success: false,
                    message: 'El turno ya no está disponible'
                });
            }

            console.log('Creando nuevo turno...'); // Log agregado
            
            // Crear turno en estado "Reservado" (2)
            const [result] = await db.promise().query(`
                INSERT INTO turno (calendar_id, persona_id, estadoturno_id, created_at)
                VALUES (?, ?, 2, NOW())
            `, [calendarId, personaId]);

            // Actualizar estado del calendar
            await db.promise().query(`
                UPDATE calendar SET estado = 2 WHERE calendarid = ?
            `, [calendarId]);

            console.log('Turno creado exitosamente:', result); // Log agregado
            
            res.json({ 
                success: true, 
                turnoId: result.insertId,
                message: 'Turno reservado exitosamente'
            });
        } catch (error) {
            console.error('Error detallado:', error); // Log mejorado
            res.status(500).json({ 
                success: false,
                message: 'Error al reservar el turno',
                error: error.message 
            });
        }
    },

    confirmarTurnoSecretaria: async (req, res) => {
        try {
            console.log('Body recibido:', req.body);
            console.log('TurnoId:', req.body.turnoId);
            const { turnoId } = req.body;  // Asegúrate de recibir turnoId del body
            
            // Verificar que el turno exista y esté en estado reservado
            const [turnoActual] = await db.promise().query(
                'SELECT * FROM turno WHERE turniid = ? AND estadoturno_id = 2',
                [turnoId]
            );

            if (!turnoActual.length) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Turno no encontrado o no está en estado reservado' 
                });
            }

            // Actualizar el estado del turno
            await db.promise().query(`
                UPDATE turno 
                SET estadoturno_id = 4,
                    fecha_confirmacion = NOW()
                WHERE turniid = ?
            `, [turnoId]);

            res.json({ 
                success: true,
                message: 'Turno confirmado exitosamente'
            });

        } catch (error) {
            console.error('Error al confirmar turno:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al confirmar el turno',
                error: error.message 
            });
        }
    }
};

module.exports = turnoController; 