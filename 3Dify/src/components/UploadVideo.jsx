import React, { useState, useEffect, useRef } from "react";
import { createScan,uploadScanVideo } from "../services/scans";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import { doc, updateDoc,serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
export default function UploadVideo() {
  const pollRef = useRef(null);
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [downloadUrl, setDownloadUrl] = useState(null);


  const handleClick = async () => {
  console.log("AuthContext user:", user);

  if (!user?.uid) {
    console.error("No user/uid yet. Signed in?", user);
    return;
  }

  try {
    setLoading(true);

    console.log("currentUser:", user?.uid);

    if (!file) throw new Error("No file selected");

    //Create scan
    const scanId = await createScan({
      uid: user.uid,
      name: file.name || "New scan",
    });

    console.log("Created scanId:", scanId);

    const storagePath = `uploads/${user.uid}/${scanId}.mp4`;

    //Upload video
    await uploadScanVideo({
      file,
      storagePath,
      onProgress: (pct) => {
        console.log("Upload progress:", pct);
      },
    });

    console.log("Upload complete");

    //Update Firestore status
    await updateDoc(doc(db, "scans", scanId), {
      status: "uploaded",
      updatedAt: serverTimestamp(),
    });

    //Tell backend to send Firebase file to KIRI
    const res = await fetch("http://127.0.0.1:5000/kiri_api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        scanId,
        storagePath,
      }),
    });

    const result = await res.json();
    console.log("KIRI result:", result);

    if (!res.ok) {
      throw new Error(result.error || "Failed to start KIRI job");
    }

    setStatus("processing");
    const jobId = result.jobId;

    pollRef.current = setInterval(async () => {
      try {
        const poll = await fetch(`http://127.0.0.1:5000/kiri_progress/${jobId}`);
        const data = await poll.json();
        console.log("Poll response:", data);
        if (data.status === "done") {
          clearInterval(pollRef.current);
          setStatus("done");
          setDownloadUrl(data.downloadUrl);
        } else if (data.status === "error") {
          clearInterval(pollRef.current);
          setStatus("error");
        }
      } catch (err) {
        console.error(err);
        clearInterval(pollRef.current);
        setStatus("error");
      }
    }, 6000);
  } catch (e) {
    console.error(e);
    setStatus("error");
  } finally {
    setLoading(false);
  }
};


  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setVideoURL(URL.createObjectURL(selected));
  };
  
  useEffect(() => () => clearInterval(pollRef.current), []);

  return (
    <div className="rounded-xl border border-gray-600 bg-black p-4 shadow-sm text-white w-full">
      <label htmlFor="videoInput" className="font-mono text-sm cursor-pointer underline text-gray-400">
        Choose video
      </label>

      <input type="file" accept="video/*" id="videoInput" className="sr-only" onChange={handleFileSelect} />

      <div className="text-xs text-gray-400 mt-1">
        {file ? file.name : "No file selected"}
      </div>

      <button
        onClick={handleClick}
        className="mt-3 px-3 py-1 text-xs border border-white rounded hover:bg-white hover:text-black transition"
      >
        Begin Model Creation
      </button>

      {/* Status + Download box */}
      {status !== "idle" && (
        <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 flex items-center justify-between gap-4">
          <div>
            {status === "processing" && (
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full border-2 border-white/20 border-t-white animate-spin shrink-0" />
                <div>
                  <p className="text-xs font-mono text-white">Generating 3D model…</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">This usually takes around 30 minutes.</p>
                </div>
              </div>
            )}
            {status === "done" && (
              <div>
                <p className="text-xs font-mono text-green-400">✓ Model ready</p>
                <p className="text-[10px] text-gray-400 mt-0.5">Your 3D model has been generated.</p>
              </div>
            )}
            {status === "error" && (
              <p className="text-xs text-red-400 font-mono">✕ Something went wrong. Please try again.</p>
            )}
          </div>

          {/* Download button — grayed out until done */}
          {status === "done" && downloadUrl ? (
            <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-4 py-2 rounded-md border border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition shrink-0">
              ↓ Download Model
            </a>
          ) : (
            <button disabled className="text-xs px-4 py-2 rounded-md border border-gray-700 text-gray-600 cursor-not-allowed shrink-0">
              ↓ Download Model
            </button>
          )}
        </div>
      )}

      {/* Video Preview */}
      {videoURL && (
        <video autoPlay loop src={videoURL} controls className="mt-4 w-full rounded-lg border border-gray-700" />
      )}
    </div>
  );
}