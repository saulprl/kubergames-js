import { useCallback, useEffect, useState } from "react";

const useScores = (game) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scores, setScores] = useState([]);
  const [error, setError] = useState(null);
  const host = process.env.REACT_APP_API_URL;

  const fetchScores = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const res = await fetch(`${host}/kubergames/${game}`);

      const data = await res.json();
      setScores(data.scores);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [game, host]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return { fetchScores, isLoading, scores, error };
};

export default useScores;
