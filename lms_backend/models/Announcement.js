const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Announcement = sequelize.define('Announcement', {
    id:{ 
        type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true
    },
    content: {
        type: DataTypes.TEXT, allowNull: false}, 
    courseId: {
        type: DataTypes.INTEGER, allowNull:false
    }
});

module.exports = Announcement;