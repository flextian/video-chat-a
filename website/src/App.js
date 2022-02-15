import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./App/HomePage";
import { ScreenPage } from "./App/ScreenPage/ScreenPage";
import { StartPage } from "./App/StartPage";
import { createTheme, ThemeProvider } from "@mui/material";

const mainTheme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});
function App() {
  return (
    <ThemeProvider theme={mainTheme}>
      <BrowserRouter>
        <Routes>
          <Route path="/start" element={<StartPage />}></Route>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/screenPage" element={<ScreenPage />}></Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
