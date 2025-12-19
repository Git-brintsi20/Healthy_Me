import { useState } from "react";
import { ImageAnalysisData } from "@/types";

export function useImageUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ImageAnalysisData | null>(null);

  const analyzeImage = async (imageBase64: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze image");
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeImage, loading, error, data };
}
