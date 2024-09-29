# Inspiration
It seems with every passing day that the world is increasingly more divided. We believe that it is vital for people to connect with each other by finding a common ground. For eons, stories have helped bring people together across time and cultures. Therefore, we wanted to create an application that uses stories to meld together the imaginations, opinions, and dreams of people across the world.

# What it does
This app enables users to create stories and for other users to build on top of existing stories. Users can view how the stories they started evolve as other people add to them.

# How we built it
We built the backend in fast api with python. This handles the storage and retrieval of all stories. It also keeps track of all the existing stories and their states(whether a user is currently editing it) in a lightweight nosql database(tinydb).

# Challenges we ran into
We had trouble integrating react with the backend. React functioal components can't be run as asynchronous functions, so we had to find a way around it by defining additional functios inside the components with useEffect hooks. Furthermore, we also ran into issues displaying our stories in a grid mode since css isn't always intuitive. We opted to use the bootstrap grid system to get around this instead.

# What we learned
No one in our team had much prior knowledge of react or fastapi in python. Over the course of this project, we became much more familiar with both technologies which will be useful for many future projects. In addition, we also learned how to deploy a react project to netlify and host the backend on a linux server.

# What's next for Story Maker
We could potentially add AI to generate titles or startes for our stories. In addition, we could find a way of generating thumbnails for the stories dynamically as they evolve using an image generation model. However, we would need to find ways of optimizing the code so that the AI workload does not significantly increase load times of the page.
