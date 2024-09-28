import { experimentalStyled as styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import storyGrid from './grid';

    function createCard(){
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