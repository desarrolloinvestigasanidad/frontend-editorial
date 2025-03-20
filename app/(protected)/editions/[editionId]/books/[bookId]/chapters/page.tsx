"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ChevronLeft,
  FileText,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  BookMarked,
} from "lucide-react";

export default function ChaptersPage() {
  const { editionId, bookId } = useParams();
  const router = useRouter();
  const [chapters, setChapters] = useState<any[]>([]);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch chapters
        const chaptersRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}/chapters`
        );
        const chaptersData = await chaptersRes.json();
        setChapters(chaptersData);

        // Fetch book details
        const bookRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`
        );
        if (bookRes.ok) {
          const bookData = await bookRes.json();
          setBook(bookData);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
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
            Capítulos del Libro
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            {book?.title
              ? `Capítulos de: ${book.title}`
              : "Capítulos del Libro"}
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mb-4'></div>
          {book?.description && (
            <p className='text-gray-600 max-w-2xl mx-auto'>
              {book.description}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='flex justify-end mb-6'>
          <Link href={`/editions/${editionId}/books/${bookId}/chapters/create`}>
            <Button
              className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 hover:shadow-lg'
              onMouseEnter={() => handleMouseEnter("create")}
              onMouseLeave={() => handleMouseLeave("create")}>
              <span className='flex items-center'>
                <PlusCircle className='mr-2 h-4 w-4' />
                Crear Nuevo Capítulo
                <motion.span
                  animate={{ x: hoverStates["create"] ? 5 : 0 }}
                  transition={{ duration: 0.2 }}>
                  <ArrowRight className='ml-2 h-4 w-4' />
                </motion.span>
              </span>
            </Button>
          </Link>
        </motion.div>

        {chapters.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 text-center'>
            <div className='flex flex-col items-center justify-center p-8'>
              <BookMarked className='w-16 h-16 text-purple-300 mb-4' />
              <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                No hay capítulos en este libro
              </h3>
              <p className='text-gray-500 mb-6'>
                Sé el primero en contribuir con un capítulo a este libro
              </p>
              <Link
                href={`/editions/${editionId}/books/${bookId}/chapters/create`}>
                <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
                  <PlusCircle className='mr-2 h-4 w-4' />
                  Crear mi primer capítulo
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {chapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className='group'>
                <div className='relative backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 h-full transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
                  <div className='absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -z-10 group-hover:bg-purple-200 transition-colors duration-300'></div>

                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center'>
                      <div className='bg-purple-100 p-3 rounded-full mr-3 group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110'>
                        <FileText className='w-5 h-5 text-purple-700' />
                      </div>
                      <h3 className='text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-1'>
                        {chapter.title}
                      </h3>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(
                        chapter.status
                      )}`}>
                      {getStatusIcon(chapter.status)}
                      <span className='ml-1'>
                        {chapter.status || "Pendiente"}
                      </span>
                    </span>
                  </div>

                  {chapter.authorName && (
                    <p className='text-sm text-gray-600 mb-3'>
                      <span className='font-medium'>Autor:</span>{" "}
                      {chapter.authorName}
                    </p>
                  )}

                  {chapter.introduction && (
                    <p className='text-gray-600 mb-6 line-clamp-3'>
                      {chapter.introduction}
                    </p>
                  )}

                  <div className='mt-auto pt-4'>
                    <Link
                      href={`/editions/${editionId}/books/${bookId}/chapters/${chapter.id}`}>
                      <Button
                        className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-lg'
                        onMouseEnter={() =>
                          handleMouseEnter(`chapter-${chapter.id}`)
                        }
                        onMouseLeave={() =>
                          handleMouseLeave(`chapter-${chapter.id}`)
                        }>
                        <span className='flex items-center justify-center'>
                          Ver Detalle
                          <motion.span
                            animate={{
                              x: hoverStates[`chapter-${chapter.id}`] ? 5 : 0,
                            }}
                            transition={{ duration: 0.2 }}>
                            <ArrowRight className='ml-2 h-4 w-4' />
                          </motion.span>
                        </span>
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {chapters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='mt-16 backdrop-blur-sm bg-white/60 p-8 rounded-xl shadow-lg border border-purple-100'>
            <h3 className='text-xl font-bold text-gray-900 mb-4'>
              Estado de los capítulos
            </h3>

            <div className='grid md:grid-cols-3 gap-6 mt-6'>
              <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
                <div className='w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-3'>
                  <Clock className='h-5 w-5 text-yellow-700' />
                </div>
                <h4 className='font-semibold text-gray-900 mb-2'>Pendiente</h4>
                <p className='text-sm text-gray-600'>
                  Tu capítulo está siendo revisado por nuestro comité editorial.
                </p>
              </div>

              <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
                <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3'>
                  <CheckCircle className='h-5 w-5 text-green-700' />
                </div>
                <h4 className='font-semibold text-gray-900 mb-2'>Aprobado</h4>
                <p className='text-sm text-gray-600'>
                  Tu capítulo ha sido aprobado y será incluido en la
                  publicación.
                </p>
              </div>

              <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
                <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mb-3'>
                  <AlertCircle className='h-5 w-5 text-red-700' />
                </div>
                <h4 className='font-semibold text-gray-900 mb-2'>Rechazado</h4>
                <p className='text-sm text-gray-600'>
                  Tu capítulo necesita modificaciones. Revisa los comentarios
                  del comité.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
