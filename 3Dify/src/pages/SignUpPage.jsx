// <!--
//   This example requires updating your template:

//   ```
//   <html className="h-full bg-gray-900">
//   <body className="h-full">
//   ```
// -->
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { connectAuthEmulator } from "firebase/auth";
import { firebaseApp } from "..";
import { createUserWithEmailAndPassword } from "firebase/auth";
const auth = getAuth(firebaseApp); // get Firebase Auth instance
connectAuthEmulator(auth, "http://localhost:9099");


export default function SignUpPage() {
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async (e) => {
    e.preventDefault();
    
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
<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
  <div className="sm:mx-auto sm:w-full sm:max-w-sm">
    <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" className="mx-auto h-10 w-auto" />
    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">Create an account</h2>
  </div>

  <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
    <form onSubmit={handleSignUp} action="#" method="POST" className="space-y-6">
  <div>
    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-100">
      Email address
    </label>
    <div className="mt-2">
      <input
        id="email"
        type="email"
        value={email}
        name="email"
        required
        autoComplete="email"
        onChange={(e) => setEmail(e.target.value)}
        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
      />
    </div>
  </div>

  <div>
    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-100">
      Create a password
    </label>
    <div className="mt-2">
      <input
        id="password"
        type="password"
        value={password}
        name="password"
        required
        autoComplete="current-password"
        onChange={(e) => setPassword(e.target.value)}
        className="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
      />
    </div>
  </div>
  {error && (
  <div className="text-red-500 text-sm text-center">
    {error}
  </div>
)}
  <button
    type="submit"
    className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
  >
    Sign up
  </button>
</form>



  </div>
</div>
  )
}