"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function CreateBookPage() {
  const { editionId } = useParams();
  const router = useRouter();

  console.log("Edition ID:", editionId);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            category,
            price,
            authorId: "id_del_usuario", // Reemplazar por el ID del usuario autenticado
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear el libro");
      }

      // Redirige a la lista de libros de la edición
      router.push(`/editions/${editionId}/books`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-xl font-bold mb-4'>Crear Libro en la Edición</h1>
      {error && <p className='text-red-600 mb-4'>{error}</p>}
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-1'>Título</label>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='border p-2 rounded w-full'
            required
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Categoría</label>
          <input
            type='text'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='border p-2 rounded w-full'
          />
        </div>
        <div>
          <label className='block text-sm font-medium mb-1'>Precio</label>
          <input
            type='number'
            step='0.01'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className='border p-2 rounded w-full'
            required
          />
        </div>
        <Button type='submit' disabled={loading}>
          {loading ? "Creando..." : "Crear Libro"}
        </Button>
      </form>
    </div>
  );
}
