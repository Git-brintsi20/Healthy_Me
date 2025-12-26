import { ImageAnnotatorClient } from "@google-cloud/vision";

let visionClient: ImageAnnotatorClient | null = null;

/**
 * Returns a singleton Google Cloud Vision ImageAnnotatorClient.
 *
 * This prefers inline credentials from environment variables,
 * otherwise falls back to Application Default Credentials.
 */
export function getVisionClient() {
  if (!visionClient) {
    // Try to use inline credentials from environment
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.VERTEX_AI_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

    if (projectId && clientEmail && privateKey) {
      // Use inline credentials
      visionClient = new ImageAnnotatorClient({
        credentials: {
          client_email: clientEmail,
          private_key: privateKey,
        },
        projectId: projectId,
      });
    } else {
      // Fallback to Application Default Credentials (won't work on Vercel)
      console.warn("Vision API credentials not fully configured, using defaults (may fail on Vercel)");
      visionClient = new ImageAnnotatorClient();
    }
  }

  return visionClient;
}

export default getVisionClient;


