import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, firebaseApp, storage } from "../firebase";
import { ref, uploadBytesResumable } from "firebase/storage";

export async function createScan({ uid, name = "Untitled scan" } = {}) {
  console.log("createScan received:", uid, name);

  if (!uid) throw new Error("Missing uid");

  const scanRef = doc(collection(db, "scans"));
  const scanId = scanRef.id;

  await setDoc(scanRef, {
    uid,
    name,
    status: "created",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    storagePath: `uploads/${uid}/${scanId}.mp4`,
    kiriSerialize: null,
    kiriStatusCode: null,
  });

  return scanId;
}
export function uploadScanVideo({ file, storagePath, onProgress }) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, storagePath);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snap) => {
        const pct = (snap.bytesTransferred / snap.totalBytes) * 100;
        onProgress?.(pct);
      },
      reject,
      () => resolve()
    );
  });
}