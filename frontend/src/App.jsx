import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/HomePage"; // Make sure to import the Home component
import Login from "./Pages/Login/Login";
import Registration from "./Pages/Registration/Registration";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
