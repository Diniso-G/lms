
const sequelize = require('../config/database');

const User = require('./User');
const Course = require('./Course');
const Assignment = require('./Assignment');
const Submission = require('./Submission');

const Announcement = require('./Announcement');

User.belongsToMany(Course, {through: 'UserCourses'});
Course.belongsToMany(User, {through: 'UserCourses'});

Course.hasMany(Assignment, {foreignKey: 'courseId'});
Assignment.belongsTo(Course, {foreignKey: 'courseId'});

Assignment.hasMany(Submission, {foreignKey: 'assignmentId'});
Submission.belongsTo(Assignment, {foreignKey: 'assignmentId'});

User.hasMany(Submission, {foreignKey: 'studentId'});
Submission.belongsTo(User, {foreignKey: 'studentId'});

Course.hasMany(Announcement, {foreignKey: 'courseId'});
Announcement.belongsTo(Course, {foreignKey: 'courseId'});

module.exports = {sequelize, User, Course, Assignment, Submission, Announcement};
