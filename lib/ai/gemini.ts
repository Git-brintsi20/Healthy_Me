import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiModel = (modelName: string = "gemini-1.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};

export default genAI;
