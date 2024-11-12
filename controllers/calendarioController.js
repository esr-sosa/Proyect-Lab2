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
            if (req.session.user.idperfil !== 1) {
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
    }
};

module.exports = calendarioController; 