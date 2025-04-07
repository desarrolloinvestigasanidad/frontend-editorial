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
  const [bookTitle, setBookTitle] = useState("");
  const maxChapters = 8;

  // Si ya terminó de cargar el usuario y no existe, mostramos mensaje de error
  if (!userLoading && (!user || !user.id)) {
    return <div>No se encontró el usuario. Por favor, inicie sesión.</div>;
  }

  // Obtener el total de capítulos comprados para el usuario en esta edición
  useEffect(() => {
    if (!user || !user.id) return;
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
        setTotalPurchased(data.creditos);
      } catch (error) {
        console.error("Error al obtener capítulos comprados:", error);
      }
    };
    fetchPurchasedChapters();
  }, [user, editionId]);

  // Obtener los detalles del libro para extraer el título
  useEffect(() => {
    if (!editionId || !bookId) return;
    const fetchBookDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`
        );
        if (!res.ok) {
          throw new Error("Error al obtener detalles del libro");
        }
        const data = await res.json();
        setBookTitle(data.title);
      } catch (error) {
        console.error("Error al obtener detalles del libro:", error);
      }
    };
    fetchBookDetails();
  }, [editionId, bookId]);

  const handleSelect = (chaptersToBuy: number, priceToCharge: number) => {
    if (!user || !user.id) {
      console.error("UserId no encontrado en el contexto.");
      return;
    }
    const userId = user.id;

    // Construir el payload de checkout
    const payload = {
      userId,
      bookTitle, // Obtenido de la consulta al endpoint del libro
      amount: (priceToCharge * 100).toString(), // monto en céntimos
      metadata: {
        userId,
        editionId,
        chapterCount: chaptersToBuy.toString(),
        bookTitle,
      },
    };

    console.log("Payload de checkout:", payload);

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/create-checkout-session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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
        purchasedChapters={totalPurchased}
        onSelect={handleSelect}
      />
    </div>
  );
}
