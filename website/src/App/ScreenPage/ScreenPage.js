import styled from "styled-components";
import React from "react";

export const ScreenPage = () => {
  return (
    <Screen>
      <p>Screen page</p>
    </Screen>
  );
};

const Screen = styled.div`
  background-color: #808080;
  height: 30vh;
  display: flex;
`;