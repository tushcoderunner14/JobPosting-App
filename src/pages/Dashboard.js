import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Zoom from '@mui/material/Zoom';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [openCandidateDialog, setOpenCandidateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false); // Add dialog state
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedJobCandidates, setSelectedJobCandidates] = useState([]);
  const [jobToEdit, setJobToEdit] = useState({
    id: '',
    title: '',
    description: ''
  });
  const [newJob, setNewJob] = useState({
    title: '',
    description: ''
  });
  const navigate = useNavigate();

  const LOCAL_STORAGE_KEY_JOBS = 'jobsData';
  const LOCAL_STORAGE_KEY_CANDIDATES = 'candidatesData';

  // Retrieve jobs and candidates from localStorage
  function getJobsFromLocalStorage() {
    const jobs = localStorage.getItem(LOCAL_STORAGE_KEY_JOBS);
    return jobs ? JSON.parse(jobs) : [];
  }

  function getCandidatesFromLocalStorage() {
    const candidates = localStorage.getItem(LOCAL_STORAGE_KEY_CANDIDATES);
    return candidates ? JSON.parse(candidates) : [];
  }

  useEffect(() => {
    setJobs(getJobsFromLocalStorage());
    setCandidates(getCandidatesFromLocalStorage());
  }, []);

  const handleViewCandidates = (jobId) => {
    const jobCandidates = candidates.filter((candidate) => candidate.jobId === jobId);
    console.log(jobCandidates.length);
    setSelectedJobCandidates(jobCandidates);
    setSelectedJobId(jobId);
    setOpenCandidateDialog(true);
  };

  const handleCloseCandidateDialog = () => {
    setOpenCandidateDialog(false);
    setSelectedJobCandidates([]);
  };

  // Delete Job
  const handleDeleteJob = (jobId) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(updatedJobs);
    localStorage.setItem(LOCAL_STORAGE_KEY_JOBS, JSON.stringify(updatedJobs));
  };

  // Open Edit Job Dialog
  const handleEditJob = (job) => {
    setJobToEdit(job);
    setOpenEditDialog(true);
  };

  // Close Edit Job Dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setJobToEdit({ id: '', title: '', description: '' });
  };

  // Save Edited Job
  const handleSaveJobEdit = () => {
    const updatedJobs = jobs.map((job) =>
      job.id === jobToEdit.id ? { ...job, title: jobToEdit.title, description: jobToEdit.description } : job
    );
    setJobs(updatedJobs);
    localStorage.setItem(LOCAL_STORAGE_KEY_JOBS, JSON.stringify(updatedJobs));
    handleCloseEditDialog();
  };

  // Open Add Job Dialog
  const handleOpenAddJobDialog = () => {
    setOpenAddDialog(true);
  };

  // Close Add Job Dialog
  const handleCloseAddJobDialog = () => {
    setOpenAddDialog(false);
    setNewJob({ title: '', description: '' }); // Reset form
  };

  // Save New Job
  const handleAddJob = () => {
    const newJobData = {
      ...newJob,
      id: new Date().getTime().toString() // Generate a unique ID using timestamp
    };
    const updatedJobs = [...jobs, newJobData];
    setJobs(updatedJobs);
    localStorage.setItem(LOCAL_STORAGE_KEY_JOBS, JSON.stringify(updatedJobs));
    handleCloseAddJobDialog(); // Close the dialog after adding
  };

  const handleJobSelect = (jobId) => {
    navigate(`/assessment/${jobId}`);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <Button variant="contained" color="primary" onClick={handleOpenAddJobDialog}>
        Add New Job
      </Button>
      <List>
        {jobs.map((job) => {
          const candidateCount = candidates.filter(candidate => candidate.jobId === job.id).length;
          return (
            <ListItem key={job.id}>
              <Tooltip title={job.description} arrow TransitionComponent={Zoom}
                TransitionProps={{ timeout: 600 }}>
                <ListItemText
                  primary={job.title}
                  secondary={`Candidates Applied: ${candidateCount}`}
                />
              </Tooltip>
              <Button variant="outlined" onClick={() => handleViewCandidates(job.id)}>
                <GroupIcon />
              </Button>
              <Button variant="outlined" color="primary" onClick={() => handleEditJob(job)}>
                <ModeEditOutlineIcon />
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => handleDeleteJob(job.id)}>
                <DeleteIcon />
              </Button>
              <Button variant="outlined" onClick={() => handleJobSelect(job.id)}>
                <AssignmentIcon />
              </Button>
            </ListItem>
          );
        })}
      </List>

      {/* Candidates Dialog */}
      <Dialog open={openCandidateDialog} onClose={handleCloseCandidateDialog}>
        <DialogTitle>Candidates Applied for Job</DialogTitle>
        <DialogContent>
          {selectedJobCandidates.length > 0 ? (
            <div>
              {selectedJobCandidates.map((candidate, index) => (
                <div key={index}>
                  <p>Name: {candidate.name}</p>
                  <p>Application Date: {candidate.applicationDate}</p>
                  <p>Status: {candidate.status}</p>
                  <a href={candidate.resume} download>
                    Download Resume
                  </a>
                  <hr />
                </div>
              ))}
            </div>
          ) : (
            <p>No candidates applied for this job.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCandidateDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          <TextField
            label="Job Title"
            fullWidth
            value={jobToEdit.title}
            onChange={(e) => setJobToEdit({ ...jobToEdit, title: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Job Description"
            fullWidth
            value={jobToEdit.description}
            onChange={(e) => setJobToEdit({ ...jobToEdit, description: e.target.value })}
            margin="dense"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveJobEdit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Job Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddJobDialog}>
        <DialogTitle>Add New Job</DialogTitle>
        <DialogContent>
          <TextField
            label="Job Title"
            fullWidth
            value={newJob.title}
            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
            margin="dense"
          />
          <TextField
            label="Job Description"
            fullWidth
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
            margin="dense"
            multiline
            rows={4}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddJobDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddJob} color="primary">
            Add Job
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
