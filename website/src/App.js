import './App.css';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import OuterBlueBox from './OuterBlueBox';

const HomePage = () =>{
  return (
    <div className="App">
    <h1>Hello World!</h1>
    <OuterBlueBox />
    </div>

  );
}


const AboutPage = () =>{
  return (
    <div className="App">
      <h1>This is the about page</h1>
    </div>
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
