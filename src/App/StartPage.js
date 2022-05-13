import styled from "styled-components";
import React, { useEffect, useState} from "react";
import {Box, Typography, Button, TextField, Grid} from "@mui/material";

export const StartPage = () => {

    const [nameVal, setNameVal] = useState("");

    const [roomVal, setRoomVal] = useState("");

    const onNameChange = (event) => {
        setNameVal(event.target.value);
    };

    const onRoomChange = (event) => {
        setRoomVal(event.target.value);
    };

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
                    <Typography variant={'h1'}>GT Video Chat</Typography>
                </Grid>
                <Grid item>
                    <TextField id="standard-basic" label="Name" variant="standard" onChange={onNameChange}/>
                </Grid>
                <Grid item>
                    <TextField id="standard-basic" label="Room Code" variant="standard" onChange={onRoomChange}/>
                </Grid>
                <Grid item>
                    <Button variant="contained" size="large" href={"video?name=" + nameVal + "&room=" + roomVal}>Join</Button>
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

