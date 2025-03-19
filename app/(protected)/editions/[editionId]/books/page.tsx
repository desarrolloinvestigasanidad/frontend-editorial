"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditionBooksPage() {
  const { editionId } = useParams();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books`
        );
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    };

    if (editionId) {
      fetchBooks();
    }
  }, [editionId]);

  if (loading) return <div>Cargando libros...</div>;

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>Libros de la Edición</h1>
      {books.length === 0 ? (
        <p>No hay libros en esta edición.</p>
      ) : (
        <div className='space-y-4'>
          {books.map((book) => (
            <div key={book.id} className='border p-4 rounded shadow-sm'>
              <h2 className='text-lg font-semibold'>{book.title}</h2>
              <p className='text-sm text-gray-600'>Estado: {book.status}</p>
              <div className='mt-2 flex gap-2'>
                <Link href={`/editions/${editionId}/books/${book.id}`}>
                  <Button variant='outline'>Ver Detalles</Button>
                </Link>
                {/* Botón para mandar un capítulo al libro */}
                <Link
                  href={`/editions/${editionId}/books/${book.id}/chapters/create`}>
                  <Button variant='outline'>Mandar Capítulo</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
