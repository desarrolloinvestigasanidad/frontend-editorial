"use client";

import Link from "next/link";
import { ArrowLeft, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BooksPage() {
  // Ejemplo: varias ediciones, cada una con sus libros
  const allEditions = [
    {
      id: "abril-2025",
      title: "Edición de Libros Electrónicos Abril 2025 Investiga Sanidad",
      books: [
        "Lecciones en Ciencias de la Salud y Gestión Sanitaria",
        "Lecciones en Innovación y Desarrollo en el Ámbito de la Salud",
        "Lecciones en Salud, Tecnología y Nuevos Modelos de Atención",
        "Lecciones en Avances Científicos y Gestión del Conocimiento en Salud",
        "Lecciones de Prevención y Atención Sanitaria Básica",
        "Lecciones de Promoción de la Salud y Prevención de Enfermedades",
        "Lecciones de Salud Pública y Prevención Comunitaria",
        "Lecciones de Cuidados y Atención a la Salud de los pacientes",
      ],
    },
    {
      id: "junio-2025",
      title: "Edición de Libros Electrónicos Junio 2025 Investiga Sanidad",
      books: ["Libro A", "Libro B", "Libro C"],
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex items-center gap-4 mb-6'>
        <Link href='/profile'>
          <Button variant='outline' className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Regresar
          </Button>
        </Link>
        <h1 className='text-xl font-bold'>Todas las ediciones</h1>
      </div>

      {/* Listado de todas las ediciones */}
      <div className='space-y-6'>
        {allEditions.map((edition) => (
          <div key={edition.id} className='border p-4 rounded shadow-sm'>
            <div className='flex items-center gap-2 mb-2'>
              <Book className='text-purple-600 h-6 w-6' />
              <h2 className='text-lg font-semibold'>{edition.title}</h2>
            </div>
            <p className='text-sm text-gray-600'>
              Esta edición cuenta con {edition.books.length} libro(s):
            </p>
            <ul className='list-disc list-inside text-sm text-gray-700 mt-2'>
              {edition.books.map((book, idx) => (
                <li key={idx}>{book}</li>
              ))}
            </ul>

            {/* Botón para ver más detalles, enviar capítulo, etc. */}
            <div className='mt-4'>
              <Link href={`/books/${edition.id}`}>
                <Button variant='outline'>Ver detalles</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
