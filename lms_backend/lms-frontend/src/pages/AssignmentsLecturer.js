import React, {useEffect, useState} from "react";
import {useLocation, useParams, Link} from "react-router-dom";
import axios from 'axios';
import '../styles/app.css';

function AssignmentsLecturer(){
    const {id} = useParams();
    const location = useLocation();
    const token = localStorage.getItem('token');

    const courseTitle = location.state?.courseTitle || 'Course';

    const [loading, setLoading] = useState(true);
    const [assignmentTitle, setAssignmentTitle] = useState({});

    //const [title, setTitle] = useState('');
    //const [description, setDescription] = useState('');
    //const [selectedFiles, setSelectedFiles] = useState({});

    const [assignmentsByCourse, setAssignmentsByCourse] = useState({});
    //const [showAssignments, setShowAssignments] = useState({});
    const [showAssignmentForm, setShowAssignmentForm] = useState({});
    const [assignmentDescription, setAssignmentDescription] = useState({});
    const [assignmentDueDate, setAssignmentDueDate] = useState({});
    const [submissionsByAssignment, setSubmissionsByAssignment] = useState({});
    const [gradeInputs, setGradeInputs] = useState({});

    useEffect(() => {
    axios.get(`http://localhost:5000/api/assignments/course/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
    })
    .then(res => {
        setAssignmentsByCourse(prev => ({
            ...prev, [id]: res.data}));
        setLoading(false);
    })
    .catch(err => {
        console.error(err);
        setLoading(false);
    });
}, [id, token]);

/*
const toggleAssignments = async (courseId) => {
    const willShow = !showAssignments[courseId];
    setShowAssignments(prev => ({ ...prev, [courseId]: willShow }));

    if (willShow && !assignmentsByCourse[courseId]) {
        try{
            const res = await axios.get(`http://localhost:5000/api/assignments/course/${id}`, { headers: {Authorization: `Bearer ${token}`}}
            );
            setAssignmentsByCourse(prev => ({ ...prev, [courseId]: res.data}));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to load assignments');
        }
    }

};*/

const toggleAssignmentForm = (courseId) => {
    setShowAssignmentForm(prev => ({ ...prev, [courseId]: !prev[courseId] }));
};
/*
const handleAssignmentInputChange = (courseId, field, value) => {
    setShowAssignmentForm(prev => ({
        ...prev, [courseId]: {...prev[courseId], [field]: value}
    }));
};*/

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
            ...prev, [courseId]: [...(prev[courseId] || []), res.data.assignment]
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
if (loading) return <p> Loading assignments...</p>;

return (
        <div className="dashboard page-enter">
            <Link className="back-link" to={`/lecturer/course/${id}`}>&larr; Back to {courseTitle}-COMEBACK TO THIS PLES</Link>
            <div className="detail-header">
                <div>
                    <span className="welcome-eyebrow">Assignments</span>
                    <h1>{courseTitle}</h1>
                </div>
                <button className="btn btn-desc" onClick={() => toggleAssignmentForm(id)}>
                    {showAssignmentForm[id] ? "Cancel" : "+ New Assignment"}
                </button>
            </div>
            
                <div>
                    <button className="btn btn-desc" onClick={() => toggleAssignmentForm(id)}>
                        {showAssignmentForm[id] ? "Cancel" : "New Assignment"}
                    </button>
                    {showAssignmentForm[id] && (
                        <div className="form-card">
                            <div className="input-group">
                                <input type="text" value={assignmentTitle[id] || ''} onChange={e => setAssignmentTitle(prev => ({ ...prev, [id]: e.target.value}))}/>
                                <label>Assignment Title</label>
                            </div>
                            <div className="input-group">
                                <textarea value={assignmentDescription[id] || ''} onChange={e => setAssignmentDescription(prev => ({ ...prev, [id]: e.target.value}))}/>
                                <label>Assignment Description</label>
                            </div>
                            <div className="input-group">
                                <input type="date" value={assignmentDueDate[id] || ''} onChange={e => setAssignmentDueDate(prev => ({ ...prev, [id]: e.target.value}))}/>
                                <label>Assignment Due Date</label>
                            </div>
                            <button className="btn btn-enroll" onClick={() => createAssignment(id)}>
                                Create Assignment
                            </button>
                        </div>
                    )}

                    {(assignmentsByCourse[id] || []).length === 0 ? (
                        <p>No assignments yet</p>
                    ) : (
                        <ul className="assignment-list">
                            {assignmentsByCourse[id].map(assignment => (
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
                                                        <a href={`http://localhost:5000/uploads/submissions/${sub.filePath}`} target="_blank" rel="noopener noreferrer">
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

        </div>
    );
    
}
export default AssignmentsLecturer;