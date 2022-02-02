import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

const HomePage = () =>{
  return (
    <div>hello world</div>
  );
}

const AboutPage = () =>{
  return (
    <div>This is the about page!</div>
  );
}

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />}>

      </Route>
      <Route path="/a" element={<AboutPage />}>

</Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
