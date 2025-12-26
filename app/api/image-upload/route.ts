import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai/gemini";

// Extend timeout for image processing
export const maxDuration = 30;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log("=== IMAGE UPLOAD DEBUG START ===");
  console.log("Has GEMINI_API_KEY:", !!process.env.GEMINI_API_KEY);
  console.log("Key length:", process.env.GEMINI_API_KEY?.length);
  console.log("Key preview:", process.env.GEMINI_API_KEY?.substring(0, 20) + "...");
  
  try {
    const { image } = await request.json(); // base64 image

    if (!image) {
      console.error("No image provided in request");
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    console.log("Image data received, length:", image.length);
    const base64 = image.split(",")[1] || image;
    console.log("Base64 extracted, length:", base64.length);

    console.log("Initializing Gemini model...");
      const model = getGeminiModel("gemini-pro-vision");
      console.log("Model initialized successfully (using gemini-pro-vision)");
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

    console.log("Sending to Gemini vision...");
    const result = await model.generateContent([prompt, imagePart]);
    console.log("Gemini response received");
    
    const response = await result.response;
    const text = response.text();
    console.log("Raw Gemini response:", text.substring(0, 200));

    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();
    console.log("Cleaned response:", cleanedText.substring(0, 200));

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
    
    // Check for quota errors
    const errorMessage = error instanceof Error ? error.message : '';
    if (errorMessage.includes('quota') || errorMessage.includes('429')) {
      return NextResponse.json(
        { 
          error: "🎓 Student Account Quota Exceeded",
          message: "Image analysis requires Google AI credits. The free tier quota has been used. Please use the text-based nutrition analysis feature instead - it works perfectly!",
          suggestion: "Type your food items manually in the nutrition analysis tab"
        },
        { status: 429 }
      );
    }
    
    return NextResponse.json(
      { 
        error: "Image analysis temporarily unavailable",
        message: "Please use text-based nutrition analysis instead",
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
