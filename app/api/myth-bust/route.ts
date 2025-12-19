import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai/gemini";

export async function POST(request: NextRequest) {
  try {
    const { myth } = await request.json();

    if (!myth) {
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const model = getGeminiModel();

    const prompt = `
      As a nutrition science expert, analyze this claim: "${myth}"
      
      Provide a response in this JSON format (no markdown formatting):
      {
        "verdict": "TRUE" or "FALSE" or "PARTIALLY_TRUE" or "INCONCLUSIVE",
        "explanation": "Detailed 2-3 paragraph explanation with scientific evidence",
        "keyPoints": ["point 1", "point 2", "point 3"],
        "sources": [
          {
            "title": "Study or article title",
            "authors": "Author names or publication",
            "publication": "Journal or institution",
            "year": 2023,
            "url": "https://pubmed.ncbi.nlm.nih.gov/example",
            "summary": "Brief summary of findings"
          }
        ],
        "recommendation": "Practical advice based on evidence"
      }
      
      Base your analysis on peer-reviewed research and scientific consensus.
      Include at least 3 credible sources with real URLs when possible.
      Return ONLY the JSON object, no additional text.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean response (remove markdown code blocks if present)
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      const mythData = JSON.parse(cleanedText);
      return NextResponse.json(mythData);
    } catch (parseError) {
      console.error("Failed to parse AI response:", cleanedText);
      return NextResponse.json(
        { error: "Failed to parse myth-busting data" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Myth-busting error:", error);
    return NextResponse.json(
      { error: "Failed to verify myth" },
      { status: 500 }
    );
  }
}
