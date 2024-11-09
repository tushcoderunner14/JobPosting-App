import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { List, ListItem, ListItemText, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';


const Candidates = () => {
  const { jobId } = useParams();
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (candidate) => {
    setSelectedCandidate(candidate);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCandidate(null);
  };

  const handleSaveStatus = () => {
    setCandidates(candidates.map(c =>
      c === selectedCandidate ? selectedCandidate : c
    ));
    handleClose();
  };
  return (
    <div>
      <h2>Candidates for Job {jobId}</h2>
      <List>
        {candidates.map((candidate, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={candidate.name}
              secondary={`Status: ${candidate.status}`}
            />
            <Button variant="outlined" onClick={() => handleOpen(candidate)}>View Details</Button>
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Candidate Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={selectedCandidate?.name || ''}
            disabled
          />
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={selectedCandidate?.email || ''}
            disabled
          />
          <TextField
            label="Status"
            fullWidth
            margin="normal"
            value={selectedCandidate?.status || ''}
            onChange={(e) =>
              setSelectedCandidate({ ...selectedCandidate, status: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveStatus} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Candidates
