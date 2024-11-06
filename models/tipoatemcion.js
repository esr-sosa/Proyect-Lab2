// models/TipoAtencion.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class TipoAtencion extends Model {}

TipoAtencion.init({
    atencionid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tipo: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    observaciones: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'TipoAtencion',
    tableName: 'tipoatencion',
    timestamps: true,
});

module.exports = TipoAtencion;
