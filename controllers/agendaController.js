const db = require('../config/db');
const moment = require('moment');
const cacheWrapper = require('../config/cache');

const agendaController = {
    listarAgenda: async (req, res) => {
        try {
            const [agendas] = await db.promise().query(`
                SELECT a.*, p.nombre, p.apellido,
                       s.nombre_sucrsal,
                       e.nombre_esp,
                       t.tipo as tipo_atencion,
                       t.descripcion as descripcion_atencion
                FROM agenda a
                JOIN medicos m ON a.medico_id = m.medicoid
                JOIN persona p ON m.personaid = p.personaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN especialidad e ON m.especialidadid = e.especialidadId
                JOIN tipoatencion t ON a.ttipoid = t.atencionid
                ORDER BY p.apellido, p.nombre
            `);

            res.render('agenda/agenda', {
                title: 'Gestión de Agendas',
                agendas,
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar las agendas');
        }
    },

    crearAgenda: async (req, res) => {
        try {
            const medicos = await getMedicosWithCache();
            const [sucursales] = await db.promise().query(`
                SELECT sucursalid, nombre_sucrsal 
                FROM sucursal 
                WHERE estado = 1
            `);
            const [tiposAtencion] = await db.promise().query(`
                SELECT * FROM tipoatencion
            `);

            res.render('agenda/formAgenda', {
                title: 'Crear Agenda',
                medicos,
                sucursales,
                tiposAtencion,
                user: req.session.user
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Error al cargar el formulario');
        }
    },

    insertarAgenda: async (req, res) => {
        try {
            const { medico_id, sucursal_id, duracion, ttipoid } = req.body;
            
            // Obtener el personaid del médico
            const [medico] = await db.promise().query(`
                SELECT personaid FROM medicos WHERE medicoid = ?
            `, [medico_id]);

            if (!medico.length) {
                return res.status(404).send('Médico no encontrado');
            }

            // Generar nombre de agenda automáticamente
            const [doctor] = await db.promise().query(`
                SELECT CONCAT(nombre, ' ', apellido) as nombre_completo 
                FROM persona 
                WHERE personaid = ?
            `, [medico[0].personaid]);

            const nombreagenda = `Agenda ${doctor[0].nombre_completo}`;

            const [result] = await db.promise().query(`
                INSERT INTO agenda 
                (persona_id, sucursal_id, ttipoid, nombreagenda, duracion, medico_id, createdAt, updateAt)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [medico[0].personaid, sucursal_id, ttipoid, nombreagenda, duracion, medico_id]);
            
            // Redirigir al calendario con el ID de la agenda creada
            res.redirect(`/agenda/horarios/${result.insertId}`);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al crear la agenda');
        }
    },

    gestionHorarios: async (req, res) => {
        try {
            const agendaId = req.params.id;
            const [agenda] = await db.promise().query(`
                SELECT a.*, p.nombre, p.apellido,
                       s.nombre_sucrsal,
                       e.nombre_esp
                FROM agenda a
                JOIN medicos m ON a.medico_id = m.medicoid
                JOIN persona p ON m.personaid = p.personaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN especialidad e ON m.especialidadid = e.especialidadId
                WHERE a.agendaid = ?
            `, [agendaId]);

            if (!agenda.length) {
                return res.status(404).send('Agenda no encontrada');
            }

            res.render('agenda/gestionHorarios', {
                title: 'Gestión de Horarios',
                agenda: agenda[0],
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar la gestión de horarios');
        }
    },

    cambiarEstadoAgenda: async (req, res) => {
        try {
            const { agendaId, estado } = req.body;
            
            // Actualizar estado de la agenda
            await db.promise().query(`
                UPDATE agenda 
                SET estado = ?, 
                    updateAt = NOW() 
                WHERE agendaid = ?
            `, [estado, agendaId]);

            // Actualizar estado de los horarios asociados
            await db.promise().query(`
                UPDATE calendar 
                SET estado = ?,
                    updateAt = NOW() 
                WHERE agendaid = ?
            `, [estado, agendaId]);

            res.json({ 
                success: true, 
                message: `Agenda ${estado === 1 ? 'activada' : 'desactivada'} exitosamente` 
            });
        } catch (error) {
            console.error('Error en cambiarEstadoAgenda:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al cambiar el estado de la agenda' 
            });
        }
    }
};

const getMedicosWithCache = async () => {
    return await cacheWrapper.getOrSet(
        'medicos_activos',
        async () => {
            const [medicos] = await db.promise().query(`
                SELECT 
                    m.medicoid,
                    p.nombre,
                    p.apellido,
                    p.dni,
                    e.nombre_esp as especialidad
                FROM medicos m
                JOIN persona p ON m.personaid = p.personaid
                JOIN especialidad e ON m.especialidadId = e.especialidadId
                WHERE m.estado = 1
                ORDER BY p.apellido, p.nombre
            `);
            return medicos;
        },
        300 // TTL de 5 minutos
    );
};

module.exports = agendaController; 