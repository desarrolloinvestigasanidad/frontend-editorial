"use client";

import Link from "next/link";
import { ArrowLeft, Book } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BooksPage() {
  // Ejemplo de datos de ediciones
  const editions = [
    {
      id: 1,
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      iconColor: "text-orange-600",
      title: "Edición XXVII Libros Electrónicos noviembre 2024",
      subtitle:
        "Edición abierta. Envío de capítulos hasta el 26 de noviembre de 2024",
    },
    {
      id: 2,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      iconColor: "text-green-600",
      title: "Edición XXVIII Libros Electrónicos diciembre 2024",
      subtitle:
        "Edición abierta. Envío de capítulos hasta el 10 de diciembre de 2024",
    },
  ];

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Encabezado con botón de regreso y título */}
      <div className='flex items-center gap-4 mb-6'>
        <Link href='/profile'>
          <Button variant='outline' className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Regresar
          </Button>
        </Link>
        <h1 className='text-xl font-bold'>Libros</h1>
      </div>

      {/* Listado de ediciones */}
      <div className='space-y-4 mb-8'>
        {editions.map((edition) => (
          <div
            key={edition.id}
            className={`p-4 rounded-lg shadow-sm border flex items-center justify-between ${edition.bgColor} ${edition.borderColor}`}>
            <div className='flex items-center gap-4'>
              {/* Ícono de libros */}
              <div className={`text-4xl ${edition.iconColor}`}>
                <Book className='h-12 w-12' />
              </div>
              {/* Texto principal */}
              <div>
                <h2 className='text-lg font-semibold'>{edition.title}</h2>
                <p className='text-sm text-gray-600'>{edition.subtitle}</p>
              </div>
            </div>
            {/* Botón de “ver detalles” o similar */}
            <Link href={`/books/${edition.id}`}>
              <Button variant='outline'>Ver edición</Button>
            </Link>
          </div>
        ))}
      </div>

      {/* Sección de “No encuentras el tuyo?” */}
      <div className='p-6 rounded-lg shadow-sm border bg-yellow-50 border-yellow-200 flex flex-col md:flex-row items-center justify-between'>
        <div className='flex items-center gap-4 mb-4 md:mb-0'>
          {/* Ícono para libro */}
          <div className='text-4xl text-yellow-600'>
            <Book className='h-12 w-12' />
          </div>
          <div>
            <h3 className='text-lg font-semibold mb-1'>
              ¿No encuentras el tuyo?
            </h3>
            <p className='text-sm text-gray-600'>
              Crea tu propio libro y coordina con coautores.
            </p>
          </div>
        </div>
        {/* Botón para crear libro */}
        <Link href='/create-book'>
          <Button className='bg-yellow-500 hover:bg-yellow-600 text-white'>
            Crea tu propio libro
          </Button>
        </Link>
      </div>
    </div>
  );
}
