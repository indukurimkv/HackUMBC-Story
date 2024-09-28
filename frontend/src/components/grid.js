import * as React from 'react';
import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid2';


function StoryCard(){
    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        ...theme.applyStyles('dark', {
          backgroundColor: '#1A2027',
        }),
      }));
    return(
        <Item></Item>
    );
    
}

async function getNumStories(){
    const numStories = await fetch("http://localhost:8000/story/get_num", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(response => response.json()).then(responseData => (responseData))

    return numStories.num_stories;

}

export default async function storyGrid(){
    console.log(await getNumStories())
    
    // return (
        // <Box sx={{ flexGrow: 1 }}>
        //     <Grid container spacing={{ xs: 2, md: 10 }} columns={{ xs: 4, sm: 8, md: 12 }} >
        //         {Array.from(Array(6)).map((_, index) => (
        //         <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
                    
        //             <StoryCard />
        //         </Grid>
        //         ))}
        //     </Grid>
        // </Box>
    // );

    const renderedOutput = Array 
}