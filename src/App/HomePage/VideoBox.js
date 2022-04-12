import React from "react";
import styled from "styled-components"

export const VideoBox = () => {
    return (
        <VideoBoxRootContainer>
            <MainVideoBox>Main Host Goes here</MainVideoBox>
        </VideoBoxRootContainer>
    );
};

/**
 * Root Container used to store main video screen and the
 * sub video screens
 */
const VideoBoxRootContainer = styled.div`
  background-color: whitesmoke;
  margin: 1.5% 0 0 1%;
  width: 100%;
  height: 96%;
`
/**
 * Child container used to store the Main video screen
 */
const MainVideoBox = styled.div`
    display: flex;
    background-color: #FF69B4;
    padding: 1%;
    padding: 5rem;
`;
