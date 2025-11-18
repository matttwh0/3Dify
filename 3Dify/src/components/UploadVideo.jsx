import React, { useState } from "react";

export default function UploadVideo() {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    const fd = new FormData();
    fd.append("file", file);

    fetch("http://127.0.0.1:5000/video_request", {
      method: "POST",
      body: fd,
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  return (
    <label
      htmlFor="File"
      className="block rounded border border-gray-600 bg-black text-white p-4 shadow-sm cursor-pointer"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-sm">Upload your video</span>

        <input
          type="file"
          id="File"
          className="sr-only"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          className="px-3 py-1 text-xs border border-white rounded hover:bg-white hover:text-black transition"
        >
          Upload
        </button>
      </div>
    </label>
  );
}
