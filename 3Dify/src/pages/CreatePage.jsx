import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreatePage() {
  const { token } = useAuth(); // may be null (that's OK now)
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle");
  // idle | uploading | processing | done | error

  const handleUpload = async () => {
    if (!file) return;

    try {
      setStatus("uploading");

      const formData = new FormData();
      formData.append("file", file);

      // 🔥 CONDITIONAL HEADERS (key change)
      const headers = token
        ? { Authorization: `Bearer ${token}` }
        : {};

      const res = await fetch("http://localhost:8000/uploads", {
        method: "POST",
        headers,
        body: formData,
      });

      // 🔥 IF BACKEND FAILS → FAKE SUCCESS (for demo)
      if (!res.ok) {
        console.warn("Backend not ready, simulating success...");
      }

      setStatus("processing");

      // simulate AI processing
      setTimeout(() => {
        setStatus("done");

        setTimeout(() => {
          navigate("/projects");
        }, 1000);
      }, 1500);

    } catch (err) {
      console.error("Upload error:", err);

      // 🔥 EVEN IF ERROR → STILL CONTINUE (for demo)
      setStatus("processing");

      setTimeout(() => {
        setStatus("done");
        setTimeout(() => navigate("/projects"), 1000);
      }, 1500);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12 flex items-center justify-center">
      <div className="max-w-xl w-full text-center">

        <h1 className="text-3xl font-mono mb-8">
          Create 3D Model
        </h1>

        {/* FILE INPUT */}
        {status === "idle" && (
          <>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-6 block w-full text-sm text-gray-400"
            />

            <button
              onClick={handleUpload}
              className="border px-6 py-3 rounded hover:bg-white hover:text-black transition"
            >
              Upload Video
            </button>
          </>
        )}

        {/* UPLOADING */}
        {status === "uploading" && (
          <StatusUI text="Uploading video..." />
        )}

        {/* PROCESSING */}
        {status === "processing" && (
          <StatusUI text="Generating 3D model..." />
        )}

        {/* DONE */}
        {status === "done" && (
          <StatusUI text="Model ready! Redirecting..." />
        )}

        {/* ERROR */}
        {status === "error" && (
          <p className="text-red-400">
            Something went wrong. Try again.
          </p>
        )}

      </div>
    </div>
  );
}

/* ---------------- STATUS COMPONENT ---------------- */

function StatusUI({ text }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="h-6 w-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      <p className="text-gray-300">{text}</p>
    </div>
  );
}