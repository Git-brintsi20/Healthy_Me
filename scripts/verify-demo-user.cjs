const fs = require("node:fs");
const path = require("node:path");
const admin = require("firebase-admin");

function loadEnv(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

async function main() {
  const root = process.cwd();
  loadEnv(path.join(root, ".env.local"));

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      }),
    });
  }

  const email = process.argv[2] || "harshitabhanusalugu@gmail.com";
  const auth = admin.auth();
  const db = admin.firestore();

  const user = await auth.getUserByEmail(email);
  const uid = user.uid;

  const userDocSnap = await db.collection("users").doc(uid).get();
  const userDoc = userDocSnap.exists ? userDocSnap.data() : null;

  const favoritesSnap = await db.collection("users").doc(uid).collection("favorites").get();
  const historySnap = await db.collection("users").doc(uid).collection("nutrition_history").get();
  const convSnap = await db.collection("users").doc(uid).collection("conversations").get();
  const mythsSnap = await db.collection("myths").where("askedBy", "==", uid).get();

  console.log(
    JSON.stringify(
      {
        email,
        uid,
        userDocExists: userDocSnap.exists,
        dashboard: {
          totalSearches: userDoc?.totalSearches ?? null,
          mythsDebunked: userDoc?.mythsDebunked ?? null,
          dailyGoal: userDoc?.dailyGoal ?? null,
        },
        pages: {
          favorites: favoritesSnap.size,
          history_nutrition: historySnap.size,
          nutrition_conversations: convSnap.size,
          history_myths: mythsSnap.size,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
