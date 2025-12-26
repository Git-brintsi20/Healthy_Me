import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai/gemini";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(request: NextRequest) {
  try {
    const { foodName, servingSize, userId, conversationHistory = [] } = await request.json();

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
      Serving size: ${servingSize || "100g"}
      
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

    // Clean response (remove markdown code blocks if present)
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      const nutritionData = JSON.parse(cleanedText);
      
      // Save to conversation history
      if (userId) {
        try {
          const db = adminDb();
          await db.collection(`users/${userId}/conversations`).add({
            role: 'user',
            content: `Analyze: ${foodName} (${servingSize || '100g'})`,
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
      console.error("Failed to parse AI response:", cleanedText);
      return NextResponse.json(
        { error: "Failed to parse nutrition data" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Nutrition analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze nutrition" },
      { status: 500 }
    );
  }
}
