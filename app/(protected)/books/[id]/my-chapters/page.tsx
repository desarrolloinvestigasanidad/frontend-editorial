"use client";

import { useState, useEffect } from "react";
import { ChapterTable, Chapter } from "@/components/chapter-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function MyChaptersPage() {
  // Estado para almacenar todos los capítulos del usuario
  const [chapters, setChapters] = useState<Chapter[]>([]);

  // Estado para la pestaña activa: Aceptados, Pendientes o Rechazados
  const [activeTab, setActiveTab] = useState<
    "Aceptados" | "Pendientes" | "Rechazados"
  >("Aceptados");

  // Cargar capítulos en el useEffect
  useEffect(() => {
    // Ejemplo de fetch /api/user/chapters
    // setChapters(await res.json());

    // Demo:
    setChapters([
      {
        id: 1,
        title: "Gestión de riesgos hospitalarios",
        bookTitle: "Edición XXVIII",
        status: "Aceptado",
        submissionDate: "2024-10-01",
      },
      {
        id: 2,
        title: "Análisis de casos clínicos en pediatría",
        bookTitle: "Edición XXVIII",
        status: "Aceptado",
        submissionDate: "2024-10-05",
      },
      {
        id: 3,
        title: "Plan de contingencia en UCI",
        bookTitle: "Libro Personalziado: Emergencias",
        status: "Pendiente",
        submissionDate: "2024-10-10",
      },
      {
        id: 4,
        title: "Síndrome post-COVID",
        bookTitle: "Libro Personalziado: Emergencias",
        status: "Rechazado",
        submissionDate: "2024-10-15",
      },
    ]);
  }, []);

  // Filtrar capítulos según status
  const acceptedChapters = chapters.filter((ch) => ch.status === "Aceptado");
  const pendingChapters = chapters.filter((ch) => ch.status === "Pendiente");
  const rejectedChapters = chapters.filter((ch) => ch.status === "Rechazado");

  // Ejemplo: supongamos que el usuario es autor principal de los 2 primeros, coautor de los demás
  // (En la vida real, esto vendría del backend con un campo `isAuthorPrincipal`)
  const [authorPrincipalIds] = useState([1, 3]); // IDs que el user es autor principal

  // Callbacks para acciones
  const handlePreview = (chapterId: number) => {
    alert(`Previsualizar capítulo ${chapterId}`);
    // Ejemplo: router.push(`/chapters/${chapterId}/preview`);
  };
  const handleEdit = (chapterId: number) => {
    alert(`Editar capítulo ${chapterId}`);
    // Ejemplo: router.push(`/chapters/${chapterId}/edit`);
  };
  const handleDelete = (chapterId: number) => {
    const confirmDel = confirm("¿Eliminar este capítulo?");
    if (confirmDel) {
      // DELETE /api/chapters/:chapterId
      setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
      alert(`Capítulo ${chapterId} eliminado.`);
    }
  };
  const handleAddCoauthor = (chapterId: number) => {
    alert(`Agregar coautor al capítulo ${chapterId}`);
    // Podrías abrir un modal o redirigir a /chapters/${chapterId}/coauthors
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Mis capítulos</h1>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)}>
        <TabsList className='mb-4 flex gap-4'>
          <TabsTrigger value='Aceptados'>Aceptados</TabsTrigger>
          <TabsTrigger value='Pendientes'>Pendientes</TabsTrigger>
          <TabsTrigger value='Rechazados'>Rechazados</TabsTrigger>
        </TabsList>

        <TabsContent value='Aceptados'>
          {renderChaptersTable(acceptedChapters)}
        </TabsContent>
        <TabsContent value='Pendientes'>
          {renderChaptersTable(pendingChapters)}
        </TabsContent>
        <TabsContent value='Rechazados'>
          {renderChaptersTable(rejectedChapters)}
        </TabsContent>
      </Tabs>
    </div>
  );

  /**
   * Renderiza dos tablas:
   * - Autor principal
   * - Coautor
   *
   * Determinamos quién es autor principal comprobando si su ID está en `authorPrincipalIds`.
   * Ajusta esta lógica a tu modelo real (ej. un campo isAuthorPrincipal en la respuesta).
   */
  function renderChaptersTable(chaps: Chapter[]) {
    // Autor principal => capítulo con ID en authorPrincipalIds
    const authorChaps = chaps.filter((c) => authorPrincipalIds.includes(c.id));
    // Coautor => resto
    const coauthorChaps = chaps.filter(
      (c) => !authorPrincipalIds.includes(c.id)
    );

    return (
      <>
        {/* Sección: Autor principal */}
        <section className='mb-8'>
          <h2 className='font-semibold text-lg mb-2'>
            Participaciones como autor principal
          </h2>
          <ChapterTable
            chapters={authorChaps}
            canEdit={true}
            canDelete={true}
            canAddCoauthor={true}
            onPreview={handlePreview}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddCoauthor={handleAddCoauthor}
          />
        </section>

        {/* Sección: Coautor */}
        <section className='mb-8'>
          <h2 className='font-semibold text-lg mb-2'>
            Participaciones como coautor
          </h2>
          <ChapterTable
            chapters={coauthorChaps}
            canEdit={false}
            canDelete={false}
            canAddCoauthor={false}
            onPreview={handlePreview}
          />
        </section>
      </>
    );
  }
}
