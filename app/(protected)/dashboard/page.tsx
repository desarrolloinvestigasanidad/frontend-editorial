"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Library, PlusCircle } from "lucide-react";

export default function DashboardPage() {
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions`)
      .then((res) => res.json())
      .then((data) => {
        setEditions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching editions:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando ediciones...</div>;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Breadcrumb />
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        {/* Lista de ediciones obtenidas desde la BBDD */}
        {editions.length > 0 ? (
          editions.map((edition) => (
            <Card
              key={edition.id}
              className='bg-gradient-to-br from-purple-50 to-white'>
              <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
                <CardTitle className='text-sm font-medium'>
                  {edition.name}
                </CardTitle>
                <Library className='w-4 h-4 text-purple-600' />
              </CardHeader>
              <CardContent>
                <p className='text-xs text-muted-foreground mt-2'>
                  {edition.description}
                </p>
                <div className='flex gap-2 mt-4'>
                  <Link href={`/editions/${edition.id}/books`}>
                    <Button
                      variant='outline'
                      className='border-purple-200 hover:bg-purple-50'>
                      Participar en Edición
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div>No hay ediciones disponibles.</div>
        )}

        {/* Card: Biblioteca de libros publicados */}
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

        {/* Card: Crear libro propio */}
        <Card className='bg-gradient-to-br from-green-50 to-white'>
          <CardHeader className='flex flex-row items-center justify-between pb-2 space-y-0'>
            <CardTitle className='text-sm font-medium'>
              Crear Libro Propio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-lg font-bold'>¿No encuentras una edición?</div>
            <p className='text-xs text-muted-foreground mt-2'>
              Crea tu propio libro y coordina tus capítulos.
            </p>
            <Link href='/create-book'>
              <Button
                variant='outline'
                className='mt-4 border-green-200 hover:bg-green-50'>
                Crear tu propio libro
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
