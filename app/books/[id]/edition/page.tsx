"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditionProps {
  params: { bookId: string };
}

export default function EditionPage({ params }: EditionProps) {
  const { bookId } = params;

  // Aquí podrías hacer fetch a tu endpoint: GET /api/editions/:bookId
  // para obtener fecha límite, normativa, etc.

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Botón "Volver" */}
      <Link href={`/books/${bookId}`}>
        <Button variant='ghost' className='flex items-center gap-2 mb-6 px-0'>
          <ArrowLeft className='h-4 w-4' />
          Volver
        </Button>
      </Link>

      <h1 className='text-xl md:text-2xl font-bold mb-4'>
        Edición, fecha y normativa
      </h1>

      <div className='bg-white rounded-lg shadow p-6'>
        <p className='text-gray-700 mb-4'>
          {/* Ejemplo de datos estáticos; en la práctica vendrán de la API */}
          <strong>Fecha límite de envío de capítulos:</strong> 26 de noviembre
          de 2024
        </p>
        <p className='text-gray-700 mb-4'>
          <strong>Normativa:</strong> Lorem ipsum dolor sit amet, consectetur
          adipisicing elit...
        </p>

        {/* Podrías mostrar un PDF embed, o un link para descargar la normativa, etc. */}
        <Button variant='outline'>Descargar Normativa</Button>
      </div>
    </div>
  );
}
