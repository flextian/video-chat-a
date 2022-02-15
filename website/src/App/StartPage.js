import styled from "styled-components";
import React from "react";
import {Box, Typography, Button, TextField, Grid} from "@mui/material";

export const StartPage = () => {
    return (
        <GridContainer>
            <Grid container spacing={8}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'text.primary'
                }}
            >   
                <Grid item>
                    <Typography variant={'h1'}>Video Chat</Typography>
                </Grid>
                <Grid item>
                    <TextField id="standard-basic" label="Name" variant="standard" />
                </Grid>
                <Grid item>
                    <TextField id="standard-basic" label="Room Code" variant="standard" />
                </Grid>
                <Grid item>
                    <Button variant="contained" size="Large" >Join</Button>
                </Grid>
            </Grid>
        </GridContainer>

    );
}

const GridContainer = styled.div`
  background-color: #2d476d;
  height: 100vh;
  display: flex;
  justify-content:center;
  align-items:center;
`;

