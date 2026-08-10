const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

const { submissionUpload} = require('../middleware/upload.middleware');
const assignmentController = require('../controllers/assignment.controller');

router.post('/course/:courseId', auth, assignmentController.createAssignment);
router.get('/course/:courseId', auth, assignmentController.getAssignmentsForCourse);
router.post('/:id/submit', auth, submissionUpload.single('file'), assignmentController.submitAssignment);
router.get('/:id/submissions', auth, assignmentController.getSubmissionsForAssignment);
router.put('/submission/:id/grade', auth, assignmentController.gradeSubmission);
router.get('/:id/my-submission', auth, assignmentController.getMySubmission);

module.exports = router;