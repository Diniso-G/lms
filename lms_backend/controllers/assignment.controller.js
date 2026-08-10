const {User, Course, Assignment, Submission} = require('../models');

exports.createAssignment = async (req, res) => {
    try {
        if (req.user.role !== 'lecturer'){
            return res.status(403).json({message: 'Only lecturers can create assignments'});
        }
        const {title, description, dueDate} = req.body;
        const courseId = req.params.courseId;

        if (!title || !description || !dueDate){
            return res.status(400).json({message: 'Title, description and due date are required'});
        }
        const course = await Course.findByPk(courseId);
        if (!course) {
            return res.status(404).json({message: 'Course not found'});
        }
        if (course.lecturerId !== req.user.id){
            return res.status(403).json({message: 'Not authorised for this course'});
        }
        const assignment = await Assignment.create({title, description, dueDate, courseId });
        res.status(201).json({message: 'Assignment creared', assignment});
    } catch (err){
        console.error('Error fetching error', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.getAssignmentsForCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const assignments = await Assignment.findAll({
            where: {courseId}, attributes: ['id', 'title', 'description', 'dueDate']
        });
        res.status(200).json(assignments);
    } catch (err){
        console.error('Error fetching assignments error', err);
        res.status(500).json({message: 'Server error'});
    }
};
exports.submitAssignment = async (req, res) => {
    try {
        if (req.user.role !== 'student'){
            return res.status(403).json({message: 'Only students can submit assignments'});
        }
        const assignmentId = req.params.id;
        const studentId = req.user.id;

        const assignment = await Assignment.findByPk(assignmentId);
        if (!assignment) {
            return res.status(404).json({message: "Assignment not found"});
        }

        const course = await Course.findByPk(assignment.courseId);
        const student = await User.findByPk(studentId);
        const isEnrolled = await course.hasUser(student);
        if (!isEnrolled) {
            return res.status(403).json({message: 'You are not enrolled in this course'});
        }
        if (!req.file){
            return res.status(400).json({message: 'A file is required for submission'});
        }
        const existing = await Submission.findOne({where: {assignmentId, studentId} });
        if (existing){
            existing.filePath = req.file.filename;
            existing.submittedAt = new Date();
            await existing.save();
            return res.status(200).json({message: 'Submission updated', submission: existing});
        }

        const submission = await Submission.create({
            filePath: req.file.filename, assignmentId, studentId
        });
        res.status(201).json({message: 'Assignment submitted', submission});
    } catch (err){
        console.error('Error submission error', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.getSubmissionsForAssignment = async (req, res) => {
    try {
        if (req.user.role !== 'lecturer'){
            return res.status(403).json({message: 'Only lecturers can view submissions'});
        }

        const assignmentId = req.params.id;
        const submissions = await Submission.findAll({
            where: {assignmentId}, include: {model: User, attributes: ['id', 'name', 'email']}
        });
        res.status(200).json(submissions);
    } catch (err) {
        console.error("Error Fetching submission error:", err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.gradeSubmission = async (req, res) => {
    try {
        if (req.user.role !== 'lecturer') {
            return res.status(403).json({message: 'Only lecturers can grade submissions'});
        }
        const submissionId = req.params.id;
        const { grade, feedback} = req.body;

        if (grade == undefined) {
            return res.status(400).json({message: 'Grade is required'});
        }
        const submission = await Submission.findByPk(submissionId);
        if (!submission) return res.status(404).json({error: 'Submission not found'});

        submission.grade = grade;
        submission.feedback = feedback || null;
        await submission.save();
        res.status(200).json({message: 'Submission graded', submission});
    } catch (err) {
        console.error("Error grading error");
        res.status(500).json({message: 'Server error'});
    }
};

exports.getMySubmission = async (req, res) => {
    try{
        const assignmentId = req.params.id;
        const studentId = req.user.id;

        const submission = await Submission.findOne({ where: {assignmentId, studentId}});
        if (!submission) return res.status(404).json({message:'No submission found'});

        res.status(200).json(submission);
    } catch (err){
        console.error('Error fetching submission error', err);
        res.status(500).json({message: 'Server error'});
    }
};