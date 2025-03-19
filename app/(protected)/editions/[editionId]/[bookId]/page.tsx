"use client";

import Link from "next/link";
import { ArrowLeft, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BooksPage() {
  // Ejemplo: varias ediciones, cada una con sus libros como objetos con id y title
  const allEditions = [
    {
      id: "abril-2025",
      title: "Edición de Libros Electrónicos Abril 2025 Investiga Sanidad",
      books: [
        {
          id: "uuid-1",
          title: "Lecciones en Ciencias de la Salud y Gestión Sanitaria",
        },
        {
          id: "uuid-2",
          title:
            "Lecciones en Innovación y Desarrollo en el Ámbito de la Salud",
        },
        {
          id: "uuid-3",
          title: "Lecciones en Salud, Tecnología y Nuevos Modelos de Atención",
        },
        {
          id: "uuid-4",
          title:
            "Lecciones en Avances Científicos y Gestión del Conocimiento en Salud",
        },
        {
          id: "uuid-5",
          title: "Lecciones de Prevención y Atención Sanitaria Básica",
        },
        {
          id: "uuid-6",
          title:
            "Lecciones de Promoción de la Salud y Prevención de Enfermedades",
        },
        {
          id: "uuid-7",
          title: "Lecciones de Salud Pública y Prevención Comunitaria",
        },
        {
          id: "uuid-8",
          title: "Lecciones de Cuidados y Atención a la Salud de los pacientes",
        },
      ],
    },
    {
      id: "junio-2025",
      title: "Edición de Libros Electrónicos Junio 2025 Investiga Sanidad",
      books: [
        { id: "uuid-9", title: "Libro A" },
        { id: "uuid-10", title: "Libro B" },
        { id: "uuid-11", title: "Libro C" },
      ],
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Encabezado con botón de regreso */}
      <div className='flex items-center gap-4 mb-6'>
        <Link href='/profile'>
          <Button variant='outline' className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Regresar
          </Button>
        </Link>
        <h1 className='text-xl font-bold'>Todas las ediciones</h1>
      </div>

      {/* Listado de ediciones */}
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
              {edition.books.map((book) => (
                <li key={book.id}>
                  <Link
                    href={`/books/${edition.id}/${book.id}`}
                    className='text-blue-600 hover:underline'>
                    {book.title}
                  </Link>
                </li>
              ))}
            </ul>
            {/* Opcional: botón para ver detalles de la edición en su conjunto */}
            <div className='mt-4'>
              <Link href={`/books/${edition.id}`}>
                <Button variant='outline'>Ver detalles de la edición</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
