import logo from './logo.svg';
import './App.css';
import ButtonB from 'react-bootstrap/Button';


import { useState, useRef, useEffect } from 'react'; // import useRef

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';  // Import TextField

import StoryGrid from "./components/grid.js"

import "bootstrap/dist/css/bootstrap.min.css"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  //Create story popup
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  //create story input
  //const [textInput, setTextInput] = useState("");
  const storyInputRef = useRef(null); 

  function updateGrid(){
    console.log("update")
    return(
      <StoryGrid/>
    )
  }

  function createStory(text){
    console.log(text)
    const data = {
      id: "",
      content: text 
    };
    
    // Make the request
    fetch("http://localhost:8000/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then(response => response.json()).then(responseData => console.log(responseData))
    setOpen(false);
    window.location.reload(false);
  };

  

  return (
    <div className="App">
      <header className="App-header">
      <Modal
          open={open}
          onClose={handleClose}  // Ensure the modal closes properly
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Start the story!
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              {/* Use Material-UI TextField instead of a plain input */}
              <TextField
                id="storyInput"
                label="Story"
                multiline
                rows={4} // Set this to make it look like a text area
                fullWidth // Make it take the full width of the modal
                inputRef={storyInputRef} // Use ref to capture input value
                variant="outlined"
              />
              <Box mt={2}>
                <Button variant="contained" onClick={() => createStory(storyInputRef.current.value)}>
                  Submit
                </Button>
              </Box>
            </Typography>
          </Box>
        </Modal>
        <h1 style={{ color: 'white' }} >
          STORY MAKER
        </h1>
        <div>

          <StoryGrid/>
        </div>
        <ButtonB variant="primary" onClick={handleOpen}>Create Story</ButtonB>

        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
