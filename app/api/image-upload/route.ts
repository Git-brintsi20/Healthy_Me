import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json(); // base64 image

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const model = getGeminiModel("gemini-1.5-flash");

    // Use Gemini's vision capabilities to detect food items
    const prompt = `
      Analyze this food image and identify all food items visible.
      Return ONLY a valid JSON object with this structure (no markdown):
      {
        "detectedFoods": ["food1", "food2", "food3"],
        "confidence": "high" or "medium" or "low",
        "description": "Brief description of what you see in the image"
      }
    `;

    // Convert base64 to the format Gemini expects
    const imagePart = {
      inlineData: {
        data: image.split(",")[1] || image, // Remove data:image/png;base64, if present
        mimeType: "image/jpeg",
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean response
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      const imageData = JSON.parse(cleanedText);

      // Get nutrition for each detected food
      if (imageData.detectedFoods && imageData.detectedFoods.length > 0) {
        const nutritionPromises = imageData.detectedFoods.slice(0, 3).map(async (foodName: string) => {
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
        imageData.nutrition = nutritionData;
      }

      return NextResponse.json(imageData);
    } catch (parseError) {
      console.error("Failed to parse AI response:", cleanedText);
      return NextResponse.json(
        { error: "Failed to parse image analysis data" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}
