const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Ruta para obtener especialidades por sucursal
router.get('/especialidades/:sucursalId', async (req, res) => {
    console.log('Buscando especialidades para sucursal:', req.params.sucursalId);
    try {
        const [especialidades] = await db.promise().query(`
            SELECT DISTINCT e.especialidadId, e.nombre_esp
            FROM especialidad e
            JOIN medicos m ON e.especialidadId = m.especialidadid
            JOIN agenda a ON m.medicoid = a.medico_id
            WHERE a.sucursal_id = ? AND e.estado = 1
        `, [req.params.sucursalId]);
        
        if (!especialidades.length) {
            return res.status(404).json({
                success: false,
                message: 'No hay especialidades disponibles para esta sucursal'
            });
        }
        
        res.json({
            success: true,
            data: especialidades
        });
    } catch (error) {
        console.error('Error al obtener especialidades:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cargar especialidades',
            error: error.message
        });
    }
});

// Ruta para obtener médicos por sucursal y especialidad
router.get('/medicos/:sucursalId/:especialidadId', async (req, res) => {
    console.log('Buscando médicos para sucursal:', req.params.sucursalId, 'y especialidad:', req.params.especialidadId);
    try {
        const [medicos] = await db.promise().query(`
            SELECT DISTINCT m.medicoid, p.nombre, p.apellido
            FROM medicos m
            JOIN persona p ON m.personaid = p.personaid
            JOIN agenda a ON m.medicoid = a.medico_id
            WHERE a.sucursal_id = ? 
            AND m.especialidadid = ?
            AND m.estado = 1
        `, [req.params.sucursalId, req.params.especialidadId]);
        
        if (!medicos.length) {
            return res.status(404).json({
                success: false,
                message: 'No hay médicos disponibles para esta especialidad en la sucursal seleccionada'
            });
        }
        
        res.json({
            success: true,
            data: medicos
        });
    } catch (error) {
        console.error('Error al obtener médicos:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cargar médicos',
            error: error.message
        });
    }
});

module.exports = router; 