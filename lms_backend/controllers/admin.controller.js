const {User, Course} = require('../models');

exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin'){
            return res.status(403).json({message: 'Access denied'});
        }
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'role']
        });
        res.status(200).json(users);
    } catch (err){
        console.error('Error fetching error', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        if (req.user.role !== 'admin'){
            return res.status(403).json({message: 'Access denied'});
        }
        const courses = await Course.findAll({
            attributes: ['id', 'title', 'description']
        });
        res.status(200).json(courses);
    } catch (err){
        console.error('Error fetching error', err);
        res.status(500).json({message: 'Server error'});
    }
};
exports.changeUserRole = async (req, res) => {
    const {id} = req.params;
    const {role} = req.body;

    if(!['student', 'lecturer', 'admin'].includes(role))
        return res.status(400).json({error: 'Invalid role'});
    try{
        const user = await User.findByIdAndUpdate(id, {role}, {new: true});
        if (!user) return res.status(404).json({error: 'User not found'});
        res.status(201).json({message: `User role updated to ${role}`});
    } catch (err){
        console.error('Error fetching error:', err);
        res.status(500).json({message: 'Failed to update role'});
    }
};

exports.deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findByIdAndUpdate(id);
        if (!user) return res.status(404).json({error: 'User not found'});
        res.json({message: 'User deleted successfully'});
    } catch (err) {
        res.status(500).json({error: 'Failed to delete user'});
    }
};

exports.deleteCourse = async (req, res) => {
    const {id} = req.params;
    try {
        const course = await Course.findByIdAndUpdate(id);
        if (!course) return res.status(404).json({error: 'Course not found'});
        res.json({message: 'Course deleted successfully'});
    } catch (err) {
        res.status(500).json({error: 'Failed to delete course'});
    }
};