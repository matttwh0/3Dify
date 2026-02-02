import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignIn from "/src/pages/SignIn.jsx";
import NewSignUpPage from "./pages/NewSignUpPage";
import ProjectsPage from "./pages/ProjectsPage"; // ✅ NEW

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<NewSignUpPage />} />

        {/* ✅ NEW ROUTE – nothing else changed */}
        <Route path="/projects" element={<ProjectsPage />} />

      </Routes>
    </Router>
  );
}
