import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai/gemini";

// Extend timeout for image processing
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json(); // base64 image

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const base64 = image.split(",")[1] || image;

    const model = getGeminiModel("gemini-2.0-flash-exp");

    console.log("Using Gemini Vision API for image analysis (no Firebase Storage needed)");

    // Use Gemini's built-in vision directly (primary method - no external storage needed)
    const prompt = `
      Analyze this food image and identify all food items visible.
      Return ONLY a valid JSON object with this structure (no markdown):
      {
        "detectedFoods": ["food1", "food2", "food3"],
        "confidence": "high" or "medium" or "low",
        "description": "Brief description of what you see in the image"
      }
    `;

    const imagePart = {
      inlineData: {
        data: base64,
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      const imageData = JSON.parse(cleanedText);
      const detectedFoods = Array.isArray(imageData.detectedFoods) ? imageData.detectedFoods : [];

      // Enrich with detailed nutrition information
      const enriched = await enrichWithNutrition(model, detectedFoods, imageData);
      return NextResponse.json(enriched);
    } catch (parseError) {
      console.error("Failed to parse Gemini vision response:", cleanedText);
      return NextResponse.json(
        { error: "Failed to parse image analysis data", raw: cleanedText },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Image analysis error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      geminiKeyLength: process.env.GEMINI_API_KEY?.length || 0
    });
    
    return NextResponse.json(
      { 
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : 'Unknown error',
        hint: !process.env.GEMINI_API_KEY ? 'GEMINI_API_KEY not configured' : undefined
      },
      { status: 500 }
    );
  }
}

async function enrichWithNutrition(
  model: ReturnType<typeof getGeminiModel>,
  foods: string[],
  base: any
) {
  if (!foods || foods.length === 0) {
    return base;
  }

  const nutritionPromises = foods.slice(0, 3).map(async (foodName: string) => {
    const nutritionPrompt = `
      Provide nutritional information for: ${foodName} (estimated portion from image)
      Return ONLY valid JSON with: {"name": "...", "calories": number, "protein": number, "carbs": number, "fats": number}
    `;

    const nutritionResult = await model.generateContent(nutritionPrompt);
    const nutritionText = await nutritionResult.response.text();
    const cleanedNutrition = nutritionText.replace(/```json\n?|\n?```/g, "").trim();

    try {
      return JSON.parse(cleanedNutrition);
    } catch {
      return {
        name: foodName,
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
      };
    }
  });

  const nutritionData = await Promise.all(nutritionPromises);
  return {
    ...base,
    detectedFoods: foods,
    nutrition: nutritionData,
  };
}
