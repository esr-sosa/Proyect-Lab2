const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { checkRole } = require('../middleware/auth');

router.use(checkRole([1]));

// Listar obras sociales
router.get('/', async (req, res) => {
    try {
        const [obras_sociales] = await db.promise().query('SELECT * FROM obra_social ORDER BY nombre');
        res.render('obra_social', {
            title: 'Gestión de Obras Sociales',
            user: req.session.user,
            obras_sociales
        });
    } catch (error) {
        console.error('Error:', error);
        res.render('obra_social', {
            title: 'Gestión de Obras Sociales',
            user: req.session.user,
            obras_sociales: [],
            error: 'Error al cargar las obras sociales'
        });
    }
});

// Mostrar formulario de creación
router.get('/crear', (req, res) => {
    res.render('crear_obra_social', {
        title: 'Nueva Obra Social',
        user: req.session.user,
        obra: null
    });
});

// Mostrar formulario de edición
router.get('/editar/:id', async (req, res) => {
    try {
        const [obras] = await db.promise().query(
            'SELECT * FROM obra_social WHERE id_obra_social = ?',
            [req.params.id]
        );
        if (obras.length === 0) {
            return res.redirect('/obraSocial');
        }
        res.render('crear_obra_social', {
            title: 'Editar Obra Social',
            user: req.session.user,
            obra: obras[0]
        });
    } catch (error) {
        console.error('Error:', error);
        res.redirect('/obraSocial');
    }
});

// Agregar nueva obra social
router.post('/agregar', async (req, res) => {
    const { nombre } = req.body;
    try {
        await db.promise().query(
            'INSERT INTO obra_social (nombre, estado, createAt, updateAt) VALUES (?, 1, NOW(), NOW())',
            [nombre]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al agregar la obra social' });
    }
});

// Editar obra social existente
router.post('/editar/:id', async (req, res) => {
    const { nombre } = req.body;
    try {
        await db.promise().query(
            'UPDATE obra_social SET nombre = ?, updateAt = NOW() WHERE id_obra_social = ?',
            [nombre, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al actualizar la obra social' });
    }
});

// Cambiar estado (activar/desactivar)
router.post('/toggle/:id', async (req, res) => {
    const { estado } = req.body;
    try {
        await db.promise().query(
            'UPDATE obra_social SET estado = ?, updateAt = NOW() WHERE id_obra_social = ?',
            [estado, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Error al cambiar el estado' });
    }
});

module.exports = router; 