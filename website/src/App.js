import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./App/HomePage";
import { StartPage } from "./App/StartPage";

const AboutPage = () => {
  return (
    <div>
      <h1>This is the about page</h1>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/start" element={<StartPage />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/a" element={<AboutPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
