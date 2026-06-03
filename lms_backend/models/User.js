const { DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User',{ 
    id:{ 
        type: DataTypes.INTEGER, autoIncrement: true, 
        primaryKey: true

    },
    name: {
        type: DataTypes.STRING, allowNull: false, 
        validate: { notEmpty: true}
    },
    email: {
        type: DataTypes.STRING, allowNull: false, unique: true,
        validate: {isEmail: true}
    },
    password: { 
        type: DataTypes.STRING, allowNull: false
    },
    role: {type: DataTypes.ENUM('student', 'lecturer', 'admin'), allowNull: false,
        defaultValue: 'student'
    }

});
//User.belongsToMany(Course, {through: 'UserCourses'});
//Course.belongsToMany(User, {through: 'UserCourses'});

module.exports = User;
