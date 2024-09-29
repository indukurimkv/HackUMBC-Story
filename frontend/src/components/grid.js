import { useState, useEffect } from 'react';
import ButtonB from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

// Function to fetch stories from the backend
async function getStories() {
  const response = await fetch("http://localhost:8000/story", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const storyIDs = await response.json();

  // Fetch each story content based on IDs
  const stories = await Promise.all(storyIDs.IDs.map(async (id) => {
    const storyResponse = await fetch(`http://localhost:8000/story/${id}`, {
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

export default function StoryGrid() {
  const [stories, setStories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(""); // Store selected story content

  useEffect(() => {
    async function fetchStories() {
      const storyData = await getStories();
      setStories(storyData);
    }

    fetchStories();
  }, []);

  const handleOpen = (storyContent) => {
    setSelectedStory(storyContent); // Set the content of the clicked story
    setOpen(true); // Open the modal
  };

  const handleClose = () => setOpen(false);

  return (
    <div>
      {/* Map over stories and render each in a Card */}
      {stories.map((story, index) => (
        <Card key={index} style={{ width: '18rem', marginBottom: '1rem' }}>
          <Card.Body>
            <Card.Title>TITLE</Card.Title>
            <Card.Text>{story.content.substring(0, 100)}...</Card.Text> {/* Displaying a snippet of the story */}
            <ButtonB variant="primary" onClick={() => handleOpen(story.content)}>
              View Story
            </ButtonB>
          </Card.Body>
        </Card>
      ))}

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
            value={selectedStory} // Display the selected story content
            variant="outlined"
          />
          <Box mt={2} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleClose}>Close</Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
