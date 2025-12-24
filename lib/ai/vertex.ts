/* eslint-disable @typescript-eslint/no-var-requires */

if (!process.env.VERTEX_AI_PROJECT_ID || !process.env.VERTEX_AI_LOCATION) {
  console.warn(
    "VERTEX_AI_PROJECT_ID or VERTEX_AI_LOCATION is not defined. Vertex AI client will not be fully functional."
  );
}

const project = process.env.VERTEX_AI_PROJECT_ID || "";
const location = process.env.VERTEX_AI_LOCATION || "us-central1";

let vertexClient: any = null;

try {
  const aiplatform = require("@google-cloud/aiplatform");
  const VertexAI = aiplatform.VertexAI || aiplatform.default?.VertexAI;
  if (VertexAI) {
    vertexClient = new VertexAI({
      project,
      location,
    });
  }
} catch (error) {
  console.warn("Failed to initialize Vertex AI client:", error);
}

export const getVertexModel = (modelName: string = "gemini-1.5-flash") => {
  if (!vertexClient) {
    throw new Error("Vertex AI client not initialized");
  }
  return vertexClient.getGenerativeModel({ model: modelName });
};

export default vertexClient;


