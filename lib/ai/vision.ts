import vision from "@google-cloud/vision";

let visionClient: vision.ImageAnnotatorClient | null = null;

/**
 * Returns a singleton Google Cloud Vision ImageAnnotatorClient.
 *
 * This prefers a key file path from GOOGLE_CLOUD_KEY_PATH if provided,
 * otherwise it falls back to Application Default Credentials.
 */
export function getVisionClient() {
  if (!visionClient) {
    const keyFile = process.env.GOOGLE_CLOUD_KEY_PATH;

    visionClient = keyFile
      ? new vision.ImageAnnotatorClient({ keyFilename: keyFile })
      : new vision.ImageAnnotatorClient();
  }

  return visionClient;
}

export default getVisionClient;


