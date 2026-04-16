import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/ai/gemini";
import { adminDb } from "@/lib/firebase/admin";

function fallbackMythResponse(myth: string) {
  return {
    verdict: "INCONCLUSIVE",
    explanation:
      "Live AI quota is temporarily unavailable, so this is a fallback analysis. In general, nutrition myths depend on context such as dose, overall diet pattern, and individual health conditions.",
    keyPoints: [
      "Single foods or nutrients rarely explain health outcomes in isolation",
      "Total diet quality and consistency matter more than isolated claims",
      "Use evidence from peer-reviewed sources and licensed professionals",
    ],
    sources: [
      {
        title: "World Health Organization - Healthy diet",
        authors: "WHO",
        publication: "World Health Organization",
        year: 2024,
        url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
        summary: "Overview of evidence-based healthy eating guidance.",
      },
    ],
    recommendation:
      "Treat this as a temporary estimate and retry once Gemini quota is restored.",
    question: myth,
  };
}

export async function POST(request: NextRequest) {
  let myth = "";

  try {
    const payload = await request.json();
    myth = payload.myth;

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

      // Persist myth to Firestore "myths" collection for community browsing
      try {
        const db = adminDb();
        const mythsCollection = db.collection("myths");
        await mythsCollection.add({
          ...mythData,
          question: myth,
          askedBy: "anonymous",
          askedAt: new Date(),
          upvotes: 0,
          downvotes: 0,
          views: 0,
        });
      } catch (persistError) {
        console.warn("Failed to persist myth to Firestore:", persistError);
      }

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
    const message = error instanceof Error ? error.message : "Failed to verify myth";
    const isQuotaOrKeyIssue =
      message.includes("429") ||
      message.toLowerCase().includes("quota") ||
      message.includes("GEMINI_API_KEY");

    if (myth && isQuotaOrKeyIssue) {
      return NextResponse.json(fallbackMythResponse(myth));
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
