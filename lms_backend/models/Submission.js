const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Submission = sequelize.define('Submission', {
    id:{ 
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true
    },
    filePath: {
        type: DataTypes.STRING, allowNull: false}, 
    grade: {
        type: DataTypes.FLOAT, allowNull:true},
    feedback: {
        type: DataTypes.TEXT, allowNull:true},
    submittedAt: {
        type: DataTypes.DATE, defaultValue: DataTypes.NOW},
    assignmentId: {
        type: DataTypes.INTEGER, allowNull:false},
    studentId: {
        type: DataTypes.INTEGER, allowNull:false
    }
});

module.exports = Submission;