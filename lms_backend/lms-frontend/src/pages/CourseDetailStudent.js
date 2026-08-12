import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import '../styles/app.css';


function CourseDetailStudent(){
    const {id} = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
        
    useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/enrolled/my`, {
        headers: {Authorization: `Bearer ${token}`}
        })
        .then(res => {
            const found = res.data.find(c => String(c.id) === id);
            setCourse(found || null);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, [id, token]);

    const unenroll = async () => {
        if (!window.confirm('Are you sure you want to unenroll from this course?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/courses/${id}/enrol`, { headers: {Authorization: `Bearer ${token}`}});
            alert('Unenrolled successfully');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to unenroll');
        }
    };

    if (loading) return <p> Loading courses...</p>;
    if (!course) return <p> Course not found</p>;
    
    return (
        <div className="dashboard page-enter">
            <Link className="back-link" to="/dashboard">&larr; Back to my Learning-COMEBACK TO THIS PLES</Link>
            <div className="detail-header">
                <div>
                    <span className="welcome-eyebrow">Course</span>
                    <h1>{course.title}</h1>
                </div>
    
                <div className="course-card-actions">
                    <Link className="link-btn link-btn-outline" to={`/student/course/${id}/assignments`} state={{courseTitle: course.title}}>
                        Assignments
                    </Link>
                    <Link className="link-btn link-btn-outline" to={`/student/course/${id}/announcements`} state={{courseTitle: course.title}}>
                        Announcements
                    </Link>
                </div>
            </div>
    
            <p>{course.description}</p>
            <h2>Course Document</h2>
            {course.documentPath ? (
                <p><a href = 
                    {`http://localhost:5000/uploads/courses${course.documentPath}`} 
                    target='_blank' rel = 'noopener noreferrer'>
                    View current document
                </a></p>
            ) : <p>No document uploaded yet.</p>}

            <h2>Unenroll</h2>
            <button className="btn btn-delete" onClick={unenroll}> Unenroll from this course</button>
        </div>
    );
}
export default CourseDetailStudent;