import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./config";

export async function uploadImage(file: File, path: string) {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}

export { ref, uploadBytes, getDownloadURL, storage };


