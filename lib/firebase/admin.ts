import admin from "firebase-admin";

const initializeAdmin = () => {
  if (admin.apps.length === 0) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  }

  return admin;
};

export const adminAuth = () => initializeAdmin().auth();
export const adminDb = () => initializeAdmin().firestore();
export const adminStorage = () => initializeAdmin().storage();

export default initializeAdmin;
