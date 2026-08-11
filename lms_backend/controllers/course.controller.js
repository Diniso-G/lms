const {Course, User} = require('../models');

//CREATE COURSE
exports.createCourse = async (req, res) => {
    try{
        const { title, description} = req.body;
        if (!title || !description){
            return res.status(400).json({message: 'Title and description are required'});
        }
        const course = await Course.create({ title, description, lecturerId: req.user.id});
        res.status(201).json({message: 'Course Created', course});
    } catch (err){
        console.error('Error! Creation error:', err);
        res.status(500).json({message: 'Server error'});
    }

};

//GET ALL COURSES
exports.getCourses = async (req, res) => {
    try{
        const courses = await Course.findAll({
            attributes: ['id', 'title', 'description', 'documentPath']
        });
        res.status(200).json(courses);
    } catch (err){
        console.error('Error! Fetching error:', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;
        const course = await Course.findByPk(courseId, { attributes: ['id', 'title', 'description', 'documentPath', 'lecturerId']});

        if (!course) {
            return res.status(404).json({message: "Course not found"});
        }
        res.status(200).json(course);
    } catch (err) {
        console.error("Error frtching curse error", err);
        res.status(500).json({ message: 'Server error'});
    }
};

//ENROL IN COURSE
exports.enrolCourse = async (req, res) => {
    try{
        const userId = req.user.id;
        const courseId = req.params.id;

        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found'});

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found'});

        await course.addUser(user);
        res.status(200).json({message: ` User enrolled in course: ${course.title}`});
    } catch (err){
        console.error('Error! Enrolling in course', err);
        res.status(500).json({message: 'Server error'});
    }

};

exports.unenrolCourse = async (req, res) => {
    try{
        const userId = req.user.id;
        const courseId = req.params.id;

        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found'});

        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: 'User not found'});

        await course.removeUser(user);
        res.status(200).json({message: ` Unenroll from course: ${course.title}`});
    } catch (err){
        console.error('Error! Uenrolling in course', err);
        res.status(500).json({message: 'Server error'});
    }

};

exports.updateCourse = async (req, res) => {
    try{
        const courseId = req.params.id;
        const { title, description} = req.body;

        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found'});

        if (course.lecturerId !== req.user.id) return res.status(403).json({ message: 'Not authorised for this course'});

        if (title) course.title = title;
        if (description) course.description = description;
        await course.save();
        res.status(200).json({message: 'Course updated', course});
    } catch (err){
        console.error('Error! Updating error', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.deleteCourse = async (req, res) => {
    try{
        const courseId = req.params.id;

        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({ error: 'Course not found'});

        if (course.lecturerId !== req.user.id) return res.status(403).json({ message: 'Not authorised for this course'});

        await course.destroy();
        res.status(200).json({message: 'Course deleted'});
    } catch (err){
        console.error('Error! Deleting error', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.getEnrolledStudents = async (req, res) => {
    try{
        const courseId = req.params.id;

        const course = await Course.findByPk(courseId, {include: {model: User, attributes: ['id', 'name', 'email'], through: { attributes: []}}
        });
        if (!course) return res.status(404).json({ error: 'Course not found'});

        if (course.lecturerId !== req.user.id) return res.status(403).json({ message: 'Not authorised for this course'});

        res.status(200).json(course.Users);
    } catch (err){
        console.error('Error! Fetching students error', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.getMyCourses = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findByPk(userId, {
            include: {
                model: Course, attributes: ['id', 'title', 'description', 'documentPath'],
                through: { attributes: [] }
            }
        });
        if (!user) return res.status(404).json({ message: 'User not found'});
        res.json(user.Courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
};

