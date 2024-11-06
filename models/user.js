// models/User.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class User extends Model {}

User.init({
    userid: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    idperfil: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 4,
    },
    nombre_user: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    estado: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'User',
    tableName: 'user',
    timestamps: true,
});

module.exports = User;
