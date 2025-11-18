import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'; 
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/LandingPage" element={<LandingPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />

      </Routes>
    </Router>
  );
}


