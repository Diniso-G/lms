
const sequelize = require('../config/database');

const User = require('./User');
const Course = require('./Course');

User.belongsToMany(Course, {through: 'UserCourses'});
Course.belongsToMany(User, {through: 'UserCourses'});

module.exports = {sequelize, User, Course};
