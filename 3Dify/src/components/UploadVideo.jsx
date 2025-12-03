import React, { useState, useEffect } from "react";

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");

  // Progress bar state
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When user picks a video → preview it
  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setVideoURL(URL.createObjectURL(selected));
  };

  // Fake progress animation (visual only)
  useEffect(() => {
    let timer;
    if (loading && progress < 100) {
      timer = setInterval(() => {
        setProgress((prev) => {
          const randomStep = Math.random() * 12 + 5;
          const next = prev + randomStep;
          return next >= 100 ? 100 : next;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [loading, progress]);

  // REAL upload → calls backend /kiri_api
  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a video first.");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Correct backend endpoint
      const res = await fetch("http://127.0.0.1:5000/kiri_api", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.error("Backend returned error status");
        alert("Backend request failed.");
        setLoading(false);
        return;
      }

      console.log("KIRI API triggered successfully!");
      alert("Model generation started… check the backend terminal!");

      // Finish progress bar
      setProgress(100);
    } catch (err) {
      console.error("Error uploading:", err);
      alert("Error calling backend server.");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  return (
    <div className="rounded-xl border border-gray-600 bg-black p-4 shadow-sm text-white w-full">
      
      {/* Choose File */}
      <label
        htmlFor="videoInput"
        className="font-mono text-sm cursor-pointer underline text-gray-400"
      >
        Choose video
      </label>

      <input
        type="file"
        accept="video/*"
        id="videoInput"
        className="sr-only"
        onChange={handleFileSelect}
      />

      <div className="text-xs text-gray-400 mt-1">
        {file ? file.name : "No file selected"}
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="mt-3 px-3 py-1 text-xs border border-white rounded hover:bg-white hover:text-black transition"
      >
        Upload
      </button>

      {/* Video Preview */}
      {videoURL && (
        <video
          src={videoURL}
          controls
          className="mt-4 w-full rounded-lg border border-gray-700"
        />
      )}

      {/* PROGRESS BAR */}
      {loading && (
        <div className="mt-4 w-full">
          <div className="text-xs mb-1 text-gray-300 font-mono">
            Generating model…
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-[10px] text-gray-500 mt-1">
            {Math.floor(progress)}%
          </div>
        </div>
      )}
    </div>
  );
}
