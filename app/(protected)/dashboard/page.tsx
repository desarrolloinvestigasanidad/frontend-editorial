"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Library, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  // Datos de la edición actualmente disponible
  const currentEdition = {
    name: "Edición de Libros Electrónicos Abril 2025 Investiga Sanidad",
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
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Breadcrumb />
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Card: Edición Disponible (con 8 libros) */}
        <Card className='bg-gradient-to-br from-purple-50 to-white'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium'>
              Edición Disponible
            </CardTitle>
            <Library className='w-4 h-4 text-purple-600' />
          </CardHeader>

          <CardContent>
            <div className='text-lg font-bold'>{currentEdition.name}</div>
            <p className='text-xs text-muted-foreground mt-2'>
              En esta edición contamos con {currentEdition.books.length} libros:
            </p>
            <ul className='mt-2 text-xs text-muted-foreground list-disc list-inside'>
              {currentEdition.books.map((book, index) => (
                <li key={index}>{book}</li>
              ))}
            </ul>

            <p className='text-xs text-muted-foreground mt-4'>
              Envía tus capítulos a esta edición o crea el tuyo propio:
            </p>

            {/* Dos botones: Participar en Edición / Crear tu propio libro */}
            <div className='flex gap-2 mt-4'>
              <Link href='/books'>
                <Button
                  variant='outline'
                  className='border-purple-200 hover:bg-purple-50'>
                  Participar en Edición
                </Button>
              </Link>
              <Link href='/create-book'>
                <Button
                  variant='outline'
                  className='border-purple-200 hover:bg-purple-50'>
                  Crear tu propio libro
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Card: Biblioteca (libros ya publicados) */}
        <Card className='bg-gradient-to-br from-yellow-50 to-white'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium'>Biblioteca</CardTitle>
            <PlusCircle className='w-4 h-4 text-yellow-600' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>Publicados</div>
            <p className='text-xs text-muted-foreground'>
              Consulta los libros definitivos
            </p>
            <Link href='/library' className='block mt-4'>
              <Button
                variant='outline'
                className='w-full border-yellow-200 hover:bg-yellow-50'>
                Ver Biblioteca
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
