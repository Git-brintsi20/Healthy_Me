import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai/gemini";
import { adminDb } from "@/lib/firebase/admin";

function fallbackNutrition(foodName: string, servingSize: string) {
  const normalized = foodName.toLowerCase();

  if (normalized.includes("banana")) {
    return {
      name: "Banana",
      servingSize,
      calories: 89,
      macros: { protein: 1.1, carbs: 22.8, fats: 0.3, fiber: 2.6 },
      vitamins: [
        { name: "Vitamin C", amount: "8.7 mg", dailyValue: 10 },
        { name: "Vitamin B6", amount: "0.36 mg", dailyValue: 22 },
      ],
      minerals: [
        { name: "Potassium", amount: "358 mg", dailyValue: 8 },
        { name: "Magnesium", amount: "27 mg", dailyValue: 6 },
      ],
    };
  }

  if (normalized.includes("chicken")) {
    return {
      name: "Grilled Chicken Breast",
      servingSize,
      calories: 165,
      macros: { protein: 31, carbs: 0, fats: 3.6, fiber: 0 },
      vitamins: [
        { name: "Vitamin B3", amount: "13.7 mg", dailyValue: 86 },
        { name: "Vitamin B6", amount: "0.6 mg", dailyValue: 35 },
      ],
      minerals: [
        { name: "Phosphorus", amount: "220 mg", dailyValue: 18 },
        { name: "Selenium", amount: "27 mcg", dailyValue: 49 },
      ],
    };
  }

  if (normalized.includes("oat")) {
    return {
      name: "Oatmeal",
      servingSize,
      calories: 155,
      macros: { protein: 5.4, carbs: 27, fats: 3.2, fiber: 4 },
      vitamins: [
        { name: "Vitamin B1", amount: "0.17 mg", dailyValue: 14 },
        { name: "Folate", amount: "14 mcg", dailyValue: 4 },
      ],
      minerals: [
        { name: "Manganese", amount: "1.4 mg", dailyValue: 61 },
        { name: "Iron", amount: "1.7 mg", dailyValue: 9 },
      ],
    };
  }

  return {
    name: foodName,
    servingSize,
    calories: 220,
    macros: { protein: 10, carbs: 24, fats: 9, fiber: 3 },
    vitamins: [
      { name: "Vitamin C", amount: "6 mg", dailyValue: 7 },
      { name: "Vitamin B6", amount: "0.2 mg", dailyValue: 12 },
    ],
    minerals: [
      { name: "Iron", amount: "1.8 mg", dailyValue: 10 },
      { name: "Potassium", amount: "260 mg", dailyValue: 6 },
    ],
  };
}

function parseNutritionJson(rawText: string) {
  const cleanedText = rawText.replace(/```json\n?|\n?```/g, "").trim();

  try {
    return JSON.parse(cleanedText);
  } catch {
    const start = cleanedText.indexOf("{");
    const end = cleanedText.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const candidate = cleanedText.slice(start, end + 1);
      return JSON.parse(candidate);
    }
    throw new Error("Model response was not valid JSON");
  }
}

export async function POST(request: NextRequest) {
  let foodName = "";
  let servingSize = "100g";
  let userId: string | undefined;
  let conversationHistory: any[] = [];

  try {
    const payload = await request.json();
    foodName = payload.foodName;
    servingSize = payload.servingSize || "100g";
    userId = payload.userId;
    conversationHistory = payload.conversationHistory || [];

    if (!foodName) {
      return NextResponse.json(
        { error: "Food name is required" },
        { status: 400 }
      );
    }

    const model = getGeminiModel();

    // Build conversation context
    let contextPrompt = "";
    if (conversationHistory.length > 0) {
      contextPrompt = "\nPrevious conversation:\n" + 
        conversationHistory.slice(-5).map((msg: any) => 
          `${msg.role}: ${msg.content}`
        ).join("\n") + "\n\n";
    }

    const prompt = `${contextPrompt}
      Provide detailed nutritional information for: ${foodName}
      Serving size: ${servingSize}
      
      Return ONLY a valid JSON object with this exact structure (no markdown formatting):
      {
        "name": "food name",
        "servingSize": "serving size",
        "calories": number,
        "macros": {
          "protein": number (in grams),
          "carbs": number (in grams),
          "fats": number (in grams),
          "fiber": number (in grams)
        },
        "vitamins": [
          {"name": "Vitamin A", "amount": "500 IU", "dailyValue": 10},
          {"name": "Vitamin C", "amount": "0 mg", "dailyValue": 0}
        ],
        "minerals": [
          {"name": "Iron", "amount": "2mg", "dailyValue": 11},
          {"name": "Calcium", "amount": "15mg", "dailyValue": 1}
        ]
      }
      
      Be accurate and use USDA food database values when possible.
      Return ONLY the JSON object, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const nutritionData = parseNutritionJson(text);
      
      // Save to conversation history
      if (userId) {
        try {
          const db = adminDb();
          await db.collection(`users/${userId}/conversations`).add({
            role: 'user',
            content: `Analyze: ${foodName} (${servingSize})`,
            timestamp: new Date()
          });
          await db.collection(`users/${userId}/conversations`).add({
            role: 'assistant',
            content: JSON.stringify(nutritionData),
            timestamp: new Date()
          });
        } catch (dbError) {
          console.error("Failed to save conversation:", dbError);
        }
      }
      
      return NextResponse.json(nutritionData);
    } catch (parseError) {
      console.error("Failed to parse AI response:", text);
      return NextResponse.json(
        { error: "Failed to parse nutrition data from AI response" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Nutrition analysis error:", error);
    const message = error instanceof Error ? error.message : "Failed to analyze nutrition";

    const isQuotaOrKeyIssue =
      message.includes("429") ||
      message.toLowerCase().includes("quota") ||
      message.includes("GEMINI_API_KEY");

    if (foodName && isQuotaOrKeyIssue) {
      return NextResponse.json(fallbackNutrition(foodName, servingSize));
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
