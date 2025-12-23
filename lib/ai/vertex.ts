import { VertexAI } from "@google-cloud/aiplatform";

if (!process.env.VERTEX_AI_PROJECT_ID || !process.env.VERTEX_AI_LOCATION) {
  console.warn(
    "VERTEX_AI_PROJECT_ID or VERTEX_AI_LOCATION is not defined. Vertex AI client will not be fully functional."
  );
}

const project = process.env.VERTEX_AI_PROJECT_ID || "";
const location = process.env.VERTEX_AI_LOCATION || "us-central1";

const vertexClient = new VertexAI({
  project,
  location,
});

export const getVertexModel = (modelName: string = "gemini-1.5-flash") => {
  return vertexClient.getGenerativeModel({ model: modelName });
};

export default vertexClient;


