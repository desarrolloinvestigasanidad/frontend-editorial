"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ChevronLeft,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Target,
  Microscope,
  Lightbulb,
  BookMarked,
  User,
  Calendar,
} from "lucide-react";

export default function ChapterDetailPage() {
  const { editionId, bookId, chapterId } = useParams();
  const router = useRouter();
  const [chapter, setChapter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}/chapters/${chapterId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setChapter(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching chapter:", err);
        setLoading(false);
      });
  }, [editionId, bookId, chapterId]);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "publicado":
      case "aprobado":
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case "en proceso":
      case "pendiente":
      case "en revisión":
        return <Clock className='h-5 w-5 text-yellow-500' />;
      case "rechazado":
        return <AlertCircle className='h-5 w-5 text-red-500' />;
      default:
        return <Clock className='h-5 w-5 text-gray-400' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "publicado":
      case "aprobado":
        return "bg-green-100 text-green-800";
      case "en proceso":
      case "pendiente":
      case "en revisión":
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
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <BookOpen className='h-6 w-6 text-purple-500' />
          </div>
        </div>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-center'>
        <AlertCircle className='h-12 w-12 text-red-500 mb-4' />
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>
          Capítulo no encontrado
        </h2>
        <p className='text-gray-600 mb-4'>
          No se ha podido encontrar la información del capítulo solicitado.
        </p>
        <Button
          className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
          onClick={() => router.back()}>
          Volver atrás
        </Button>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Background with gradient and blobs */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <Button
            variant='ghost'
            className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50'
            onClick={() => router.back()}>
            <ChevronLeft className='mr-1 h-4 w-4' />
            Volver
          </Button>

          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Detalle del Capítulo
          </div>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8'>
          {/* Columna principal con detalles del capítulo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='md:col-span-2'>
            <div className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='bg-purple-100 p-4 rounded-full'>
                  <FileText className='h-8 w-8 text-purple-700' />
                </div>
                <div>
                  <h1 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900'>
                    {chapter.title}
                  </h1>
                  <div className='flex items-center gap-2 mt-2'>
                    <span
                      className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(
                        chapter.status
                      )}`}>
                      {getStatusIcon(chapter.status)}
                      <span className='ml-1'>
                        {chapter.status || "Pendiente"}
                      </span>
                    </span>
                    {chapter.studyType && (
                      <span className='text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800'>
                        {chapter.studyType}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Información del autor y fecha */}
              <div className='flex flex-wrap gap-4 mb-8'>
                {chapter.authorName && (
                  <div className='flex items-center gap-2 p-3 bg-white/80 rounded-lg border border-gray-100'>
                    <div className='bg-purple-100 p-2 rounded-full'>
                      <User className='h-4 w-4 text-purple-700' />
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>Autor</p>
                      <p className='text-sm font-medium'>
                        {chapter.authorName}
                      </p>
                    </div>
                  </div>
                )}

                {chapter.createdAt && (
                  <div className='flex items-center gap-2 p-3 bg-white/80 rounded-lg border border-gray-100'>
                    <div className='bg-purple-100 p-2 rounded-full'>
                      <Calendar className='h-4 w-4 text-purple-700' />
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>Fecha de creación</p>
                      <p className='text-sm font-medium'>
                        {new Date(chapter.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contenido del capítulo */}
              <div className='space-y-8'>
                {chapter.introduction && (
                  <div className='bg-white/60 p-6 rounded-xl border border-purple-100'>
                    <h2 className='text-lg font-semibold text-purple-800 mb-3 flex items-center'>
                      <BookOpen className='h-5 w-5 mr-2' />
                      Introducción
                    </h2>
                    <div className='text-gray-700 whitespace-pre-wrap'>
                      {chapter.introduction}
                    </div>
                  </div>
                )}

                {chapter.objectives && (
                  <div className='bg-white/60 p-6 rounded-xl border border-purple-100'>
                    <h2 className='text-lg font-semibold text-purple-800 mb-3 flex items-center'>
                      <Target className='h-5 w-5 mr-2' />
                      Objetivos
                    </h2>
                    <div className='text-gray-700 whitespace-pre-wrap'>
                      {chapter.objectives}
                    </div>
                  </div>
                )}

                {chapter.methodology && (
                  <div className='bg-white/60 p-6 rounded-xl border border-purple-100'>
                    <h2 className='text-lg font-semibold text-purple-800 mb-3 flex items-center'>
                      <Microscope className='h-5 w-5 mr-2' />
                      Metodología
                    </h2>
                    <div className='text-gray-700 whitespace-pre-wrap'>
                      {chapter.methodology}
                    </div>
                  </div>
                )}

                {chapter.results && (
                  <div className='bg-white/60 p-6 rounded-xl border border-purple-100'>
                    <h2 className='text-lg font-semibold text-purple-800 mb-3 flex items-center'>
                      <CheckCircle className='h-5 w-5 mr-2' />
                      Resultados
                    </h2>
                    <div className='text-gray-700 whitespace-pre-wrap'>
                      {chapter.results}
                    </div>
                  </div>
                )}

                {chapter.discussion && (
                  <div className='bg-white/60 p-6 rounded-xl border border-purple-100'>
                    <h2 className='text-lg font-semibold text-purple-800 mb-3 flex items-center'>
                      <Lightbulb className='h-5 w-5 mr-2' />
                      Discusión-Conclusión
                    </h2>
                    <div className='text-gray-700 whitespace-pre-wrap'>
                      {chapter.discussion}
                    </div>
                  </div>
                )}

                {chapter.bibliography && (
                  <div className='bg-white/60 p-6 rounded-xl border border-purple-100'>
                    <h2 className='text-lg font-semibold text-purple-800 mb-3 flex items-center'>
                      <BookMarked className='h-5 w-5 mr-2' />
                      Bibliografía
                    </h2>
                    <div className='text-gray-700 whitespace-pre-wrap'>
                      {chapter.bibliography}
                    </div>
                  </div>
                )}

                {/* Si solo hay contenido general */}
                {!chapter.introduction &&
                  !chapter.objectives &&
                  !chapter.methodology &&
                  !chapter.results &&
                  !chapter.discussion &&
                  chapter.content && (
                    <div className='bg-white/60 p-6 rounded-xl border border-purple-100'>
                      <h2 className='text-lg font-semibold text-purple-800 mb-3 flex items-center'>
                        <FileText className='h-5 w-5 mr-2' />
                        Contenido
                      </h2>
                      <div className='text-gray-700 whitespace-pre-wrap'>
                        {chapter.content}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </motion.div>

          {/* Columna lateral con información adicional */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <div className='backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 sticky top-4'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <FileText className='h-4 w-4 mr-2 text-purple-600' />
                Información del Capítulo
              </h2>

              <div className='space-y-6'>
                {/* Estado del capítulo */}
                <div className='bg-purple-50/70 p-4 rounded-lg'>
                  <h3 className='text-sm font-medium text-purple-800 mb-2'>
                    Estado del capítulo
                  </h3>
                  <div className='flex items-center gap-2'>
                    {getStatusIcon(chapter.status)}
                    <span className='text-sm text-gray-700'>
                      {chapter.status === "publicado" ||
                      chapter.status === "aprobado"
                        ? "Tu capítulo ha sido aprobado y publicado"
                        : chapter.status === "en proceso" ||
                          chapter.status === "pendiente" ||
                          chapter.status === "en revisión"
                        ? "Tu capítulo está siendo revisado por nuestro comité editorial"
                        : chapter.status === "rechazado"
                        ? "Tu capítulo necesita modificaciones según los comentarios del comité"
                        : "Estado pendiente de actualización"}
                    </span>
                  </div>
                </div>

                {/* Comentarios del revisor si existen */}
                {chapter.reviewComments && (
                  <div className='bg-yellow-50/70 p-4 rounded-lg'>
                    <h3 className='text-sm font-medium text-yellow-800 mb-2'>
                      Comentarios del revisor
                    </h3>
                    <p className='text-sm text-gray-700 whitespace-pre-wrap'>
                      {chapter.reviewComments}
                    </p>
                  </div>
                )}

                {/* Acciones disponibles */}
                <div className='space-y-3 mt-6'>
                  <Button
                    variant='outline'
                    className='w-full border-purple-200 hover:bg-purple-50 hover:text-purple-700'
                    onClick={() =>
                      router.push(
                        `/editions/${editionId}/books/${bookId}/chapters`
                      )
                    }>
                    <FileText className='mr-2 h-4 w-4' />
                    Ver todos los capítulos
                  </Button>

                  {(chapter.status === "rechazado" ||
                    chapter.status === "pendiente de correcciones") && (
                    <Button
                      className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
                      onClick={() =>
                        router.push(
                          `/editions/${editionId}/books/${bookId}/chapters/${chapterId}/edit`
                        )
                      }>
                      <FileText className='mr-2 h-4 w-4' />
                      Editar capítulo
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
