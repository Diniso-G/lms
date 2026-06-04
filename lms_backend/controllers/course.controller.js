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

