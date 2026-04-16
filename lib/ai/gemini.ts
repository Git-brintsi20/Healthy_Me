import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const getGeminiModel = (modelName?: string) => {
  if (!genAI) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }
  const model = modelName || process.env.GEMINI_MODEL || "gemini-2.0-flash";
  return genAI.getGenerativeModel({ model });
};

export default genAI;
