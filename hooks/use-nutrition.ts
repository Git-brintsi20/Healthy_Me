import { useState, useEffect } from "react";
import { NutritionData } from "@/types";
import { useAuth } from "./use-auth";
import { db } from "@/lib/firebase/config";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";

export function useNutrition() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<NutritionData | null>(null);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const { user } = useAuth();

  // Load conversation history
  useEffect(() => {
    const loadHistory = async () => {
      if (!user?.uid) return;
      
      try {
        const historyRef = collection(db, `users/${user.uid}/conversations`);
        const q = query(historyRef, orderBy("timestamp", "desc"), limit(10));
        const snapshot = await getDocs(q);
        const history = snapshot.docs.map(doc => doc.data()).reverse();
        setConversationHistory(history);
      } catch (err) {
        console.error("Failed to load conversation history:", err);
      }
    };
    
    loadHistory();
  }, [user?.uid]);

  const analyzeFood = async (foodName: string, servingSize: string = "100g") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          foodName, 
          servingSize,
          userId: user?.uid,
          conversationHistory 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze food");
      }

      const result = await response.json();
      setData(result);
      
      // Update conversation history
      if (user?.uid) {
        setConversationHistory(prev => [
          ...prev,
          { role: 'user', content: `Analyze: ${foodName} (${servingSize})` },
          { role: 'assistant', content: JSON.stringify(result) }
        ]);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeFood, loading, error, data };
}
