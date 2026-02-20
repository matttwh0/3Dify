import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { connectAuthEmulator } from "firebase/auth";
import { firebaseApp } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { sendEmailVerification } from "firebase/auth";
import { signOut } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";




const auth = getAuth(firebaseApp); // get Firebase Auth instance


// connectAuthEmulator(auth, "http://localhost:9099");


function SignUpPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(""); //error message to display
  const [loading, setLoading] = useState(false); //loading state

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    let user = null;
    setLoading(true); // start loading

    try {
      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      user = userCredential.user;

      // 2️⃣ Add user to Firestore
      await setDoc(doc(db, "users", user.uid), {
        displayName: name.trim() || "",
        email: user.email,
        createdAt: serverTimestamp(),
      });

      // 3️⃣ Send email verification
      await sendEmailVerification(user);
      navigate("/");
    } catch (error) {
      console.error("Error signing up:", error.message);

      let message = "";
      switch (error.code) {
        case "auth/email-already-in-use":
          message = "This email is already registered. Please log in instead.";
          break;
        case "auth/invalid-email":
          message = "The email address is not valid.";
          break;
        case "auth/weak-password":
          message = "Password is too weak. Please use at least 6 characters.";
          break;
        default:
          message = "Unable to create user. Please try again.";
      }

      setError(message);

      // Rollback Auth user if Firestore write failed
      if (user) {
        try {
          await deleteUser(user);
        } catch (deleteError) {
          console.error("Failed to delete user after Firestore error:", deleteError);
        }
      }
    } finally {
      setLoading(false); // stop loading
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm border border-gray-700 p-8 rounded-lg">
        <h1 className="text-3xl font-mono mb-6">Create an account</h1>

        <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-black border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-white"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-black border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-white"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-black border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-white"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-black border border-gray-700 text-white px-4 py-2 rounded focus:outline-none focus:border-white"
          />

          
          <button
            type="submit"
            disabled={loading}
            className={`border border-white py-2 rounded font-mono transition
              ${loading ? "bg-gray-700 cursor-not-allowed" : "hover:bg-white hover:text-black"}`}
          >
            {loading ? "Signing up..." : "Sign Up →"}
          </button>

         
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center font-mono">{error}</p>
          )}
        </form>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account? <a href="/login" className="underline">Log in</a>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;