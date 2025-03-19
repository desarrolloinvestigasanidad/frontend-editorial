"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChapterDetailPage() {
  const { editionId, bookId, chapterId } = useParams();
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}/chapters/${chapterId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setChapter(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chapter:", err);
        setLoading(false);
      });
  }, [editionId, bookId, chapterId]);

  if (loading) return <div>Cargando capítulo...</div>;
  if (!chapter) return <div>Capítulo no encontrado.</div>;

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-2'>{chapter.title}</h1>
      <p className='text-sm text-gray-700 mb-4'>Estado: {chapter.status}</p>
      <div className='text-sm whitespace-pre-wrap'>{chapter.content}</div>
    </div>
  );
}
