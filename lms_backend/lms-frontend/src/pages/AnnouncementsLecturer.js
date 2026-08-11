import React, {useEffect, useState} from "react";
import {useLocation, useParams, Link} from "react-router-dom";
import axios from 'axios';
import '../styles/app.css';

function AnnouncementsLecturer(){
    const {id: courseId} = useParams();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const courseTitle = location.state?.courseTitle || 'Course';

    const [loading, setLoading] = useState(true);
    const [showAnnouncements, setShowAnnouncements] = useState({});
    const [announcementByCourse, setAnnouncementsByCourse] = useState({});
    const [announcementInputs, setAnnouncementInputs] = useState({});
    

    useEffect(() => {
    axios.get(`http://localhost:5000/api/announcenments/courses/${courseId}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setAnnouncementsByCourse({
            [courseId]: res.data});
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
}, [courseId, token]);

const toggleAnnouncements = async (courseId) => {
    const willShow = !showAnnouncements[courseId];
    setShowAnnouncements(prev => ({ ...prev, [courseId]: willShow}));
    if (willShow && !announcementByCourse[courseId]) {
        try{
            const res = await axios.get(`http://localhost:5000/api/announcements/course/${courseId}`, { headers: {Authorization: `Bearer ${token}`}}
            );
            setAnnouncementsByCourse(prev => ({ ...prev, [courseId]: res.data}));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to load announcements');
        }
    }
};

const handleAnnouncementInputChange = (courseId, value) => {
    setAnnouncementInputs(prev => ({ ...prev, [courseId]: value}));
};

const postAnnouncement = async (courseId) => {
    const content = announcementInputs[courseId];
    if (!content) {
        alert('Write something first');
        return;
    }
    try {
        const res = await axios.post(`http://localhost:5000/api/announcements/course/${courseId}`, 
            { content}, {headers: {Authorization: `Bearer ${token}`}}
        );
        setAnnouncementsByCourse(prev => ({
            ...prev, [courseId]: [res.data.announcement, ...(prev[courseId] || [])]
        }));
        setAnnouncementInputs(prev => ({ ...prev, [courseId]: ''}));
        alert('Announcement posted');
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to post announcement');
    }
};

const deleteAnnouncement = async (courseId, announcementId) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')){
        return;
    }
    try {
        await axios.delete(
            `http://localhost:5000/api/announcements/${announcementId}`, 
            {headers: {Authorization: `Bearer ${token}`} }
        );
        setAnnouncementsByCourse(prev => ({
            ...prev, [courseId]: prev[courseId].filter(a => a.id !== announcementId)
        }));
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to delete announcement');
    }
};
if (loading) return <p> Loading announcements...</p>;

return (
        <div className="dashboard page-enter">
            <Link className="back-link" to={`/lecturer/course/${courseId}`}>&larr; Back to {courseTitle}-COMEBACK TO THIS PLES</Link>
            <div className="detail-header">
                <div>
                    <span className="welcome-eyebrow">Announcements</span>
                    <h1>{courseTitle}</h1>
                </div>
            </div>
            
            <div className="form-card">
                <div className="input-group">
                    <textarea value={announcementInputs[courseId] || ''} onChange={e => handleAnnouncementInputChange(courseId, e.target.value)}/>
                    <label>New Announcement</label>
                </div>
                <button className="btn btn-enroll" onClick={() => postAnnouncement(courseId)}>
                    Post
                </button>
            </div>

            {(announcementByCourse[courseId] || []).length === 0 ? (
                <p>No announcements yet</p>
            ) : (
                <ul className="announcement-list">
                    {announcementByCourse[courseId].map(a => (
                        <li key={a.id} className="announcement-item">
                            <p>{a.content}</p>
                            <small>{new Date(a.createdAt).toLocaleString()}</small>
                            <button className="btn btn-delete" onClick={()=> deleteAnnouncement(courseId, a.id)}>
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
    
}
export default AnnouncementsLecturer;