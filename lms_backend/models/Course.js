const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
    id:{ 
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true
    },
    title: {
        type: DataTypes.STRING, allowNull: false}, 
    description: {
        type: DataTypes.TEXT, allowNull:false},
    lecturerId: {
        type: DataTypes.INTEGER, allowNull:false},
    documentPath: {
        type: DataTypes.STRING, allowNull:true
    }
});

module.exports = Course;