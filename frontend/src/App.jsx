import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Redirect or default route if needed */}
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
