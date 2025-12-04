import React, { useState } from "react";

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setVideoURL(URL.createObjectURL(selected));
  };

  // DEMO VERSION: Only trigger KIRI API (NO file upload)
  const handleUpload = async () => {
    console.log("🔥 DEMO MODE: Calling KIRI API...");

    try {
      const res = await fetch("http://127.0.0.1:5000/kirk_api", {
        method: "POST",
      });

      if (!res.ok) {
        console.error("❌ Backend call failed");
        return;
      }

      console.log("✅ KIRI API successfully triggered");
      alert("Model generation started! Check backend terminal.");

    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="rounded-xl border border-gray-600 bg-black p-4 shadow-sm text-white w-full">

      {/* Choose File */}
      <label htmlFor="videoInput" className="font-mono text-sm cursor-pointer underline text-gray-400">
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

      {/* Upload Button = TRIGGERS CURL EQUIVALENT */}
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
    </div>
  );
}
