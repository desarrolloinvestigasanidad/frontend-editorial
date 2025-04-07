// src/hooks/useUserCredits.ts
import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";

export function useUserCredits(editionId: string) {
  const { user, loading: userLoading } = useUser();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !editionId) return;

    const fetchCredits = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/${user.id}/editions/${editionId}/chapter-credits`
        );
        const data = await res.json();
        setCredits(data.creditos);
      } catch (error) {
        console.error("Error fetching credits:", error);
        setCredits(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [user, editionId]);

  return { credits, loading: loading || userLoading };
}
