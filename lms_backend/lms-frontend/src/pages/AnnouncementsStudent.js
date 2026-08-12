import React, {useEffect, useState} from "react";
import {useLocation, useParams, Link} from "react-router-dom";
import axios from 'axios';
import '../styles/app.css';

function AnnouncementsStudent(){
    const {id: courseId} = useParams();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const courseTitle = location.state?.courseTitle || 'Course';

    const [loading, setLoading] = useState(true);
    const [announcementByCourse, setAnnouncementsByCourse] = useState({});
    //const [announcementInputs, setAnnouncementInputs] = useState({});
    

    useEffect(() => {
    axios.get(`http://localhost:5000/api/announcements/course/${courseId}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setAnnouncementsByCourse({ [courseId]: res.data});
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
}, [courseId, token]);

if (loading) return <p> Loading announcements...</p>;

return (
        <div className="dashboard page-enter">
            <Link className="back-link" to={`/student/course/${courseId}`}>&larr; Back to {courseTitle}-COMEBACK TO THIS PLES</Link>
            <div className="detail-header">
                <div>
                    <span className="welcome-eyebrow">Announcements</span>
                    <h1>{courseTitle}</h1>
                </div>
            </div>

            {(announcementByCourse[courseId] || []).length === 0 ? (
                <p>No announcements yet</p>
            ) : (
                <ul className="announcement-list">
                    {announcementByCourse[courseId].map(a => (
                        <li key={a.id} className="announcement-item">
                            <p>{a.content}</p>
                            <small>{new Date(a.createdAt).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default AnnouncementsStudent;