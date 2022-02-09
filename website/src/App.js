import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./App/HomePage";
import { ScreenPage } from "./App/ScreenPage/ScreenPage";
import { StartPage } from "./App/StartPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/start" element={<StartPage />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/a" element={<ScreenPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
