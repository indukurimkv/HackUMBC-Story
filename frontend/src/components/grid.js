import { useState, useEffect } from 'react';
import ButtonB from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';


import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

// Function to fetch stories from the backend
async function getStories() {
  const response = await fetch("https://api.gyanar.com/story", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const storyIDs = await response.json();

  // Fetch each story content based on IDs
  const stories = await Promise.all(storyIDs.IDs.map(async (id) => {
    const storyResponse = await fetch(`https://api.gyanar.com/story/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const story = await storyResponse.json();
    return {
      id: story.id, 
      content: story.body,
    };
  }));

  return stories;
}

// Function to lock a story
async function lockStory(id) {
  await fetch(`https://api.gyanar.com/story/${id}/lock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}

async function unlockStory(id) {
  await fetch(`https://api.gyanar.com/story/${id}/unlock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
}

// Function to fetch lock status of a story
async function getLockStatus(id) {
  const response = await fetch(`https://api.gyanar.com/story/${id}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    const data = await response.json();
    return data.locked;
  }
  return false;
}

// Function to update the story on the server
function editStory(text, ID) {
  console.log(text);
  const data = {
    id: ID,
    content: text,
  };

  fetch("https://api.gyanar.com/story?mode=a", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(response => response.json())
    .then(responseData => console.log(responseData));
}

export default function StoryGrid() {
  const [stories, setStories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState({}); // Store selected story object (content and id)
  const [storyUpdate, setStoryUpdate] = useState(""); // To store the edited story text
  const [isLocked, setIsLocked] = useState(false); // Store lock status
  const [isEditing, setIsEditing] = useState(false); // Track if the user is editing

  useEffect(() => {
    async function fetchStories() {
      const storyData = await getStories();
      setStories(storyData);
    }

    fetchStories();
  }, []);

  const handleOpen = async (story) => {
    setSelectedStory(story); 
    const lockStatus = await getLockStatus(story.id); 
    setIsLocked(lockStatus);
    setOpen(true);
  };

  const handleClose = () => {
    setIsEditing(false); // Reset editing state when modal is closed
    setOpen(false);
  };

  // Function to handle when the user clicks the "Edit" button
  const handleEdit = async () => {
    setIsEditing(true); // Enable editing mode
    await lockStory(selectedStory.id); // Lock the story by calling the lockStory function
    setIsLocked(true); // Update the lock status to reflect the story is now locked
  };

  // Function to handle adding the edited story
  const handleAdd = async () => {
    editStory(storyUpdate, selectedStory.id);
    await unlockStory(selectedStory.id);
    // Clear the text field
    setStoryUpdate("");
    handleClose();
    window.location.reload(false);
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
      {/* Map over stories and render each in a Card within a Bootstrap grid system */}
      <Row xs={1} md={2} lg={3} className="g-4">
        {stories.map((story, index) => (
          <Col key={index} style={{ width: '18rem', margin: '10px' }}>
            <Card style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>TITLE</Card.Title>
                <Card.Text>{story.content.substring(0, 100)}...</Card.Text> {/* Displaying a snippet of the story */}
                <ButtonB variant="primary" onClick={() => handleOpen(story)}>
                  View Story
                </ButtonB>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Material-UI Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h6" component="h2" gutterBottom>
            Full Story
          </Typography>
          <TextField
            id="outlined-multiline-static"
            label="Story"
            multiline
            fullWidth
            rows={8}
            value={selectedStory.content} // Display the selected story content
            variant="outlined"
            disabled={isEditing} // Disable this field while editing
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            {/* Show the Edit button only if the story is not locked */}
            {!isLocked && !isEditing && (
              <Button variant="contained" onClick={handleEdit}>
                Edit
              </Button>
            )}

            {/* Show the editable TextField when the story is being edited */}
            {isEditing && (
              <TextField
                id="outlined-multiline-static"
                label="Story Edit"
                multiline
                fullWidth
                rows={8}
                value={storyUpdate}
                onChange={(e) => setStoryUpdate(e.target.value)} // Update the story content
                variant="outlined"
              />
            )}

            {/* Add button for submitting the edits */}
            {isEditing && (
              <Button variant="contained" onClick={handleAdd}>
                Add
              </Button>
            )}
          </Box>
          <div>
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
