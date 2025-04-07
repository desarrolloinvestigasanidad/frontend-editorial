"use client";

import { useEffect, useState } from "react";

export function useAvailableCredits(editionId: string) {
  const [availableCredits, setAvailableCredits] = useState<number | null>(null);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [errorCredits, setErrorCredits] = useState<string | null>(null);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
          setAvailableCredits(0);
          setLoadingCredits(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/editions/${editionId}/available-credits`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("No se pudieron obtener los créditos disponibles.");
        }

        const data = await response.json();
        setAvailableCredits(data.available || 0);
      } catch (error: any) {
        console.error("Error al obtener créditos:", error);
        setErrorCredits(error.message);
        setAvailableCredits(0);
      } finally {
        setLoadingCredits(false);
      }
    };

    if (editionId) {
      fetchCredits();
    }
  }, [editionId]);

  return { availableCredits, loadingCredits, errorCredits };
}
