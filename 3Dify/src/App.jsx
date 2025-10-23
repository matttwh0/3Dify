import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Message from './Message';
import LandingPage from './LandingPage';
import SignInPage from './SignInPage'
import SignUpPage from './SignUpPage'; 
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

