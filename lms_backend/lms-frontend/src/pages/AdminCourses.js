import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import axios from 'axios';
import '../styles/app.css';

function AdminCourses(){
    const token = localStorage.getItem('token');

    const [courses, setCourses] = useState([]);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(true);
   // const [loadingCourses /*, setLoadingCourses*/] = useState(true);
    const [selectedLecturer, setSelectedLecturer] = useState({});

    const [visibleCourses, setVisibleCourses] = useState({});
    
    useEffect(() => {
    axios.get("http://localhost:5000/api/admin/courses", {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setCourses(res.data);
        setLoading(false);
    })
    .catch(err => {
        console.error('Error fetching courses:', err);
        setLoading(false);
    });

    axios.get("http://localhost:5000/api/admin/lecturers", {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setLecturers(res.data);
    })
    .catch(err => {
        console.error('Error fetching lecturers:', err);
    });
}, [token]);

const deleteCourse = (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;
    axios.delete(`http://localhost:5000/api/admin/courses/${courseId}`, {
        headers: {Authorization: `Bearer ${token}`},
    })
    .then(() => {
        alert('Course deleted successfully');
        setCourses(courses.filter((course) => course.id !== courseId));

    })
    .catch((err) => {
        alert(err.response?.data?.message || 'Failed to delete course');
    });
};

const toggleCourseDescription = (courseId) => {
    setVisibleCourses((prev) => ({
        ...prev, [courseId]: !prev[courseId],
    }));
};

const handleLecturerSelect = (courseId, lecturerId) => {
    setSelectedLecturer(prev => ({ ...prev, [courseId]: lecturerId}));
};

const assignLecturer = async (courseId) => {
    const lecturerId = selectedLecturer[courseId];
    if (!lecturerId) {
        alert('Choose a lecturer first');
        return;
    }
    try {
        const res = await axios.put(`http://localhost:5000/api/admin/courses/${courseId}/lecturer`, 
            {lecturerId: lecturerId || null}, {headers: {Authorization: `Bearer ${token}`}}
        );
        setCourses(prev => prev.map(c => c.id === courseId ? res.data.course : c));
        alert(lecturerId ? "Lecturer assigned" : "Lecturer assignment updated");
    }
    catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to assign lecturer');
    }  
};

if (loading) return <p>Loading...</p>;

return (
    <div className="dashboard page-enter">
        <Link className="back-link" to="/admin-dashboard">&larr; Back to OverView RETURN HERE</Link>
        <h1>All Courses</h1>

        {/*loadingCourses ? <p> Loading courses...</p> :*/
            courses.length === 0 ? 
            <p>No courses yet</p>
         : (
            <ul className="course-list">
                {courses.map(course => (
                    <li key = {course.id} className="course-items">
                        <div className="course-left">
                            <strong>{course.title}</strong>
                            <p>Lecturer: {course.lecturer ? `${course.lecturer.name} ( ${course.lecturer.email})` : 'Unassigned'}</p> 
                        </div>
                        <div className="course-right">
                            <button className= "btn btn-desc" onClick={() => toggleCourseDescription(course.id)}>
                                {visibleCourses[course.id] ? "Hide" : "Show"}
                            </button>
                            <button className="btn btn-delete" onClick={() => deleteCourse(course.id)}>
                                Delete
                            </button>
                        </div> 
                        {visibleCourses[course.id] && (<p>{course.description}</p>)}
                        
                        <div className="course-right">
                            <select value={selectedLecturer[course.id] || ''} onChange={e => handleLecturerSelect(course.id, e.target.value)}>
                                <option value="">-- Assigned --</option>
                                {lecturers.map(l => (
                                    <option key={l.id} value={l.id}>{l.name} ({l.email})</option>
                                ))}
                            </select>
                            <button className="btn btn-upload" onClick={() => assignLecturer(course.id)}>
                                Update Lecturer
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        )}

    </div>
);
}

export default AdminCourses;
