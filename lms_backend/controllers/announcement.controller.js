const {Course, Announcement} = require('../models');

exports.createAnnouncement = async (req, res) => {
    try{
        const { content} = req.body;
        const courseId = req.params.courseId;

        if (!content) return res.status(400).json({ message: 'Content is required'});

        const course = await User.findByPk(courseId);
        if (!course) return res.status(404).json({ message: 'Course nor found'});

        if (course.lecturerId !== req.user.id) return res.status(403).json({ message: 'Not authorised for this course'});

        const announcement = await Announcement.create({ content, courseId});
        res.status(201).json({message: 'Announcement posted', announcement});
    } catch (err){
        console.error('Error! Announcement creation error', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.getAnnouncementsForCourse = async (req, res) => {
    try{
        const courseId = req.params.courseId;
        const announcement = await Announcement.findAll({ where: {courseId}, order: [['createdAt', 'DESC']]});
        
        res.status(200).json(announcement);
    } catch (err){
        console.error('Error! Announcement fetching error', err);
        res.status(500).json({message: 'Server error'});
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try{
        const announcement = await Announcement.findByPk(req.params.id, {include: Course});
        if (!announcement) return res.status(404).json({ message: 'Announcement not found'});

        if (announcement.Course.lecturerId !== req.user.id) return res.status(403).json({ message: 'Not authorised'});

        await announcement.destroy();
        res.status(200).json('Announcement deleted');
    } catch (err){
        console.error('Error! Announcement deletion error', err);
        res.status(500).json({message: 'Server error'});
    }
};
