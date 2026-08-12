import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import '../styles/app.css';


function DashboardPg(){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [showDescription, setShowDescription] = useState({});
/*
    const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
    const [showAssignments, setShowAssignments] = useState({});
    const [selectedFiles, setSelectedFiles] = useState({});
    const [mySubmission, setMySubmission] = useState({});
    */

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
/*
const toggleAssignments = async (courseId) => {
    const willShow = !showAssignments[courseId];
    setShowAssignments(prev => ({ ...prev, [courseId]: willShow }));

    if (willShow && !assignmentsByCourse[courseId]) {
        try{
            const res = await axios.get(`http://localhost:5000/api/assignments/course/${courseId}`, { headers: {Authorization: `Bearer ${token}`}}
            );
            setAssignmentsByCourse(prev => ({ ...prev, [courseId]: res.data}));
            res.data.forEach(a => fetchMySubmission(a.id));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to load assignments');
        }
    }

};

const fetchMySubmission= async (assignmentId) => {
    try {
        const res = await axios.get(`http://localhost:5000/api/assignments/${assignmentId}/my-submission`, {headers: {Authorization: `Bearer ${token}`}});
        setMySubmission(prev => ({ ...prev, [assignmentId]: res.data}));
    } catch (err) {
        
        console.error(err);
        alert(err.response?.data?.message || 'Failed to load submissions');
    }
};

const handleAssignmentFileChange = (assignmentId, file) => {
    setSelectedFiles(prev => ({
        ...prev, [assignmentId]: file
    }));
};

const submitAssignment = async (assignmentId) => {
    const file = selectedFiles[assignmentId];
    if (!file) {
        alert('Select a file first');
        return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
        await axios.post(`http://localhost:5000/api/assignments/${assignmentId}/submit`,
            formData, {headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data'}}
        );
        alert('Assignment submitted');
        fetchMySubmission(assignmentId);
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to submit assignment');
    }
};

*/
if (!token) return <p>Please Login First</p>;

if (loading) return <p> Loading courses...</p>;

return (
    <div className="dashboard page-enter">
        <div className="detail-header">
            <span className="welcome-eyebrow">Student Dashboard</span>
            <h1>My Courses</h1>

            <button className='btn btn-logout' onClick={logout}>Logout</button>
        </div>

        <h2> Enrolled Courses</h2>
        {enrolledCourses.length === 0? (
            <p>You have not enrolled in any courses yet</p>
        ):(
            <div className="course-grid">
                {enrolledCourses.map(course => (
                    <div key={course.id} className="course-card">
                        <div>
                            <h3 className="course-card-title">{course.title}</h3>
                            <span className={course.documentPath ? "badge" : "badge badge-muted"}>
                                {course.documentPath ? "Document available" : "No document"}
                            </span>
                        </div>
                        <div className="course-card-actions">
                            <Link className="link-btn" to={`/student/course/${course.id}`} state={{ courseTitle: course.title}}>
                                Open
                            </Link>
                            <Link className="link-btn link-btn-outline" to={`/student/course/${course.id}/assignments`} state={{ courseTitle: course.title}}>
                                Assignment
                            </Link>
                            <Link className="link-btn link-btn-outline" to={`/student/course/${course.id}/announcements`} state={{ courseTitle: course.title}}>
                                Announcement
                            </Link>
                        </div>

                        {/*

                        <div className="assignment-section">
                            <button className="btn btn-desc" onClick={() => toggleAssignments(course.id)}>
                                {showAssignments[course.id] ? "Hide Assignments" : "Show Assignments"}
                            </button>

                            {showAssignments[course.id] && (
                                (assignmentsByCourse[course.id] || []).length === 0 ? (
                                    <p>No assignments yet</p>
                                ) : (
                                    <ul className="assignment-list">
                                        {assignmentsByCourse[course.id].map(assignment => {
                                            const submission = mySubmission[assignment.id];
                                            return (
                                                <li key={assignment.id} className="assignment-item">
                                                    <strong>{assignment.title}</strong>
                                                    <p>{assignment.description}</p>
                                                    <small>Due: {new Date(assignment.dueDate).toLocaleDateString()}</small>

                                                    {submission ? (
                                                        <div>
                                                            <p>Submitted {new Date(submission.submittedAt).toLocaleDateString()}</p>
                                                            {submission.grade !== null ? (
                                                                <p>Grade: {submission.grade} - {submission.feedback || 'No feedback'}</p>
                                                            ) : (
                                                                <p>Not graded yet</p>
                                                            )}
                                                            <input type="file" onChange={e => handleAssignmentFileChange(assignment.id, e.target.files[0])} />
                                                            <button className="btn btn-upload" onClick={() => submitAssignment(assignment.id)}>
                                                                Resubmit
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <input type="file" onChange={e => handleAssignmentFileChange(assignment.id, e.target.files[0])} />
                                                            <button className="btn btn-upload" onClick={() => submitAssignment(assignment.id)}>
                                                                Submit
                                                            </button>
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>         
                                )
                            )}
                        </div>
                        */}
                    </div>
                    
                ))}
            </div>
        )}

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

    </div>
);

}
export default DashboardPg;
