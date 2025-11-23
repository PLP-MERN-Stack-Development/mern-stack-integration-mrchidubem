import { useState, useCallback } from "react";

export default function useApi() {
  const base = import.meta.env.VITE_API_URL || "/api";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (path, options = {}) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(base + path, options);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "API error");
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [base]);

  return { request, loading, error };
}
