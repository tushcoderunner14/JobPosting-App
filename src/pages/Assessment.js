import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

const AssessmentPage = () => {
  const { jobId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [jobQuestions, setJobQuestions] = useState([]);
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState({ optionA: '', optionB: '', optionC: '', optionD: '' });
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [editIndex, setEditIndex] = useState(null); // Track if editing
  const navigate = useNavigate();

  useEffect(() => {
    const jobsFromStorage = JSON.parse(localStorage.getItem('jobsData')) || [];
    setJobs(jobsFromStorage);
    const selectedJobQuestions = JSON.parse(localStorage.getItem(`job_${jobId}_questions`)) || [];
    setJobQuestions(selectedJobQuestions);
  }, [jobId]);

  const handleAddOrUpdateQuestion = () => {
    // Check if the question already exists (excluding the one being edited)
    const duplicateQuestion = jobQuestions.some(
      (q, index) => q.question === question && index !== editIndex
    );

    if (duplicateQuestion) {
      alert('This question already exists for this job.');
      return;
    }

    const newQuestion = {
      question,
      options,
      correctAnswer
    };

    let updatedQuestions;
    if (editIndex !== null) {
      // Update existing question
      updatedQuestions = [...jobQuestions];
      updatedQuestions[editIndex] = newQuestion;
      setEditIndex(null); // Reset edit index
    } else {
      // Add new question
      updatedQuestions = [...jobQuestions, newQuestion];
    }

    localStorage.setItem(`job_${jobId}_questions`, JSON.stringify(updatedQuestions));
    setJobQuestions(updatedQuestions);
    setQuestion('');
    setOptions({ optionA: '', optionB: '', optionC: '', optionD: '' });
    setCorrectAnswer('');
  };

  const handleEditQuestion = (index) => {
    const questionToEdit = jobQuestions[index];
    setQuestion(questionToEdit.question);
    setOptions(questionToEdit.options);
    setCorrectAnswer(questionToEdit.correctAnswer);
    setEditIndex(index); // Set the index of the question being edited
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = jobQuestions.filter((_, i) => i !== index);
    localStorage.setItem(`job_${jobId}_questions`, JSON.stringify(updatedQuestions));
    setJobQuestions(updatedQuestions);
  };

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value
    }));
  };

  const handleBackToDashboard = () => {
    navigate('/');
  };

  return (
    <div>
      <Button onClick={handleBackToDashboard} variant="contained" color="secondary" style={{ marginBottom: '20px' }}>
        Back to Dashboard
      </Button>

      <h1>Assessment Page</h1>
      <FormControl fullWidth>
        <InputLabel>Select Job</InputLabel>
        <Select value={jobId} onChange={(e) => navigate(`/assessment/${e.target.value}`)}>
          {jobs.map((job) => (
            <MenuItem key={job.id} value={job.id}>
              {job.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <div>
        <h3>{editIndex !== null ? 'Edit Question' : 'Create Question'} for {jobs.find((job) => job.id === jobId)?.title}</h3>
        <TextField
          label="Question"
          fullWidth
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          margin="normal"
        />
        <TextField
          label="Option A"
          name="optionA"
          value={options.optionA}
          onChange={handleOptionChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Option B"
          name="optionB"
          value={options.optionB}
          onChange={handleOptionChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Option C"
          name="optionC"
          value={options.optionC}
          onChange={handleOptionChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Option D"
          name="optionD"
          value={options.optionD}
          onChange={handleOptionChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Correct Answer"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          fullWidth
          margin="normal"
        />

        <Button onClick={handleAddOrUpdateQuestion} variant="contained" color="primary">
          {editIndex !== null ? 'Update Question' : 'Add Question'}
        </Button>
      </div>

      <div>
        <h3>Existing Questions</h3>
        {jobQuestions.length > 0 ? (
          jobQuestions.map((q, index) => (
            <div key={index}>
              <p>{q.question}</p>
              <ul>
                <li>A: {q.options.optionA}</li>
                <li>B: {q.options.optionB}</li>
                <li>C: {q.options.optionC}</li>
                <li>D: {q.options.optionD}</li>
              </ul>
              <p>Correct Answer: {q.correctAnswer}</p>
              <Button onClick={() => handleEditQuestion(index)} variant="outlined" color="primary">
                Edit
              </Button>
              <Button onClick={() => handleDeleteQuestion(index)} variant="outlined" color="secondary" style={{ marginLeft: '10px' }}>
                Delete
              </Button>
              <hr />
            </div>
          ))
        ) : (
          <p>No questions for this job yet.</p>
        )}
      </div>
    </div>
  );
};

export default AssessmentPage;
