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
  ChevronRight,
  Settings,
  BookMarked,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Book } from "../../publications/editions/[id]/EditionBooksPage";

interface BookDetailsProps {
  params: { bookId: string };
}

export default function BookDetailsPage({ params }: BookDetailsProps) {
  const { bookId } = params;
  const [isCreator, setIsCreator] = useState(false);
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  interface Chapter {
    id: number;
    title: string;
    status: "borrador" | "aprobado" | "pendiente" | "rechazado";
  }

  const [chapters, setChapters] = useState<Chapter[]>([]);
  useEffect(() => {
    const checkIfCreator = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token");

        // Extraemos userId del payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub || payload.id;
        if (!userId) throw new Error("No userId in token");

        // Llamada al backend para traer el libro
        const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";
        const res = await fetch(`${base}/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Error al cargar el libro");

        const fetched: Book = await res.json();
        setBook(fetched);

        const resChapters = await fetch(`${base}/books/${bookId}/chapters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resChapters.ok) {
          const data: Chapter[] = await resChapters.json();
          setChapters(data);
        }

        const amAuthor = fetched.authorId === userId;

        setIsCreator(amAuthor);
      } catch (err) {
        console.error("Error verificando creator/manager:", err);
        setIsCreator(false);
      } finally {
        setLoading(false);
      }
    };

    checkIfCreator();
  }, [bookId]);
  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <span>Cargando opciones…</span>
      </div>
    );
  }
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

  const allChaptersApproved = chapters.every((ch) => ch.status === "aprobado");

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo decorativo */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-4'>
            <Link href='/books'>
              <Button
                variant='ghost'
                className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50'>
                <ArrowLeft className='mr-1 h-4 w-4' />
                Volver
              </Button>
            </Link>
          </div>
          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Libro Propio
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            {book?.title ?? "—"}
          </h1>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        <motion.div
          initial='hidden'
          animate='visible'
          variants={containerVariants}
          className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Opción de Coordinar Libro - Solo visible para el creador */}
          {isCreator && (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className='group'>
              <Link href={`/books/${bookId}/coordinate`}>
                <div className='backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 h-full transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
                  <div className='absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -z-10 group-hover:bg-purple-200 transition-colors duration-300'></div>
                  <div className='flex flex-col items-center text-center'>
                    <div className='bg-purple-100 p-4 rounded-full mb-4 group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110'>
                      <Settings className='h-8 w-8 text-purple-700' />
                    </div>
                    <h2 className='text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-2'>
                      Coordinar Libro
                    </h2>
                    <p className='text-gray-600 mb-4'>
                      Edita el título del libro y gestiona los autores
                      participantes
                    </p>
                    <div className='mt-auto pt-2'>
                      <Button
                        variant='outline'
                        className='border-purple-200 text-purple-700 hover:bg-purple-50'>
                        Gestionar
                        <ChevronRight className='ml-2 h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Pago de tasas - Visible para todos */}
          {!isCreator && (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className='group'>
              <Link href={`/books/${bookId}/payment`}>
                <div className='backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 h-full transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
                  <div className='absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -z-10 group-hover:bg-purple-200 transition-colors duration-300'></div>
                  <div className='flex flex-col items-center text-center'>
                    <div className='bg-green-100 p-4 rounded-full mb-4 group-hover:bg-green-200 transition-colors duration-300 group-hover:scale-110'>
                      <CreditCard className='h-8 w-8 text-green-700' />
                    </div>
                    <h2 className='text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-2'>
                      Pago de tasas
                    </h2>
                    <p className='text-gray-600 mb-4'>
                      Gestiona el pago de tasas para participar en la
                      publicación
                    </p>
                    <div className='mt-auto pt-2'>
                      <Button
                        variant='outline'
                        className='border-green-200 text-green-700 hover:bg-green-50'>
                        Realizar pago
                        <ChevronRight className='ml-2 h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Mis capítulos - Visible para todos */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className='group'>
            <Link href={`/books/${bookId}/my-chapters`}>
              <div className='backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 h-full transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
                <div className='absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -z-10 group-hover:bg-purple-200 transition-colors duration-300'></div>
                <div className='flex flex-col items-center text-center'>
                  <div className='bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-200 transition-colors duration-300 group-hover:scale-110'>
                    <BookMarked className='h-8 w-8 text-blue-700' />
                  </div>
                  <h2 className='text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors mb-2'>
                    Mis capítulos
                  </h2>
                  <p className='text-gray-600 mb-4'>
                    Revisa y gestiona tus capítulos enviados
                  </p>
                  <div className='mt-auto pt-2'>
                    <Button
                      variant='outline'
                      className='border-blue-200 text-blue-700 hover:bg-blue-50'>
                      Ver mis capítulos
                      <ChevronRight className='ml-2 h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Envío de capítulo - Visible para todos */}
          {book?.status === "borrador" && (
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className='group'>
              <Link href={`/books/${bookId}/submit-chapter`}>
                <div className='backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 h-full transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
                  <div className='absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -z-10 group-hover:bg-purple-200 transition-colors duration-300'></div>
                  <div className='flex flex-col items-center text-center'>
                    <div className='bg-amber-100 p-4 rounded-full mb-4 group-hover:bg-amber-200 transition-colors duration-300 group-hover:scale-110'>
                      <FileEdit className='h-8 w-8 text-amber-700' />
                    </div>
                    <h2 className='text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors mb-2'>
                      Envío de capítulo
                    </h2>
                    <p className='text-gray-600 mb-4'>
                      Envía un nuevo capítulo para su revisión y publicación
                    </p>
                    <div className='mt-auto pt-2'>
                      <Button
                        variant='outline'
                        className='border-amber-200 text-amber-700 hover:bg-amber-50'>
                        Crear capítulo
                        <ChevronRight className='ml-2 h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Cerrar libro - Solo visible para el creador */}
          {isCreator &&
            allChaptersApproved &&
            (book?.status === "borrador" || book?.status === "rechazado") && (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className='group'>
                <Link href={`/books/${bookId}/coordinate?section=close`}>
                  <div className='backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 h-full transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
                    <div className='absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -z-10 group-hover:bg-purple-200 transition-colors duration-300'></div>
                    <div className='flex flex-col items-center text-center'>
                      <div className='bg-red-100 p-4 rounded-full mb-4 group-hover:bg-red-200 transition-colors duration-300 group-hover:scale-110'>
                        <X className='h-8 w-8 text-red-700' />
                      </div>
                      <h2 className='text-xl font-bold text-gray-900 group-hover:text-red-700 transition-colors mb-2'>
                        Cerrar libro
                      </h2>
                      <p className='text-gray-600 mb-4'>
                        Finaliza el libro para su revisión y publicación
                        definitiva
                      </p>
                      <div className='mt-auto pt-2'>
                        <Button
                          variant='outline'
                          className='border-red-200 text-red-700 hover:bg-red-50'>
                          Finalizar libro
                          <ChevronRight className='ml-2 h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )}
        </motion.div>

        {/* Información adicional sobre libros propios */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='mt-16 backdrop-blur-sm bg-white/60 p-8 rounded-xl shadow-lg border border-purple-100'>
          <h3 className='text-xl font-bold text-gray-900 mb-4'>
            Información sobre libros propios
          </h3>

          <div className='grid md:grid-cols-3 gap-6 mt-6'>
            <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
              <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3'>
                <Users className='h-5 w-5 text-purple-700' />
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>
                Gestión de autores
              </h4>
              <p className='text-sm text-gray-600'>
                {isCreator
                  ? "Como creador, puedes añadir hasta 7 autores a tu libro."
                  : "Has sido invitado como coautor de este libro."}
              </p>
            </div>

            <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
              <div className='w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-3'>
                <FileText className='h-5 w-5 text-yellow-700' />
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>
                Envío de capítulos
              </h4>
              <p className='text-sm text-gray-600'>
                Cada autor puede enviar hasta 8 capítulos como autor principal e
                ilimitados como coautor.
              </p>
            </div>

            <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
              <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3'>
                <CreditCard className='h-5 w-5 text-green-700' />
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>
                Pago de tasas
              </h4>
              <p className='text-sm text-gray-600'>
                Todos los autores deben abonar la tasa correspondiente para
                aparecer en la publicación final.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
