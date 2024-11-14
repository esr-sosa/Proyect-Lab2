const db = require('../config/db');

module.exports = {
    listarSucursales: async (req, res) => {
        try {
            const [sucursales] = await db.promise().query(`
                SELECT * FROM sucursal
                ORDER BY nombre_sucrsal ASC
            `);

            res.render('sucursal/listar', {
                title: 'Gestión de Sucursales',
                sucursales,
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al obtener sucursales');
        }
    },

    verFormulario: async (req, res) => {
        try {
            let sucursal = null;
            if (req.params.id) {
                const [result] = await db.promise().query(
                    'SELECT * FROM sucursal WHERE sucursalid = ?',
                    [req.params.id]
                );
                sucursal = result[0];
            }

            res.render('sucursal/formulario', {
                title: sucursal ? 'Editar Sucursal' : 'Nueva Sucursal',
                sucursal,
                user: req.session.user
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al cargar el formulario');
        }
    },

    guardarSucursal: async (req, res) => {
        try {
            const { nombre_sucrsal, direccion, telefono } = req.body;
            const { id } = req.params;

            if (id) {
                await db.promise().query(`
                    UPDATE sucursal 
                    SET nombre_sucrsal = ?, direccion = ?, telefono = ?
                    WHERE sucursalid = ?
                `, [nombre_sucrsal, direccion, telefono, id]);
            } else {
                await db.promise().query(`
                    INSERT INTO sucursal 
                    (nombre_sucrsal, direccion, telefono, estado, createdAt, updateAt)
                    VALUES (?, ?, ?, 1, NOW(), NOW())
                `, [nombre_sucrsal, direccion, telefono]);
            }

            res.redirect('/sucursal');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error al guardar la sucursal');
        }
    },

    eliminarSucursal: async (req, res) => {
        try {
            await db.promise().query(
                'DELETE FROM sucursal WHERE sucursalid = ?',
                [req.params.id]
            );
            res.json({ success: true });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                success: false,
                error: 'No se puede eliminar la sucursal porque tiene registros asociados'
            });
        }
    }
}; 