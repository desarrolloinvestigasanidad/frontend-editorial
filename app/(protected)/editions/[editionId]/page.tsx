"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditionDetailPage() {
  const { editionId } = useParams();
  const [edition, setEdition] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}`)
      .then((res) => res.json())
      .then((data) => {
        setEdition(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching edition:", err);
        setLoading(false);
      });
  }, [editionId]);

  if (loading) return <div>Cargando edición...</div>;
  if (!edition) return <div>Edición no encontrada.</div>;

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>{edition.name}</h1>
      <p className='text-sm text-gray-700 mb-4'>{edition.description}</p>
      {/* Botón para ver los libros de esta edición */}
      <Link href={`/editions/${editionId}/books`}>
        <Button variant='outline'>Ver Libros</Button>
      </Link>
    </div>
  );
}
