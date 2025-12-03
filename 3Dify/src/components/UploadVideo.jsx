import React, { useState } from "react";

export default function UploadVideo() {
  const [file, setFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setVideoURL(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    console.log("🔥 DEMO MODE: Calling KIRI API...");

    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      const res = await fetch("http://127.0.0.1:5000/kiri_api", {
        method: "POST",
      });

      console.log("📥 Response object:", res);

      const data = await res.json();
      console.log("🔍 Parsed JSON:", data);

      if (data.downloadUrl) {
        console.log("✅ Setting download URL:", data.downloadUrl);
        setDownloadUrl(data.downloadUrl);
      } else {
        console.log("ℹ No downloadUrl found in backend response.");
      }

    } catch (err) {
      console.error("❌ Error during fetch:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="rounded-xl border border-gray-600 bg-black p-4 shadow-sm text-white w-full">

      {/* File Picker (not used by backend yet, but okay for demo UI) */}
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

      {/* Processing Message */}
      {isProcessing && !downloadUrl && (
        <div className="text-xs text-yellow-400 mt-2">
          Processing model... (this may take a minute)
        </div>
      )}

      {/* Download Button appears AFTER backend completes */}
      {downloadUrl && (
        <button
          onClick={() => window.open(downloadUrl)}
          className="mt-3 px-3 py-1 text-xs bg-green-500 text-black rounded hover:bg-green-600 transition"
        >
          Download 3D Model
        </button>
      )}

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
