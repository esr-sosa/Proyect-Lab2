// models/Turno.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Turno extends Model {}

Turno.init({
    turniid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    persona_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    calendar_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    hora: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    estadoturno_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    observaciones: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Turno',
    tableName: 'turno',
    timestamps: true,
});

module.exports = Turno;
