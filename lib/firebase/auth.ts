import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";
import { auth } from "./config";

export async function loginWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
}

export async function registerWithEmail(email: string, password: string, displayName?: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password);

  if (displayName && result.user) {
    await updateProfile(result.user, { displayName });
  }

  return result.user;
}

export async function loginWithGooglePopup() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function logoutUser() {
  await signOut(auth);
}

export async function sendPasswordReset(email: string) {
  await sendPasswordResetEmail(auth, email);
}

export async function createSessionCookie(user: User) {
  const idToken = await user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
}


