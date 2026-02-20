import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { connectAuthEmulator } from "firebase/auth";
import { firebaseApp } from "../firebase";
const auth = getAuth(firebaseApp); // get Firebase Auth instance
// connectAuthEmulator(auth, "http://localhost:9099");

export default function SignIn() {
   const [error, setError] = useState("");
      const navigate = useNavigate();
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
  
      const handleLogin = async (e) => {
      e.preventDefault();
      
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Signed in:", userCredential.user);
        navigate("/")
      } catch (error) {
        console.error("Error signing in:", error.message);
        setError("Invalid email or password. Please try again.");
      }
    };
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm border border-gray-700 p-8 rounded-lg">
        
        <h1 className="text-3xl font-mono mb-6">Sign In</h1>

        <form onSubmit={handleLogin} action="#" method="POST" className="flex flex-col space-y-4">
          
          <input
            id = "email"
            type="email"
            placeholder="Email"
            value={email}
            name="email"
            required
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-white"
          />

          <input
            id="password"
            type="password"
            value={password}
            name="password"
            required
            autoComplete="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-white"
          />

          <button
            className="border border-white py-2 rounded hover:bg-white hover:text-black transition font-mono"
            type="submit"
          >
            Sign In →
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Don't have an account?
          <a href="/register" className="underline ml-1">Register</a>
        </p>
      </div>
    </div>
  );
}
