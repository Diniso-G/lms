const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF|DOC|DOCX allowed'));
    }
};

const courseStorage = multer.diskStorage({
    destination:function( req, file, cb){
        cb(null, 'uploads/courses');
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const submissionStorage = multer.diskStorage({
    destination:function( req, file, cb){
        cb(null, 'uploads/submission');
    },
    filename: function (req, file, cb){
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const courseUpload = multer({
    storage: courseStorage, fileFilter
});

const submissionUpload = multer({
    storage: submissionStorage, fileFilter
});

module.exports = {courseUpload, submissionUpload};