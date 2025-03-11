"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Users,
  CreditCard,
  FileEdit,
} from "lucide-react";

interface BookDetailsProps {
  params: { bookId: string };
}

export default function BookDetailsPage({ params }: BookDetailsProps) {
  const { bookId } = params;

  // Ejemplo: podrías obtener datos del libro vía fetch() a tu API
  // const data = await fetch(`/api/books/${bookId}`, ...);

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Botón "Volver" y título del libro */}
      <div className='flex items-center gap-4 mb-6'>
        <Link href='/books'>
          <Button variant='ghost' className='flex items-center gap-2 px-0'>
            <ArrowLeft className='h-4 w-4' />
            Volver
          </Button>
        </Link>
        <h1 className='text-xl md:text-2xl font-bold'>
          {/* Ejemplo de título del libro */}
          Auxiliar Administrativo de Centros Hospitalarios: Optimización de
          Recursos y Gestión Eficaz
        </h1>
      </div>

      {/* Cards con las secciones */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {/* 1. Edición, fecha y normativa */}
        <Link href={`/books/${bookId}/edition`} className='group'>
          <div className='bg-blue-50 p-4 rounded-lg hover:shadow flex flex-col items-center text-center'>
            <BookOpen className='h-10 w-10 text-blue-600 mb-2' />
            <h2 className='font-semibold text-blue-700'>
              Edición, fecha y normativa
            </h2>
          </div>
        </Link>

        {/* 2. Pago */}
        <Link href={`/books/${bookId}/payment`} className='group'>
          <div className='bg-blue-50 p-4 rounded-lg hover:shadow flex flex-col items-center text-center'>
            <CreditCard className='h-10 w-10 text-blue-600 mb-2' />
            <h2 className='font-semibold text-blue-700'>Pago</h2>
          </div>
        </Link>

        {/* 3. Coordinar libro */}
        <Link href={`/books/${bookId}/coordinate`} className='group'>
          <div className='bg-blue-50 p-4 rounded-lg hover:shadow flex flex-col items-center text-center'>
            <Users className='h-10 w-10 text-blue-600 mb-2' />
            <h2 className='font-semibold text-blue-700'>Coordinar libro</h2>
          </div>
        </Link>

        {/* 4. Envío de capítulo */}
        <Link href={`/books/${bookId}/submit-chapter`} className='group'>
          <div className='bg-blue-50 p-4 rounded-lg hover:shadow flex flex-col items-center text-center'>
            <FileEdit className='h-10 w-10 text-blue-600 mb-2' />
            <h2 className='font-semibold text-blue-700'>Envío de capítulo</h2>
          </div>
        </Link>

        {/* 5. Mis capítulos */}
        <Link href={`/books/${bookId}/my-chapters`} className='group'>
          <div className='bg-blue-50 p-4 rounded-lg hover:shadow flex flex-col items-center text-center'>
            <FileText className='h-10 w-10 text-blue-600 mb-2' />
            <h2 className='font-semibold text-blue-700'>Mis capítulos</h2>
          </div>
        </Link>

        {/* (Opcional) si hay más cards, agrégalos aquí... */}
      </div>
    </div>
  );
}
