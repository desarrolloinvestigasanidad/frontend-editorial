"use client";

import { useState, useEffect, useCallback } from "react";
import ChapterSelection from "@/components/ChapterSelection";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import RegulationsModal from "@/components/RegulationsModal";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PurchaseChaptersPage() {
  const { user, loading: userLoading } = useUser();
  const { editionId, bookId } = useParams();
  const router = useRouter();

  const [hasUser, setHasUser] = useState(false);
  const [totalPurchased, setTotalPurchased] = useState(0);
  const [bookTitle, setBookTitle] = useState("");
  const [regulationsAccepted, setRegulationsAccepted] = useState(false);

  // 1) Track whether we actually have a user
  useEffect(() => {
    setHasUser(!!user?.id);
  }, [user]);

  // 2) Fetch how many chapters they already purchased
  const fetchPurchasedChapters = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/users/${user.id}/editions/${editionId}/chapter-credits`
      );
      if (!res.ok) throw new Error("Error al obtener los capítulos");
      const data = await res.json();
      setTotalPurchased(data.creditos);
    } catch (err) {
      console.error(err);
    }
  }, [user?.id, editionId]);

  useEffect(() => {
    if (hasUser) fetchPurchasedChapters();
  }, [hasUser, fetchPurchasedChapters]);

  // 3) Fetch the book’s title
  const fetchBookDetails = useCallback(async () => {
    if (!editionId || !bookId) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`
      );
      if (!res.ok) throw new Error("Error al obtener detalles del libro");
      const data = await res.json();
      setBookTitle(data.title);
    } catch (err) {
      console.error(err);
    }
  }, [editionId, bookId]);

  useEffect(() => {
    fetchBookDetails();
  }, [fetchBookDetails]);

  // 4) Handle checkout
  const handleSelect = (chaptersToBuy: number, priceToCharge: number) => {
    if (!regulationsAccepted) {
      alert("Debes aceptar la normativa antes de continuar");
      return;
    }
    if (!user?.id) return console.error("User ID missing");
    const payload = {
      userId: user.id,
      bookTitle,
      amount: (priceToCharge * 100).toString(),
      metadata: {
        userId: user.id,
        editionId,
        chapterCount: chaptersToBuy.toString(),
        bookTitle,
      },
    };
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => r.json())
      .then((d) => d.url && router.push(d.url))
      .catch(console.error);
  };

  // ────────── Renders ──────────

  if (userLoading) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        Cargando usuario…
      </div>
    );
  }

  if (!hasUser) {
    return (
      <Alert variant='destructive' className='max-w-md mx-auto mt-8'>
        <AlertCircle className='h-4 w-4' />
        <AlertDescription>
          No se encontró el usuario. Por favor, inicie sesión.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className='w-full '>
      <CardHeader>
        <CardTitle>Compra de Capítulos</CardTitle>
        <CardDescription>
          {bookTitle
            ? `Libro: ${bookTitle}`
            : "Seleccione cuántos capítulos comprar"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='mb-6'>
          <div className='flex items-center gap-2 mb-4'>
            <RegulationsModal
              isAccepted={regulationsAccepted}
              onAcceptChange={setRegulationsAccepted}
            />
            {regulationsAccepted && (
              <span className='text-sm text-green-600'>
                ✓ Normativa aceptada
              </span>
            )}
          </div>
          {!regulationsAccepted && (
            <Alert className='mb-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                Debes aceptar la normativa antes de continuar.
              </AlertDescription>
            </Alert>
          )}
        </div>
        <ChapterSelection
          purchasedChapters={totalPurchased}
          onSelect={handleSelect}
          disabled={!regulationsAccepted}
        />
      </CardContent>
    </Card>
  );
}
