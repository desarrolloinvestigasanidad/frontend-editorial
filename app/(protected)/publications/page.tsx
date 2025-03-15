"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, FileDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Interface para publicaciones
interface Publication {
  id: number;
  title: string;
  status: string;
  color?: "orange" | "green" | "blue";
}

// Ejemplo: Datos para "Capítulos en libro de edición"
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

// Ejemplo: Datos para "Crea tus propios libros"
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

export default function PublicationsPage() {
  // Tabs: "edicion" vs. "propio"
  const [activeTab, setActiveTab] = useState<"edicion" | "propio">("edicion");
  const [searchTerm, setSearchTerm] = useState("");

  // Acciones de descarga
  const handleDownloadChapters = (pubId: number) => {
    // Lógica para descargar "Texto de mis capítulos"
    // Ejemplo: window.open(`/api/pdf/my-chapters?bookId=${pubId}`, "_blank")
    alert(`Descargar sólo capítulos (ID: ${pubId})`);
  };

  const handleDownloadFull = (pubId: number) => {
    // Lógica para descargar "Libro completo"
    alert(`Descargar libro completo (ID: ${pubId})`);
  };

  // Filtrar publicaciones según el término de búsqueda
  const filteredEditions = editionsData.filter(
    (pub) =>
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOwnBooks = ownBooksData.filter(
    (pub) =>
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Breadcrumb />
      </div>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-xl font-bold'>Mis Publicaciones</CardTitle>
          <BookOpen className='h-5 w-5 text-purple-600' />
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "edicion" | "propio")}
            className='w-full'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6'>
              <TabsList className='md:w-auto'>
                <TabsTrigger value='edicion'>
                  Capítulos libro de edición
                </TabsTrigger>
                <TabsTrigger value='propio'>
                  Crea tus propios libros
                </TabsTrigger>
              </TabsList>
              <div className='relative w-full md:w-64'>
                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Buscar publicaciones...'
                  className='pl-8'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value='edicion' className='mt-0'>
              <PublicationsList
                publications={filteredEditions}
                onDownloadChapters={handleDownloadChapters}
                onDownloadFull={handleDownloadFull}
              />
            </TabsContent>

            <TabsContent value='propio' className='mt-0'>
              <PublicationsList
                publications={filteredOwnBooks}
                onDownloadChapters={handleDownloadChapters}
                onDownloadFull={handleDownloadFull}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function PublicationsList({
  publications,
  onDownloadChapters,
  onDownloadFull,
}: {
  publications: Publication[];
  onDownloadChapters: (id: number) => void;
  onDownloadFull: (id: number) => void;
}) {
  if (publications.length === 0) {
    return (
      <div className='p-8 text-center bg-muted/30 rounded-md'>
        <BookOpen className='h-8 w-8 mx-auto text-muted-foreground mb-2' />
        <p className='text-muted-foreground'>
          No hay publicaciones en esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {publications.map((pub) => (
        <Card
          key={pub.id}
          className={`
          border-l-4
          ${
            pub.color === "orange"
              ? "border-l-orange-500 bg-orange-50/50"
              : pub.color === "green"
              ? "border-l-green-500 bg-green-50/50"
              : pub.color === "blue"
              ? "border-l-blue-500 bg-blue-50/50"
              : "border-l-gray-500 bg-gray-50/50"
          }
        `}>
          <CardContent className='p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <h3 className='font-semibold'>{pub.title}</h3>
              <div className='flex items-center gap-2 mt-1'>
                <Badge
                  variant='outline'
                  className={`
                  ${
                    pub.color === "orange"
                      ? "bg-orange-100 text-orange-800 hover:bg-orange-100"
                      : pub.color === "green"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : pub.color === "blue"
                      ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                  }
                `}>
                  {pub.status}
                </Badge>
              </div>
            </div>
            <div className='flex gap-2 w-full md:w-auto'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onDownloadChapters(pub.id)}
                className='flex items-center gap-2 w-full md:w-auto'>
                <FileDown className='h-4 w-4' />
                <span className='whitespace-nowrap'>Mis capítulos</span>
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => onDownloadFull(pub.id)}
                className='flex items-center gap-2 w-full md:w-auto'>
                <FileDown className='h-4 w-4' />
                <span className='whitespace-nowrap'>Libro completo</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
