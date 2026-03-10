import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

export async function createScan({ name = "Untitled scan" } = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Not signed in");

  const scanRef = doc(collection(db, "scans")); // auto-ID
  const scanId = scanRef.id;

  await setDoc(scanRef, {
    uid: user.uid,
    name,
    status: "created",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    storagePath: `uploads/${user.uid}/${scanId}.mp4`,
    kiriSerialize: null,
    kiriStatusCode: null,
  });

  return scanId;
}