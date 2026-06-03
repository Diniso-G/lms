const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

const adminController = require('../controllers/admin.controller');
router.use(auth);

router.get('/users', auth, adminController.getAllUsers);
router.get('/courses', auth, adminController.getAllCourses);

router.delete('/users/:id', adminController.deleteUser);
router.delete('/courses/:id', adminController.deleteCourse);
router.put('/users/:id/role', adminController.changeUserRole);

module.exports = router;