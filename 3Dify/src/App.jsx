import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import SignIn from "/src/pages/SignIn.jsx";
import NewSignUpPage from "./pages/NewSignUpPage";
import ProjectsPage from "./pages/ProjectsPage"; 
import GalleryPage from "./pages/GalleryPage";
import PopularPage from "./pages/PopularPage";
import ProjectDetail from "./pages/ProjectDetail";
import CreatePage from "./pages/CreatePage";



export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/register" element={<NewSignUpPage />} />

        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/gallery/popular" element={<PopularPage />} />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/create" element={<CreatePage />} />


      </Routes>
    </Router>
  );
}
