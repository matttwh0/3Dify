import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { connectAuthEmulator } from "firebase/auth";
import { firebaseApp } from "..";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";

const auth = getAuth(firebaseApp); // get Firebase Auth instance


connectAuthEmulator(auth, "http://localhost:9099");

export default function SignIn() {
      const [error, setError] = useState("");
      const navigate = useNavigate();
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const [confirmPassword, setConfirmPassword] = useState("");

   
      const handleSignUp = async (e) => {
      e.preventDefault();
      if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
  }
       
      try {
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       const user = userCredential.user;
   
       await sendEmailVerification(user);
       console.log("Verification email sent to:", user.email);
       alert("Check your inbox for a verification email!");
     } catch (error) {
       console.error("Error signing up:", error.message);
       setError("Unable to create user")
     }
     };
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm border border-gray-700 p-8 rounded-lg">
        
        <h1 className="text-3xl font-mono mb-6">Create an account</h1>

        <form onSubmit={handleSignUp} action="#" method="POST" className="flex flex-col space-y-4">
          
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
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            name="confirmPassword"
            required
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-black border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-white"
          />


          <button
            className="border border-white py-2 rounded hover:bg-white hover:text-black transition font-mono"
            type="submit"
          >
            Sign Up →
          </button>
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          
        </p>
      </div>
    </div>
  );
}
