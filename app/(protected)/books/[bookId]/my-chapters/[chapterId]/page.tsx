"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  Target,
  Microscope,
  CheckCircle,
  Clock,
  AlertCircle,
  Lightbulb,
  BookMarked,
  User,
  Calendar,
  ChevronLeft,
} from "lucide-react";

type Chapter = {
  id: string;
  title: string;
  studyType?: string;
  introduction?: string;
  objectives?: string;
  methodology?: string;
  results?: string;
  discussion?: string;
  bibliography?: string;
  status: string;
  authorName?: string;
  createdAt: string;
  updatedAt: string;
  bookId: string;
};

export default function ChapterDetailPage() {
  const { bookId, chapterId } = useParams();
  const router = useRouter();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/chapters/${chapterId}`)
      .then((res) => res.json())
      .then((data) => {
        // tu controlador podría devolver { chapter: {...} } o directamente {...}
        setChapter(data.chapter ?? data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chapter:", err);
        setLoading(false);
      });
  }, [chapterId]);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprobado":
      case "publicado":
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case "en revisión":
      case "pendiente":
        return <Clock className='h-5 w-5 text-yellow-500' />;
      case "rechazado":
        return <AlertCircle className='h-5 w-5 text-red-500' />;
      default:
        return <Clock className='h-5 w-5 text-gray-400' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprobado":
      case "publicado":
        return "bg-green-100 text-green-800";
      case "en revisión":
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "rechazado":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p>Cargando detalle del capítulo…</p>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-center'>
        <AlertCircle className='h-12 w-12 text-red-500 mb-4' />
        <h2 className='text-xl font-semibold mb-2'>Capítulo no encontrado</h2>
        <Button onClick={() => router.back()}>Volver atrás</Button>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white' />
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob' />
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000' />
      </div>

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        {/* Header y volver */}
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            className='flex items-center'
            onClick={() => router.back()}>
            <ChevronLeft className='mr-1 h-4 w-4' />
            Volver
          </Button>
          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Detalle del capítulo
          </div>
        </div>

        <div className='grid md:grid-cols-3 gap-8'>
          {/* Principal */}
          <div className='md:col-span-2 backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='bg-purple-100 p-4 rounded-full'>
                <BookOpen className='h-8 w-8 text-purple-700' />
              </div>
              <div>
                <h1 className='text-2xl font-bold'>{chapter.title}</h1>
                <div className='flex items-center gap-2 mt-2'>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      chapter.status
                    )}`}>
                    {getStatusIcon(chapter.status)}
                    <span className='ml-1'>{chapter.status}</span>
                  </span>
                  {chapter.studyType && (
                    <span className='text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800'>
                      {chapter.studyType}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Autor y fecha */}
            <div className='flex flex-wrap gap-4 mb-8'>
              {chapter.authorName && (
                <div className='flex items-center gap-2 p-3 bg-white/80 rounded-lg border'>
                  <User className='h-4 w-4 text-purple-700' />
                  <div>
                    <p className='text-xs text-gray-500'>Autor</p>
                    <p className='text-sm'>{chapter.authorName}</p>
                  </div>
                </div>
              )}
              <div className='flex items-center gap-2 p-3 bg-white/80 rounded-lg border'>
                <Calendar className='h-4 w-4 text-purple-700' />
                <div>
                  <p className='text-xs text-gray-500'>Creado el</p>
                  <p className='text-sm'>
                    {new Date(chapter.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Secciones */}
            {chapter.introduction && (
              <section className='mb-6'>
                <h2 className='text-lg font-semibold mb-2 flex items-center'>
                  <FileText className='mr-2' />
                  Introducción
                </h2>
                <p className='whitespace-pre-wrap text-gray-700'>
                  {chapter.introduction}
                </p>
              </section>
            )}

            {chapter.objectives && (
              <section className='mb-6'>
                <h2 className='text-lg font-semibold mb-2 flex items-center'>
                  <Target className='mr-2' />
                  Objetivos
                </h2>
                <p className='whitespace-pre-wrap text-gray-700'>
                  {chapter.objectives}
                </p>
              </section>
            )}

            {chapter.methodology && (
              <section className='mb-6'>
                <h2 className='text-lg font-semibold mb-2 flex items-center'>
                  <Microscope className='mr-2' />
                  Metodología
                </h2>
                <p className='whitespace-pre-wrap text-gray-700'>
                  {chapter.methodology}
                </p>
              </section>
            )}

            {chapter.results && (
              <section className='mb-6'>
                <h2 className='text-lg font-semibold mb-2 flex items-center'>
                  <CheckCircle className='mr-2' />
                  Resultados
                </h2>
                <p className='whitespace-pre-wrap text-gray-700'>
                  {chapter.results}
                </p>
              </section>
            )}

            {chapter.discussion && (
              <section className='mb-6'>
                <h2 className='text-lg font-semibold mb-2 flex items-center'>
                  <Lightbulb className='mr-2' />
                  Discusión-Conclusión
                </h2>
                <p className='whitespace-pre-wrap text-gray-700'>
                  {chapter.discussion}
                </p>
              </section>
            )}

            {chapter.bibliography && (
              <section>
                <h2 className='text-lg font-semibold mb-2 flex items-center'>
                  <BookMarked className='mr-2' />
                  Bibliografía
                </h2>
                <p className='whitespace-pre-wrap text-gray-700'>
                  {chapter.bibliography}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
