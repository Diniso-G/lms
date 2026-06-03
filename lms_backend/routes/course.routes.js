const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

const multer = require('multer');
const path = require('path');
const {Course} = require('../models');
const courseController = require('../controllers/course.controller');

const storage = multer.diskStorage({
    destination:function( req, file, cb){
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage, 
    fileFilter: (req, file, cb) => {
        const allowedTypes = /pdf|doc|docx/;
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.test(ext)) cb(null, true);
        else cb(new Error('Only ODF/DOC/DOCX allowed'));
    }
});

router.post('/:id/upload', auth, upload.single('document'), async (req, res) =>{
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
module.exports = router;