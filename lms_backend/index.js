require('dotenv').config();

const express = require('express');
const cors = require('cors');

const sequelize = require('./config/database');

const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const adminRoutes = require('./routes/admin.routes');

const assignmentRoutes = require('./routes/assignment.routes');
const announcementRoutes = require('./routes/announcement.routes');


const app = express();
console.log('Starting LMS Server');

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/uploads', express.static('uploads'));

app.use('/api/assignments', assignmentRoutes);
app.use('/api/announcements', announcementRoutes);

app.get('/', (req, res) => {
    res.send('LMS API running');
});

setInterval(() => {
  console.log('Server still alive...');
}, 1000000); // keep the server alive

sequelize.authenticate()
.then(() => {
    console.log('MySQL connected'); 
    return sequelize.sync({ alter:true });
})
.then(() => {
    console.log('Models synced');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => console.log('DB error:', err));





