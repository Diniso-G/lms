const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

const announcementController = require('../controllers/announcement.controller');

router.post('/course/:courseId', auth, announcementController.createAnnouncement);
router.get('/course/:courseId', auth, announcementController.getAnnouncementsForCourse);
router.delete('/:id', auth, announcementController.deleteAnnouncement);

module.exports = router;
