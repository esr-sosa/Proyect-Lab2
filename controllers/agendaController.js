const db = require('../config/db');
const moment = require('moment');

const agendaController = {
    listarAgenda: async (req, res) => {
        try {
            if (req.session.user.idperfil === 1) { // admin
                const [agendas] = await db.promise().query(`
                    SELECT a.*, p.nombre as persona_nombre, p.apellido,
                           m.medicoid, s.nombre_sucrsal as sucursal_nombre,
                           ta.tipo as tipo_atencion
                    FROM agenda a 
                    JOIN persona p ON a.persona_id = p.personaid
                    JOIN medicos m ON a.medico_id = m.medicoid
                    JOIN sucursal s ON a.sucursal_id = s.sucursalid
                    JOIN tipoatencion ta ON a.ttipoid = ta.atencionid
                    ORDER BY a.createdAt DESC
                `);

                res.render('agenda/listaAgenda', {
                    title: 'Lista de Agendas',
                    agendas,
                    user: req.session.user
                });
            } else if (req.session.user.idperfil === 4) { // paciente
                res.render('agenda/buscarAgenda', {
                    title: 'Buscar Agenda',
                    user: req.session.user
                });
            } else {
                res.redirect('/');
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar las agendas');
        }
    },

    crearAgenda: async (req, res) => {
        try {
            if (req.session.user.idperfil !== 1) {
                return res.redirect('/');
            }

            const [medicos] = await db.promise().query(`
                SELECT m.*, p.nombre, p.apellido 
                FROM medicos m 
                JOIN persona p ON m.personaid = p.personaid
                WHERE m.estado = 1
            `);

            const [sucursales] = await db.promise().query('SELECT sucursalid, nombre_sucrsal FROM sucursal WHERE estado = 1');
            const [tiposAtencion] = await db.promise().query('SELECT * FROM tipoatencion');

            res.render('agenda/formAgenda', {
                title: 'Crear Agenda',
                medicos,
                sucursales,
                tiposAtencion,
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar el formulario');
        }
    },

    insertarAgenda: async (req, res) => {
        const { persona_id, sucursal_id, medico_id, nombreagenda, duracion, ttipoid } = req.body;
        
        try {
            await db.promise().query(`
                INSERT INTO agenda 
                (persona_id, sucursal_id, medico_id, nombreagenda, duracion, ttipoid, createdAt, updateAt)
                VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [persona_id, sucursal_id, medico_id, nombreagenda, duracion, ttipoid]);
            
            res.redirect('/agenda');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al crear la agenda');
        }
    }
};

module.exports = agendaController; 