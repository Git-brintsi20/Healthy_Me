const fs = require("node:fs");
const path = require("node:path");
const admin = require("firebase-admin");

function loadEnvFromFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing env file at ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function initAdmin() {
  if (admin.apps.length > 0) return;

  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

function dateDaysAgo(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return admin.firestore.Timestamp.fromDate(d);
}

async function getOrCreateUserByEmail(auth, email) {
  try {
    return await auth.getUserByEmail(email);
  } catch (error) {
    if (error && error.code === "auth/user-not-found") {
      return auth.createUser({
        email,
        emailVerified: true,
        displayName: "Harshita Demo",
        password: "Demo@123456",
      });
    }
    throw error;
  }
}

async function seed() {
  const root = process.cwd();
  loadEnvFromFile(path.join(root, ".env.local"));
  initAdmin();

  const auth = admin.auth();
  const db = admin.firestore();

  const email = process.argv[2] || "harshitabhanusalugu@gmail.com";
  const userRecord = await getOrCreateUserByEmail(auth, email);
  const uid = userRecord.uid;

  const favorites = [
    { id: "demo-fav-oats", name: "Oatmeal with Banana", calories: 320, addedAt: dateDaysAgo(1) },
    { id: "demo-fav-salmon", name: "Grilled Salmon", calories: 412, addedAt: dateDaysAgo(2) },
    { id: "demo-fav-yogurt", name: "Greek Yogurt Bowl", calories: 190, addedAt: dateDaysAgo(3) },
    { id: "demo-fav-avocado", name: "Avocado Toast", calories: 280, addedAt: dateDaysAgo(4) },
    { id: "demo-fav-chicken", name: "Chicken Caesar Salad", calories: 365, addedAt: dateDaysAgo(5) },
  ];

  const searchHistory = [
    { id: "demo-search-1", foodName: "Grilled Chicken Breast", searchedAt: dateDaysAgo(0), source: "manual_search" },
    { id: "demo-search-2", foodName: "Avocado Toast", searchedAt: dateDaysAgo(1), source: "manual_search" },
    { id: "demo-search-3", foodName: "Brown Rice Bowl", searchedAt: dateDaysAgo(2), source: "manual_search" },
    { id: "demo-search-4", foodName: "Greek Yogurt", searchedAt: dateDaysAgo(3), source: "manual_search" },
    { id: "demo-search-5", foodName: "Paneer Tikka", searchedAt: dateDaysAgo(4), source: "manual_search" },
    { id: "demo-search-6", foodName: "Oatmeal", searchedAt: dateDaysAgo(5), source: "manual_search" },
    { id: "demo-search-7", foodName: "Veggie Wrap", searchedAt: dateDaysAgo(6), source: "manual_search" },
    { id: "demo-search-8", foodName: "Fruit Smoothie", searchedAt: dateDaysAgo(7), source: "manual_search" },
  ];

  const conversations = [
    { id: "demo-conv-1", role: "user", content: "Analyze: Grilled Chicken Breast (100g)", timestamp: dateDaysAgo(0) },
    { id: "demo-conv-2", role: "assistant", content: "Calories: 165, Protein: 31g, Carbs: 0g, Fats: 3.6g", timestamp: dateDaysAgo(0) },
    { id: "demo-conv-3", role: "user", content: "Analyze: Avocado Toast (1 slice)", timestamp: dateDaysAgo(1) },
    { id: "demo-conv-4", role: "assistant", content: "Calories: 280, Protein: 8g, Carbs: 28g, Fats: 15g", timestamp: dateDaysAgo(1) },
  ];

  const myths = [
    {
      id: `demo-myth-${uid}-1`,
      question: "Do carbs make you fat?",
      verdict: "PARTIALLY_TRUE",
      explanation: "Excess total calorie intake drives fat gain. Carbs can fit into a healthy diet when portioned appropriately.",
      keyPoints: [
        "Calorie surplus is the main factor in weight gain",
        "Carb quality matters: whole grains outperform refined carbs",
        "Activity level changes carb needs",
      ],
      sources: [
        { title: "Dietary Carbohydrates and Body Weight", url: "https://pubmed.ncbi.nlm.nih.gov/" },
      ],
      recommendation: "Prefer high-fiber carb sources and balance with protein.",
      askedBy: uid,
      askedByEmail: email,
      askedAt: dateDaysAgo(1),
      upvotes: 7,
      downvotes: 1,
      views: 42,
    },
    {
      id: `demo-myth-${uid}-2`,
      question: "Is breakfast the most important meal of the day?",
      verdict: "INCONCLUSIVE",
      explanation: "Breakfast can help some people with appetite control, but not everyone needs it for good health.",
      keyPoints: [
        "Meal timing effects vary by individual",
        "Total daily nutrition quality is more important",
      ],
      sources: [
        { title: "Breakfast and Weight Management", url: "https://pubmed.ncbi.nlm.nih.gov/" },
      ],
      recommendation: "Choose a pattern you can sustain while meeting nutrient targets.",
      askedBy: uid,
      askedByEmail: email,
      askedAt: dateDaysAgo(3),
      upvotes: 4,
      downvotes: 0,
      views: 25,
    },
    {
      id: `demo-myth-${uid}-3`,
      question: "Does eating late at night always cause weight gain?",
      verdict: "FALSE",
      explanation: "Timing alone does not cause weight gain; total intake and behavior patterns matter more.",
      keyPoints: [
        "Energy balance remains the core determinant",
        "Late-night snacking can still raise intake indirectly",
      ],
      sources: [
        { title: "Meal Timing and Weight Outcomes", url: "https://pubmed.ncbi.nlm.nih.gov/" },
      ],
      recommendation: "Focus on consistent portions and food quality across the day.",
      askedBy: uid,
      askedByEmail: email,
      askedAt: dateDaysAgo(5),
      upvotes: 5,
      downvotes: 2,
      views: 31,
    },
  ];

  const userRef = db.collection("users").doc(uid);
  const batch = db.batch();

  batch.set(
    userRef,
    {
      email,
      displayName: userRecord.displayName || "Harshita Demo",
      role: "user",
      totalSearches: searchHistory.length,
      mythsDebunked: myths.length,
      dailyGoal: { calories: 2200, current: 1460 },
      nutritionGoals: { calories: 2200, protein: 130, carbs: 240 },
      preferences: { emailNotifications: true, darkMode: false },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  for (const favorite of favorites) {
    batch.set(userRef.collection("favorites").doc(favorite.id), favorite, { merge: true });
  }

  for (const historyItem of searchHistory) {
    batch.set(userRef.collection("nutrition_history").doc(historyItem.id), historyItem, { merge: true });
  }

  for (const conv of conversations) {
    batch.set(userRef.collection("conversations").doc(conv.id), conv, { merge: true });
  }

  for (const myth of myths) {
    batch.set(db.collection("myths").doc(myth.id), myth, { merge: true });
  }

  await batch.commit();

  console.log("Seed complete");
  console.log(`email: ${email}`);
  console.log(`uid: ${uid}`);
  console.log(`favorites: ${favorites.length}`);
  console.log(`nutrition_history: ${searchHistory.length}`);
  console.log(`conversations: ${conversations.length}`);
  console.log(`myths: ${myths.length}`);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
