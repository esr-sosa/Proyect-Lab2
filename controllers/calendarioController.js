const db = require('../config/db');
const moment = require('moment');

const calendarioController = {
    calendarioAgenda: async (req, res) => {
        try {
            const [dias] = await db.promise().query(`
                SELECT * FROM calendar 
                WHERE agendaid = ?
            `, [req.params.agendaId]);

            res.json(dias);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el calendario' });
        }
    },

    agregarCal: async (req, res) => {
        try {
            if (![1, 2].includes(req.session.user.idperfil)) {
                return res.redirect('/');
            }

            const [dias] = await db.promise().query(`
                SELECT * FROM calendar 
                WHERE agendaid = ?
            `, [req.params.agendaId]);

            const [agenda] = await db.promise().query(`
                SELECT a.*, s.nombre as sucursal_nombre
                FROM agenda a
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                WHERE a.agendaid = ?
                ORDER BY a.createdAt DESC
            `, [req.params.agendaId]);

            res.render('agenda/agregarDia', {
                title: 'Agregar Día',
                dias,
                agenda: agenda[0],
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar el formulario');
        }
    },

    insertarCal: async (req, res) => {
        const { agendaid, fecha, inicioturno, finalturno } = req.body;
        
        try {
            await db.promise().query(`
                INSERT INTO calendar 
                (agendaid, fechaturno, inicioturno, finalturno, estado, createdAt, updateAt)
                VALUES (?, ?, ?, ?, 1, NOW(), NOW())
            `, [agendaid, fecha, inicioturno, finalturno]);

            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al crear el calendario' });
        }
    },

    crearHorarios: async (req, res) => {
        try {
            const { agendaId, fechaInicio, fechaFin, franjas, diasSemana } = req.body;

            // Verificar si la agenda existe
            const [agenda] = await db.promise().query(`
                SELECT a.*, m.especialidadId, a.duracion, p.nombre, p.apellido,
                       s.nombre_sucrsal, e.nombre_esp
                FROM agenda a
                JOIN medicos m ON a.medico_id = m.medicoid
                JOIN persona p ON m.personaid = p.personaid
                JOIN sucursal s ON a.sucursal_id = s.sucursalid
                JOIN especialidad e ON m.especialidadid = e.especialidadId
                WHERE a.agendaid = ?
            `, [agendaId]);

            if (!agenda.length) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Agenda no encontrada' 
                });
            }

            let fechaActual = moment(fechaInicio);
            const fechaLimite = moment(fechaFin);
            const duracionTurno = agenda[0].duracion;
            let horariosCreados = 0;

            while (fechaActual.isSameOrBefore(fechaLimite)) {
                // Obtener el día actual (0-6, donde 0 es domingo)
                const diaActual = fechaActual.day();
                
                // Convertir el día actual al formato que usamos (lunes=0, domingo=6)
                const diaAjustado = diaActual === 0 ? 6 : diaActual - 1;
                
                // Si el día actual no está en los días seleccionados, saltar al siguiente día
                if (!diasSemana.includes(diaAjustado)) {
                    fechaActual.add(1, 'days');
                    continue;
                }

                for (const franja of franjas) {
                    let horaActual = moment(franja.inicio, 'HH:mm');
                    const horaFinal = moment(franja.fin, 'HH:mm');

                    while (horaActual.isBefore(horaFinal)) {
                        const finalTurno = moment(horaActual).add(duracionTurno, 'minutes');
                        
                        await db.promise().query(`
                            INSERT INTO calendar 
                            (agendaid, fechaturno, inicioturno, finalturno, estado, createdAt, updateAt)
                            VALUES (?, ?, ?, ?, 1, NOW(), NOW())
                        `, [
                            agendaId,
                            fechaActual.format('YYYY-MM-DD'),
                            horaActual.format('HH:mm:ss'),
                            finalTurno.format('HH:mm:ss')
                        ]);
                        
                        horariosCreados++;
                        horaActual.add(duracionTurno, 'minutes');
                    }
                }
                fechaActual.add(1, 'days');
            }

            res.json({
                success: true,
                message: 'Horarios creados exitosamente',
                horariosCreados,
                agenda: agenda[0]
            });

        } catch (error) {
            console.error('Error en crearHorarios:', error);
            res.status(500).json({
                success: false,
                message: 'Error al crear los horarios'
            });
        }
    },

    obtenerHorarios: async (req, res) => {
        try {
            const [horarios] = await db.promise().query(`
                SELECT * FROM calendar 
                WHERE agendaid = ?
            `, [req.params.agendaId]);

            const eventos = horarios.map(horario => ({
                title: `${moment(horario.inicioturno, 'HH:mm:ss').format('HH:mm')} - ${moment(horario.finalturno, 'HH:mm:ss').format('HH:mm')}`,
                start: `${horario.fechaturno}T${horario.inicioturno}`,
                end: `${horario.fechaturno}T${horario.finalturno}`,
                color: horario.estado === 1 ? '#28a745' : '#dc3545'
            }));

            res.json(eventos);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener horarios' });
        }
    }
};

module.exports = calendarioController; 