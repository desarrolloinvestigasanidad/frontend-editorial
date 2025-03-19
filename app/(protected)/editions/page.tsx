"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditionsPage() {
  const [editions, setEditions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions`)
      .then((res) => res.json())
      .then((data) => {
        setEditions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching editions:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando ediciones...</div>;

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>Todas las Ediciones</h1>
      {editions.length === 0 ? (
        <p>No hay ediciones disponibles.</p>
      ) : (
        <div className='space-y-4'>
          {editions.map((edition: any) => (
            <div key={edition.id} className='border p-4 rounded shadow-sm'>
              <h2 className='text-lg font-semibold'>{edition.name}</h2>
              <p className='text-sm text-gray-600'>{edition.description}</p>
              <Link href={`/editions/${edition.id}`}>
                <Button variant='outline' className='mt-2'>
                  Ver Detalles
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
