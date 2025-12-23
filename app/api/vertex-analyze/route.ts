import { NextRequest, NextResponse } from "next/server";
import { getVertexModel } from "@/lib/ai/vertex";

export async function POST(request: NextRequest) {
  try {
    const { foodName, servingSize } = await request.json();

    if (!foodName) {
      return NextResponse.json(
        { error: "Food name is required" },
        { status: 400 }
      );
    }

    const model = getVertexModel();

    const prompt = `
      Provide detailed nutritional information for: ${foodName}
      Serving size: ${servingSize || "100g"}
      
      Return ONLY a valid JSON object with this exact structure (no markdown formatting):
      {
        "name": "food name",
        "servingSize": "serving size",
        "calories": number,
        "macros": {
          "protein": number,
          "carbs": number,
          "fats": number,
          "fiber": number
        }
      }
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const text = result.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    const data = JSON.parse(cleanedText);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Vertex AI nutrition analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze nutrition with Vertex AI" },
      { status: 500 }
    );
  }
}


