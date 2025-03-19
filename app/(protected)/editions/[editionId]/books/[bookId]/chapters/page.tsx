"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ChaptersPage() {
  const { editionId, bookId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}/chapters`
    )
      .then((res) => res.json())
      .then((data) => {
        setChapters(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chapters:", err);
        setLoading(false);
      });
  }, [editionId, bookId]);

  if (loading) return <div>Cargando capítulos...</div>;

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>Capítulos del Libro</h1>
      {chapters.length === 0 ? (
        <p>No hay capítulos en este libro.</p>
      ) : (
        <div className='space-y-4'>
          {chapters.map((chapter: any) => (
            <div key={chapter.id} className='border p-4 rounded shadow-sm'>
              <h2 className='text-lg font-semibold'>{chapter.title}</h2>
              <p className='text-sm text-gray-600 mb-2'>
                Estado: {chapter.status}
              </p>
              <Link
                href={`/editions/${editionId}/books/${bookId}/chapters/${chapter.id}`}>
                <Button variant='outline'>Ver Detalle</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
