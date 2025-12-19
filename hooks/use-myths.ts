import { useState } from "react";
import { MythData } from "@/types";

export function useMyths() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MythData | null>(null);

  const verifyMyth = async (myth: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/myth-bust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ myth }),
      });

      if (!response.ok) {
        throw new Error("Failed to verify myth");
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

  return { verifyMyth, loading, error, data };
}
