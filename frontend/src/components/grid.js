import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

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

  useEffect(() => {
    async function fetchStories() {
      const storyData = await getStories();
      setStories(storyData);
    }

    fetchStories();
  }, []);

  return (
    <div>
      {stories.map((story, index) => (
        <Card key={index} style={{ width: '18rem', marginBottom: '1rem' }}>
          <Card.Body>
            <Card.Title>TITLE</Card.Title>
            <Card.Text>{story.content}</Card.Text>
            <Button variant="primary">View Story</Button>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
