//could be useless
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import '../styles/app.css';

function LecturerDashboard(){
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFiles, setSelectedFiles] = useState({});

    const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
    const [showAssignments, setShowAssignments] = useState({});
    const [showAssignmentForm, setShowAssignmentForm] = useState({});
    const [assignmentTitle, setAssignmentTitle] = useState({});
    const [assignmentDescription, setAssignmentDescription] = useState({});
    const [assignmentDueDate, setAssignmentDueDate] = useState({});
    const [submissionsByAssignment, setSubmissionsByAssignment] = useState({});
    const [gradeInputs, setGradeInputs] = useState({});


    useEffect(() => {
    axios.get("http://localhost:5000/api/courses", {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setCourses(res.data);
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
}, [token]);

const createCourse = async () => {
    if (!title || !description){
        alert('Title and description required');
        return;
    }
    try{
        const res = await axios.post(`http://localhost:5000/api/courses`, { title, description}, {
            headers: {Authorization: `Bearer ${token}`}
    });

    console.log('Axios response:', res);
    if(!res || !res.data) {
        alert('No response from server');
        return;
    }
    alert("Course Created");
    setCourses([...courses, res.data.course]);
    setTitle('');
    setDescription('');
    } catch(err) {
        console.error('Error creating course', err)
        alert(err.response?.data?.message || "Failed to create course");
    }
};
const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
};

const handleFileChange = (courseId, file) => {
    setSelectedFiles(prev => ({ ...prev, [courseId]: file}));
};

const uploadDocument = async (courseId) => {
    const file = selectedFiles[courseId];
    if (!file) {
        alert("Please select a file first");
        return;
    }

    const formData = new FormData();
    formData.append('document', file);

    try{
        const res = await axios.post(
            `http://localhost:5000/api/courses/${courseId}/upload`,
            formData, {headers:{Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',},}
        );
        alert("Document uploaded successfully");
        alert(res.data.message);
        setCourses(prevCourses => prevCourses.map(course => course.id === courseId
            ? { ...course, documentPath: res.data.file.filename}
            : course
        ));
    } catch (err){
        console.error(err);
        alert(err.response?.data?.message || 'Failed to upload document');
    }
};

const toggleAssignments = async (courseId) => {
    const willShow = !showAssignments[courseId];
    setShowAssignments(prev => ({ ...prev, [courseId]: willShow }));

    if (willShow && !assignmentsByCourse[courseId]) {
        try{
            const res = await axios.get(`http://localhost:5000/api/assignments/course/${courseId}`, { headers: {Authorization: `Bearer ${token}`}}
            );
            setAssignmentsByCourse(prev => ({ ...prev, [courseId]: res.data}));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to load assignments');
        }
    }

};

const toggleAssignmentForm = (courseId) => {
    setShowAssignmentForm(prev => ({ ...prev, [courseId]: !prev[courseId] }));
};

const createAssignment = async (courseId) => {
    const ttl = assignmentTitle[courseId];
    const desc = assignmentDescription[courseId];
    const due = assignmentDueDate[courseId];

    if (!ttl || !desc || !due) {
        alert('Title, description and due date are required');
        return;
    }
    try {
        const res = await axios.post(`http://localhost:5000/api/assignments/course/${courseId}`, 
            { title: ttl, description: desc, dueDate: due}, {headers: {Authorization: `Bearer ${token}`}}
        );
        setAssignmentsByCourse(prev => ({
            ...prev, [courseId]: [...LecturerDashboard(prev[courseId] || []), res.data.assignment]
        }));
        setAssignmentTitle(prev => ({ ...prev, [courseId]: ''}));
        setAssignmentDescription(prev => ({ ...prev, [courseId]: ''}));
        setAssignmentDueDate(prev => ({ ...prev, [courseId]: ''}));
        setShowAssignmentForm(prev => ({ ...prev, [courseId]: false}));
        alert('Assignment created');
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to create assignment');
    }
};

const viewSubmissions = async (assignmentId) => {
    try{
        const res = await axios.get(`http://localhost:5000/api/assignments/${assignmentId}/submissions`, 
            {headers: {Authorization: `Bearer ${token}`}}
        );
        setSubmissionsByAssignment(prev => ({ ...prev, [assignmentId]: res.data }));
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to load submissions');
    }
};

const handleGradeChange = (submissionId, field, value) => {
    setGradeInputs(prev => ({
        ...prev, [submissionId]: { ...prev[submissionId], [field]: value}
    }));
};

const submitGrade = async (assignmentId, submissionId) => {
    const input = gradeInputs[submissionId];
    if (!input || input.grade === undefined || input.grade === '') {
        alert('Enter a grade first');
        return;
    }
    try {
        await axios.put(`http://localhost:5000/api/assignments/submission/${submissionId}/grade`,
            { grade: input.grade, feedback: input.feedback || ''}, {headers: {Authorization: `Bearer ${token}`}}
        );
        alert('Submission Graded');
        viewSubmissions(assignmentId);
    } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to grade Submission');
    }
};

if (!token) return <p>Please Login First</p>;

if (loading) return <p> Loading courses...</p>;

return (
    <div className="dashboard page-enter">
        <h1>Lecturer Dashboard</h1>

        <button className="btn btn-logout" onClick={logout}>Logout</button>
        <h2>Create new Courses</h2>
        <div className="form-card"> 
            <div className="input-group">
                <input type="text"
                    placeholder=""
                    value={title}
                    onChange={e => setTitle(e.target.value)}/>
                <label>Course Title</label>
            </div>

            <br />
            <div className="input-group">
                <textarea placeholder="" value={description}
                    onChange={e => setDescription(e.target.value)}/>
                <label>Course Description</label> 
            </div>

            <br />
            <button className="btn btn-enroll" onClick={createCourse}>Create Course</button>
        </div>
        <h2>All Courses</h2>
        {courses.length === 0 ? 
            <p>No courses yet</p> : (
            <ul className="course-list">
                {courses.map(course => (
                    <li key = {course.id} className="course-items">
                        <div className="course-left">
                            <strong>{course.title}</strong> -{course.description}
                        </div>
                        <div className="course-right">
                            <input type='file' onChange={e => 
                            handleFileChange(course.id, e.target.files[0])}/>
                            <button className="btn btn-upload" onClick={() =>uploadDocument(course.id)}>
                                Upload Document
                            </button>
                        </div>
                        <div>
                            {course.documentPath && (
                            <a href = {`http://localhost:5000/uploads/${course.documentPath}`} 
                            target='_blank' rel = 'noopener noreferrer'>
                            View Document</a>
                            )}
                        </div>
                        <div className="assignment-section">
                            <button className=" btn btn-desc" onClick={() => toggleAssignments(course.id)}>
                                {showAssignments[course.id] ? "Hide Assignments" : "Show Assignmnets"}
                            </button>

                            {showAssignments[course.id] && (
                                <div>
                                    <button className="btn btn desc" onClick={() => toggleAssignmentForm(course.id)}>
                                        {showAssignmentForm[course.id] ? "Cancel" : "New Assignment"}
                                    </button>
                                    
                                    {showAssignmentForm[course.id] && (
                                        <div className="form-card">
                                            <div className="input-group">
                                                <input type="text" value={assignmentTitle[course.id] || ''} onChange={e => setAssignmentTitle(prev => ({ ...prev, [course.id]: e.target.value}))}/>
                                                <label>Assignment Title</label>
                                            </div>
                                            <div className="input-group">
                                                <textarea value={assignmentDescription[course.id] || ''} onChange={e => setAssignmentDescription(prev => ({ ...prev, [course.id]: e.target.value}))}/>
                                                <label>Assignment Description</label>
                                            </div>
                                            <div className="input-group">
                                                <input type="date" value={assignmentDueDate[course.id] || ''} onChange={e => setAssignmentDueDate(prev => ({ ...prev, [course.id]: e.target.value}))}/>
                                                <label>Assignment Due Date</label>
                                            </div>
                                            <button className="btn btn-enroll" onClick={() => createAssignment(course.id)}>
                                                Create Assignment
                                            </button>
                                        </div>
                                    )}

                                    {(assignmentsByCourse[course.id] || []).length === 0 ? (
                                        <p>No assignments yet</p>
                                    ) : (
                                        <ul className="assignment-list">
                                            {assignmentsByCourse[course.id].map(assignment => (
                                                <li key={assignment.id} className="assignment-item">
                                                    <strong>{assignment.title}</strong>
                                                    <p>{assignment.description}</p>
                                                    <small>Due: {new Date(assignment.dueDate).toLocaleDateString()}</small>
                                                    <div>
                                                        <button className="btn btn-desc" onClick={() => viewSubmissions(assignment.id)}>
                                                            View Submissions
                                                        </button>
                                                    </div>

                                                    {submissionsByAssignment[assignment.id] && (
                                                        <ul className="submission-list">
                                                            {submissionsByAssignment[assignment.id].length === 0 ? (
                                                                <p>No submissions yet</p>
                                                            ) : (
                                                                submissionsByAssignment[assignment.id].map(sub => (
                                                                    <li key={sub.id} className="submission-item">
                                                                        <span>{sub.User?.name} ({sub.User?.email})</span>
                                                                        <a href={`http://localhost:5000/uploads/submissions/${sub.filePath}`} target="_blank" rel="noopener nonreferrer">
                                                                        View File</a>
                                                                        <input type="number" placeholder="Grade" value={gradeInputs[sub.id]?.grade ?? sub.grade ?? ''} onChange={e => handleGradeChange(sub.id, 'grade', e.target.value)} />
                                                                        <input type="text" placeholder="Feedback" value={gradeInputs[sub.id]?.feedback ?? sub.feedback ?? ''} onChange={e => handleGradeChange(sub.id, 'feedback', e.target.value)} />
                                                                        <button className="btn btn-upload" onClick={() => submitGrade(assignment.id, sub.id)}>
                                                                            Save Grade
                                                                        </button>
                                                                    </li>
                                                                ))
                                                            )}
                                                        </ul>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        )}
    </div>
);
    

}
export default LecturerDashboard;
