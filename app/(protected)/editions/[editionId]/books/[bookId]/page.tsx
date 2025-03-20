"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ArrowRight,
  ChevronLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Tag,
  Calendar,
  Info,
  Users,
} from "lucide-react";

export default function BookDetailPage() {
  const { editionId, bookId } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching book:", err);
        setLoading(false);
      });
  }, [editionId, bookId]);

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "publicado":
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case "en proceso":
        return <Clock className='h-5 w-5 text-yellow-500' />;
      default:
        return <AlertCircle className='h-5 w-5 text-gray-400' />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "publicado":
        return "bg-green-100 text-green-800";
      case "en proceso":
        return "bg-yellow-100 text-yellow-800";
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

  if (!book) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-center'>
        <AlertCircle className='h-12 w-12 text-red-500 mb-4' />
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>
          Libro no encontrado
        </h2>
        <p className='text-gray-600 mb-4'>
          No se ha podido encontrar la información del libro solicitado.
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
            Detalles del Libro
          </div>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8'>
          {/* Columna principal con detalles del libro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='md:col-span-2'>
            <div className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 h-full'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='bg-purple-100 p-4 rounded-full'>
                  <BookOpen className='h-8 w-8 text-purple-700' />
                </div>
                <div>
                  <h1 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900'>
                    {book.title}
                  </h1>
                  <div className='flex items-center gap-2 mt-2'>
                    <span
                      className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(
                        book.status
                      )}`}>
                      {getStatusIcon(book.status)}
                      <span className='ml-1'>{book.status || "Pendiente"}</span>
                    </span>
                    {book.category && (
                      <span className='text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 flex items-center'>
                        <Tag className='h-3 w-3 mr-1' />
                        {book.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Descripción del libro */}
              {book.description && (
                <div className='mb-8'>
                  <h2 className='text-lg font-semibold text-gray-900 mb-2 flex items-center'>
                    <Info className='h-4 w-4 mr-2 text-purple-600' />
                    Descripción
                  </h2>
                  <p className='text-gray-700 bg-purple-50/50 p-4 rounded-lg border border-purple-100/50'>
                    {book.description}
                  </p>
                </div>
              )}

              {/* Detalles adicionales */}
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
                {book.isbn && (
                  <div className='flex items-center gap-2 p-3 bg-white/80 rounded-lg border border-gray-100'>
                    <div className='bg-purple-100 p-2 rounded-full'>
                      <BookOpen className='h-4 w-4 text-purple-700' />
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>ISBN</p>
                      <p className='text-sm font-medium'>{book.isbn}</p>
                    </div>
                  </div>
                )}

                {book.publicationDate && (
                  <div className='flex items-center gap-2 p-3 bg-white/80 rounded-lg border border-gray-100'>
                    <div className='bg-purple-100 p-2 rounded-full'>
                      <Calendar className='h-4 w-4 text-purple-700' />
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>
                        Fecha de Publicación
                      </p>
                      <p className='text-sm font-medium'>
                        {new Date(book.publicationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {book.editor && (
                  <div className='flex items-center gap-2 p-3 bg-white/80 rounded-lg border border-gray-100'>
                    <div className='bg-purple-100 p-2 rounded-full'>
                      <Users className='h-4 w-4 text-purple-700' />
                    </div>
                    <div>
                      <p className='text-xs text-gray-500'>Editor</p>
                      <p className='text-sm font-medium'>{book.editor}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className='flex flex-wrap gap-4'>
                <Link href={`/editions/${editionId}/books/${bookId}/chapters`}>
                  <Button
                    className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 hover:shadow-lg'
                    onMouseEnter={() => handleMouseEnter("chapters")}
                    onMouseLeave={() => handleMouseLeave("chapters")}>
                    <span className='flex items-center'>
                      <FileText className='mr-2 h-4 w-4' />
                      Ver Capítulos
                      <motion.span
                        animate={{ x: hoverStates["chapters"] ? 5 : 0 }}
                        transition={{ duration: 0.2 }}>
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </motion.span>
                    </span>
                  </Button>
                </Link>

                <Link
                  href={`/editions/${editionId}/books/${bookId}/chapters/create`}>
                  <Button
                    variant='outline'
                    className='border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300'
                    onMouseEnter={() => handleMouseEnter("create-chapter")}
                    onMouseLeave={() => handleMouseLeave("create-chapter")}>
                    <span className='flex items-center'>
                      <FileText className='mr-2 h-4 w-4' />
                      Mandar Capítulo
                      <motion.span
                        animate={{ x: hoverStates["create-chapter"] ? 5 : 0 }}
                        transition={{ duration: 0.2 }}>
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </motion.span>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Columna lateral con información adicional */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <div className='backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 h-full'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <Info className='h-4 w-4 mr-2 text-purple-600' />
                Información del Libro
              </h2>

              <div className='space-y-6'>
                <div className='bg-purple-50/70 p-4 rounded-lg'>
                  <h3 className='text-sm font-medium text-purple-800 mb-2'>
                    Proceso de Publicación
                  </h3>
                  <ul className='space-y-3'>
                    <li className='flex items-start gap-2'>
                      <div className='bg-purple-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-purple-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Envía tu capítulo para revisión
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <div className='bg-purple-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-purple-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Recibe feedback del comité editorial
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <div className='bg-purple-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-purple-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Obtén tu certificado de publicación
                      </span>
                    </li>
                  </ul>
                </div>

                <div className='bg-yellow-50/70 p-4 rounded-lg'>
                  <h3 className='text-sm font-medium text-yellow-800 mb-2'>
                    Beneficios
                  </h3>
                  <ul className='space-y-3'>
                    <li className='flex items-start gap-2'>
                      <div className='bg-yellow-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-yellow-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        ISBN oficial reconocido
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <div className='bg-yellow-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-yellow-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Certificado de autoría
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <div className='bg-yellow-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-yellow-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Difusión internacional
                      </span>
                    </li>
                  </ul>
                </div>

                <div className='mt-6'>
                  <Button
                    variant='outline'
                    className='w-full border-purple-200 hover:bg-purple-50 hover:text-purple-700'
                    onClick={() => window.open("/faq", "_blank")}>
                    <Info className='mr-2 h-4 w-4' />
                    Preguntas Frecuentes
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
