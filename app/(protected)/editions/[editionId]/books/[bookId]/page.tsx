"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BookDetailPage() {
  const { editionId, bookId } = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching book:", err);
        setLoading(false);
      });
  }, [editionId, bookId]);

  if (loading) return <div>Cargando libro...</div>;
  if (!book) return <div>Libro no encontrado.</div>;

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>{book.title}</h1>
      <p className='text-sm text-gray-700 mb-2'>Estado: {book.status}</p>
      <p className='text-sm text-gray-700 mb-4'>Categoría: {book.category}</p>
      {/* Botón para ver capítulos */}
      <Link href={`/editions/${editionId}/books/${bookId}/chapters`}>
        <Button variant='outline'>Ver Capítulos</Button>
      </Link>
    </div>
  );
}
