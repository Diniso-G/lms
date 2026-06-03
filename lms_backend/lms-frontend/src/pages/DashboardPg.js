import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../styles/app.css';


function DashboardPg(){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [showDescription, setShowDescription] = useState({});

useEffect(() => {
    axios.get("http://localhost:5000/api/courses", {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setCourses(res.data);
        //const enrolled = res.data.filter(course => course.users?.includes(token));
        //setEnrolledCourses(enrolled);
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
}, [token]);
useEffect(() => {
    axios.get('http://localhost:5000/api/courses/enrolled/my', {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setEnrolledCourses(res.data);
    })
    .catch(err => console.error(err));
}, [token]);

const enrollCourse = async (courseId) => {
    try{
        await axios.post(`http://localhost:5000/api/courses/${courseId}/enrol`, {}, {
            headers: {Authorization: `Bearer ${token}`}
        })
        alert("Successfully enrolled");
        const res = await axios.get('http://localhost:5000/api/courses/enrolled/my', {
            headers: {Authorization: `Bearer ${token}`}
        });
        //const course = courses.find(c=> c.id === courseId);
        //setEnrolledCourses(prev => [ ...prev, course]);
        setEnrolledCourses(res.data);
    } catch(err) {
        alert(err.response?.data?.message || "Enrollment failed");
        console.error(err);
    }
};
const toggleDescription = courseId => {
    setShowDescription(prev => ({ ...prev, [courseId]: !prev[courseId]}));
};
const isEnrolled = courseId => {
    if (!Array.isArray(enrolledCourses)) return false;
    return enrolledCourses.some(c => c.id === courseId);
};
const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
};
if (!token) return <p>Please Login First</p>;

if (loading) return <p> Loading courses...</p>;

return (
    <div className="dashboard">
        <h1>Student Dashboard</h1>

        <button className='btn btn-logout' onClick={logout}>Logout</button>
        <h2>Available Courses</h2>
            {courses.length === 0 ? <p>No courses available</p>
        : (
            <ul className="course-list">
                {courses.map(course => (
                   <li key = {course.id} className="course-item">
                    <div className="course-left">
                        <strong>{course.title}</strong>
                        {showDescription[course.id] && <p>{course.description}</p>}
                    </div>
                    <div className="course-right">
                        <button className="btn-enroll"
                            disabled ={isEnrolled(course.id)}
                            onClick={() => enrollCourse(course.id)}>
                            {isEnrolled(course.id) ? "Enrolled" : "Enroll"}
                        </button>
                        <button className="btn-desc" onClick={() => toggleDescription(course.id)}>
                            {showDescription[course.id] ? "Hide Description" : "Show Description"}
                        </button>
                    </div>
                    </li>
                ))}
            </ul>
        )}

        <h2> Enrolled Courses</h2>
        {enrolledCourses.length === 0? (
            <p>You have not enrolled in any courses yet</p>
        ):(
            <ul className="course-list">
                {enrolledCourses.map(course => (
                    <li key={course.id} className="course-item">
                        <div className="course-left">
                            <strong>{course.title}</strong>
                        </div>
                        <div className="course-right">
                            {course.documentPath? (
                                <a href={`http://localhost:5000/uploads/${course.documentPath}`}
                                target='_blank' rel = 'noopener noreferrer'> View Document</a>
                            ): <span> No document uploaded yet</span>}
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

}
export default DashboardPg;
