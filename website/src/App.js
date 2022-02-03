import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "./App/HomePage";

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
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/a" element={<AboutPage />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
