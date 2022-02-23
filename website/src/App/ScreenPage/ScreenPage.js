import styled from "styled-components";
import React from "react";

export const ScreenPage = () => {
  return (
    <FullHeightBlueBox>
      <h1>Screen page</h1>
    </FullHeightBlueBox>
  );
};

const FullHeightBlueBox = styled.div`
  background-color: #2d476d;
  height: 100vh;
  display: flex;
`;