import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai/gemini";
import { getVisionClient } from "@/lib/ai/vision";

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

    // Step 1: Try to detect food items with Google Cloud Vision API
    let detectedFoods: string[] | null = null;

    try {
      const visionClient = getVisionClient();
      const [result] = await visionClient.labelDetection({
        image: { content: base64 },
      });

      const labels = result.labelAnnotations || [];
      detectedFoods = labels
        .filter((label: any) => (label.score ?? 0) > 0.7)
        .map((label: any) => label.description || "")
        .filter(Boolean)
        .slice(0, 5);
    } catch (visionError) {
      console.warn("Vision API failed or is not configured, falling back to Gemini vision:", visionError);
    }

    // Step 2: If Vision didn't give us anything, fall back to Gemini's built-in vision
    if (!detectedFoods || detectedFoods.length === 0) {
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
        detectedFoods = Array.isArray(imageData.detectedFoods) ? imageData.detectedFoods : [];

        // We keep the rest of the structure from Gemini
        const enriched = await enrichWithNutrition(model, detectedFoods || [], imageData);
        return NextResponse.json(enriched);
      } catch (parseError) {
        console.error("Failed to parse Gemini vision response:", cleanedText);
        return NextResponse.json(
          { error: "Failed to parse image analysis data" },
          { status: 500 }
        );
      }
    }

    // Step 3: Build a Vision-style response object and enrich with Gemini nutrition
    const visionResponse = {
      detectedFoods,
      confidence: detectedFoods && detectedFoods.length > 0 ? "high" : "low",
      description: "Detected food items using Google Cloud Vision API",
    };

    const enriched = await enrichWithNutrition(model, detectedFoods || [], visionResponse);

    return NextResponse.json(enriched);
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
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
