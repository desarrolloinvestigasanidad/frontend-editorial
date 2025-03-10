"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, FileDown } from "lucide-react";
import Link from "next/link";

// Interface para publicaciones
interface Publication {
  id: number;
  title: string;
  status: string; // Ej. “Publicación Oficial” o “Publicada”
  color?: "orange" | "green" | "blue";
}

// Ejemplo: Datos para “Capítulos en libro de edición”
const editionsData: Publication[] = [
  {
    id: 1,
    title: "Edición XXI Libros Electrónicos Mayo 2021",
    status: "Publicación Oficial",
    color: "orange",
  },
  {
    id: 2,
    title: "Edición XX Libros Electrónicos Mayo 2024",
    status: "Publicada",
    color: "green",
  },
];

// Ejemplo: Datos para “Crea tus propios libros”
const ownBooksData: Publication[] = [
  {
    id: 101,
    title: "Libro Propio de Emergencias 2024",
    status: "Publicado",
    color: "blue",
  },
  {
    id: 102,
    title: "Gestión Hospitalaria 2023",
    status: "Publicación Oficial",
    color: "orange",
  },
];

export default function MyPublicationsPage() {
  // Tabs: “edicion” vs. “propio”
  const [activeTab, setActiveTab] = useState<"edicion" | "propio">("edicion");

  // Acciones de descarga
  const handleDownloadChapters = (pubId: number) => {
    // Lógica para descargar “Texto de mis capítulos”
    // Ejemplo: window.open(`/api/pdf/my-chapters?bookId=${pubId}`, "_blank")
    alert(`Descargar sólo capítulos (ID: ${pubId})`);
  };
  const handleDownloadFull = (pubId: number) => {
    // Lógica para descargar “Libro completo”
    alert(`Descargar libro completo (ID: ${pubId})`);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Encabezado con botón “Volver” */}
      <div className='flex items-center gap-4 mb-6'>
        <Link href='/profile'>
          <Button variant='outline' className='flex items-center gap-2'>
            <ArrowLeft className='h-4 w-4' />
            Regresar
          </Button>
        </Link>
        <h1 className='text-xl font-bold'>Mis publicaciones</h1>
      </div>

      {/* Tabs para las 2 secciones: Edición y Crea tu propio libro */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "edicion" | "propio")}>
        <TabsList className='mb-4 flex gap-2'>
          <TabsTrigger value='edicion'>Capítulos libro de edición</TabsTrigger>
          <TabsTrigger value='propio'>Crea tus propios libros</TabsTrigger>
        </TabsList>

        {/* Lista de “Capítulos libro de edición” */}
        <TabsContent value='edicion'>
          {renderPublicationsList(editionsData)}
        </TabsContent>

        {/* Lista de “Crea tus propios libros” */}
        <TabsContent value='propio'>
          {renderPublicationsList(ownBooksData)}
        </TabsContent>
      </Tabs>
    </div>
  );

  /**
   * Función para renderizar las “cards” de publicaciones
   */
  function renderPublicationsList(pubArray: Publication[]) {
    if (pubArray.length === 0) {
      return (
        <p className='text-gray-600'>No hay publicaciones en esta categoría.</p>
      );
    }

    return (
      <div className='space-y-4'>
        {pubArray.map((pub) => (
          <div
            key={pub.id}
            className={`p-4 rounded-lg shadow-sm border flex items-center justify-between ${
              pub.color === "orange"
                ? "bg-orange-50 border-orange-200"
                : pub.color === "green"
                ? "bg-green-50 border-green-200"
                : pub.color === "blue"
                ? "bg-blue-50 border-blue-200"
                : "bg-gray-50 border-gray-200"
            }`}>
            <div>
              <h2 className='text-lg font-semibold'>{pub.title}</h2>
              <p className='text-sm text-gray-600'>{pub.status}</p>
            </div>
            <div className='flex gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleDownloadChapters(pub.id)}
                className='flex items-center gap-2'>
                <FileDown className='h-4 w-4' />
                Mis capítulos
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handleDownloadFull(pub.id)}
                className='flex items-center gap-2'>
                <FileDown className='h-4 w-4' />
                Libro completo
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
