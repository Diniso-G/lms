const {User, Course, Submission} = require('../models');

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
            attributes: ['id', 'title', 'description', 'lecturerId'],
            include: { model: User, as: 'lecturer', attributes: ['id', 'name', 'email']}
        });
        res.status(200).json(courses);
    } catch (err){
        console.error('Error fetching error', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.getLecturers = async (req, res) => {
    try {
        if (req.user.role !== 'admin'){
            return res.status(403).json({message: 'Access denied'});
        }
        const lecturers = await User.findAll({
            where: {role:'lecturer'},
            attributes: ['id', 'name', 'email']
        });
        res.status(200).json(lecturers);
    } catch (err){
        console.error('Error fetching lecturers', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.assignLecturer = async (req, res) => {
    try{
        if (req.user.role !== 'admin'){
            return res.status(403).json({message: 'Access denied'});
        }
        const {id} = req.params;
        const {lecturerId} = req.body;

        const course = await Course.findByPk(id);
        if (!course) return res.status(404).json({ message: 'Course not found'});

        if (!lecturerId){
            course.lecturerId = null;
            await course.save();
            res.status(200).json({message: 'Lecturer unassigned', course});
        }

        const lecturer = await User.findByPk(lecturerId);
        if (!lecturer || lecturer.role !== 'lecturer') {
            return res.status(404).json({message: 'Provided user is not a lecturer'});
        }

        course.lecturerId = lecturerId;
        await course.save();

        res.status(200).json({message: 'Lecturer assigned', course});
    }
    catch (err){
        console.error('Error assigning lecturers', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.getStats = async (req, res) => {
    try{
        if (req.user.role !== 'admin'){
            return res.status(403).json({message: 'Access denied'});
        }
        const totalUsers = await User.count();
        const totalStudents = await User.count({ where: {role: 'student'}});
        const totalLecturers = await User.count({ where: {role: 'lecturer'}});
        const totalAdmins = await User.count({ where: {role: 'admin'}});
        const totalCourses = await Course.count();
        const totalSubmissions = await Submission.count();

        const courses = await Course.findAll({include: {model: User, through: { attributes: []}}});
        const totalEnrollments = courses.reduce((sum, c) => sum + c.Users.length, 0);

        res.status(200).json({totalUsers, totalStudents, totalLecturers, totalAdmins, totalCourses, totalEnrollments, totalSubmissions});
    }
    catch (err){
        console.error('Error fetching stats', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.changeUserRole = async (req, res) => {
    const {id} = req.params;
    const {role} = req.body;

    if(!['student', 'lecturer', 'admin'].includes(role))
        return res.status(400).json({error: 'Invalid role'});
    try{
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({error: 'User not found'});
        
        user.role = role;
        await user.save();
        res.status(201).json({message: `User role updated to ${role}`});
    } catch (err){
        console.error('Error updating role:', err);
        res.status(500).json({message: 'Failed to update role'});
    }
};

exports.deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) return res.status(404).json({error: 'User not found'});

        await user.destroy();
        res.json({message: 'User deleted successfully'});
    } catch (err) {
        console.error('Error deleted user', err);
        res.status(500).json({error: 'Failed to delete user'});
    }
};

exports.deleteCourse = async (req, res) => {
    const {id} = req.params;
    try {
        const course = await Course.findByPk(id);
        if (!course) return res.status(404).json({error: 'Course not found'});

        await course.destroy();
        res.json({message: 'Course deleted successfully'});
    } catch (err) {
        console.error('Error deleted course', err);
        res.status(500).json({error: 'Failed to delete course'});
    }
};
