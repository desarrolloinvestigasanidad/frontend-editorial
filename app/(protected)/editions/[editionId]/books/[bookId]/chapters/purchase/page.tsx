"use client";

import { useState, useEffect } from "react";
import ChapterSelection from "@/components/ChapterSelection";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function PurchaseChaptersPage() {
  const { user, loading: userLoading } = useUser();
  const { editionId, bookId } = useParams();
  const router = useRouter();
  const [totalPurchased, setTotalPurchased] = useState(0);
  const maxChapters = 8;

  // Esperamos a que el usuario esté disponible
  useEffect(() => {
    if (!user) return;
    const fetchPurchasedChapters = async () => {
      try {
        const userId = user.id;
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/editions/${editionId}/chapter-credits`
        );
        if (!res.ok) {
          throw new Error("Error al obtener los capítulos comprados");
        }
        const data = await res.json();
        // data.creditos es el total de capítulos comprados
        setTotalPurchased(data.creditos);
      } catch (error) {
        console.error("Error al obtener capítulos comprados:", error);
      }
    };
    fetchPurchasedChapters();
  }, [user, editionId]);

  const remainingToBuy = maxChapters - totalPurchased;

  const handleSelect = (chaptersToBuy: number, priceToCharge: number) => {
    const userId = user?.id;
    if (!userId) {
      console.error("UserId no encontrado en el contexto.");
      return;
    }
    // Construir metadata para la sesión de checkout:
    const metadata = {
      userId,
      editionId,
      chapterCount: chaptersToBuy.toString(),
    };

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        metadata,
        amount: (priceToCharge * 100).toString(), // monto en céntimos
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          router.push(data.url);
        }
      })
      .catch((err) => {
        console.error("Error creando sesión de checkout:", err);
      });
  };

  if (userLoading) {
    return <div>Cargando usuario...</div>;
  }

  return (
    <div>
      <h1 className='text-2xl font-bold text-center my-4'>
        Compra de Capítulos
      </h1>
      <ChapterSelection
        purchasedChapters={totalPurchased} // total comprados hasta el momento
        onSelect={handleSelect}
      />
      {/* Aquí podrías mostrar un resumen adicional si es necesario */}
    </div>
  );
}
