const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

const { courseUpload} = require('../middleware/upload.middleware');
const {Course} = require('../models');
const courseController = require('../controllers/course.controller');


router.post('/:id/upload', auth, courseUpload.single('document'), async (req, res) =>{
    try{
        const courseId = parseInt(req.params.id, 10);
        const course = await Course.findByPk(courseId);
        if (!course) return res.status(404).json({message: "Course not found"});

        course.documentPath = req.file.filename;
        await course.save();
        res.status(200).json({message: 'Document uploaded', file: req.file});
    } catch (err){
        console.error(err);
        res.status(500).json({message: 'Server error'});
    }
});

router.post('/', auth, courseController.createCourse);
router.get('/', auth, courseController.getCourses);
router.post('/:id/enrol', auth, courseController.enrolCourse);
//student courses
router.get('/enrolled/my', auth, courseController.getMyCourses);

router.put('/:id', auth, courseController.updateCourse);
router.delete('/:id', auth, courseController.deleteCourse);
router.delete('/:id/enrol', auth, courseController.unenrolCourse);
router.get('/:id/students', auth, courseController.getEnrolledStudents);

module.exports = router;