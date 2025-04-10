"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ArrowRight,
  BookMarked,
  FileText,
  ChevronLeft,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useAvailableCredits } from "@/hooks/useAvailableCredits";
import { Breadcrumb } from "@/components/breadcrumb";
import { useUser } from "@/context/UserContext";

export type Book = {
  id: string;
  title: string;
  subtitle?: string;
  bookType: string;
  cover?: string;
  openDate?: string;
  deadlineChapters?: string;
  publishDate?: string;
  isbn?: string | null;
  interests?: string;
  description?: string;
  status: string;
  active: number;
  price?: number;
  authorId?: string;
  editionId?: string;
  createdAt: string;
  updatedAt: string;
};

export type Edition = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
};

interface EditionBooksPageProps {
  initialBooks: Book[];
  initialEdition: Edition;
}

export default function EditionBooksPage({
  initialBooks,
  initialEdition,
}: EditionBooksPageProps) {
  // (Si necesitas validar editionId desde la URL, lo puedes hacer también)
  const { id: editionId } = useParams();

  const router = useRouter();
  const { user } = useUser();
  const userId = user?.id || null;

  // Usamos los datos iniciales que vienen por props
  const [books] = useState<Book[]>(initialBooks);
  const [edition] = useState<Edition | null>(initialEdition);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  const { availableCredits, loadingCredits } = useAvailableCredits(
    editionId as string
  );

  const handleMouseEnter = (id: string) =>
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  const handleMouseLeave = (id: string) =>
    setHoverStates((prev) => ({ ...prev, [id]: false }));

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
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

  // Si no hay libros, mostramos estado vacío
  if (!books || books.length === 0) {
    return (
      <div className='relative overflow-hidden py-8'>
        <Breadcrumb />
        <div className='container mx-auto px-4 space-y-8'>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='flex items-center justify-between'>
            <Button
              variant='ghost'
              className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50'
              onClick={() => router.push("/publications")}>
              <ChevronLeft className='mr-1 h-4 w-4' />
              Volver a Mis Publicaciones
            </Button>
            <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
              Libros de la Edición
            </div>
          </motion.div>
          <p className='text-center'>No tienes libros en esta edición.</p>
          <Button
            className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'
            onClick={() => router.push("/publications")}>
            Volver al panel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        {/* Encabezado y navegación */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <Button
            variant='ghost'
            className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50'
            onClick={() => router.push("/publications")}>
            <ChevronLeft className='mr-1 h-4 w-4' />
            Volver a Mis Publicaciones
          </Button>
          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Libros de la Edición
          </div>
        </motion.div>

        {loadingCredits ? (
          <p>Cargando créditos disponibles...</p>
        ) : (
          <p className='text-sm text-gray-600'>
            Créditos disponibles: <strong>{availableCredits}</strong>
          </p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            {edition?.title || edition?.name || "Libros de la Edición"}
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mb-4'></div>
          {edition?.description && (
            <p className='text-gray-600 max-w-2xl mx-auto'>
              {edition.description}
            </p>
          )}
        </motion.div>

        {/* Listado de libros */}
        <motion.div
          initial='hidden'
          animate='visible'
          variants={containerVariants}
          className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {books.map((book) => (
            <motion.div
              key={book.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className='group'>
              <div className='relative backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 h-full transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
                <div className='absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -z-10 group-hover:bg-purple-200 transition-colors duration-300'></div>
                <div className='flex items-center justify-between mb-4'>
                  <div className='flex items-center'>
                    <div className='bg-purple-100 p-3 rounded-full mr-3 group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110'>
                      <BookOpen className='w-5 h-5 text-purple-700' />
                    </div>
                    <h3 className='text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors'>
                      {book.title}
                    </h3>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(
                      book.status
                    )}`}>
                    {getStatusIcon(book.status)}
                    <span className='ml-1'>{book.status || "Pendiente"}</span>
                  </span>
                </div>
                {book.subtitle && book.subtitle !== "Ninguno" && (
                  <p className='text-gray-600 mb-4 italic'>{book.subtitle}</p>
                )}
                {book.description && (
                  <p className='text-gray-600 mb-6 line-clamp-2'>
                    {book.description}
                  </p>
                )}
                <div className='flex flex-col gap-3 mt-6'>
                  <Link href={`/editions/${editionId}/books/${book.id}`}>
                    <Button
                      className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-lg'
                      onMouseEnter={() =>
                        handleMouseEnter(`details-${book.id}`)
                      }
                      onMouseLeave={() =>
                        handleMouseLeave(`details-${book.id}`)
                      }>
                      <span className='flex items-center justify-center'>
                        Ver Detalles
                        <motion.span
                          animate={{
                            x: hoverStates[`details-${book.id}`] ? 5 : 0,
                          }}
                          transition={{ duration: 0.2 }}>
                          <ArrowRight className='ml-2 h-4 w-4' />
                        </motion.span>
                      </span>
                    </Button>
                  </Link>
                  <Link
                    href={`/editions/${editionId}/books/${book.id}/chapters/create`}>
                    <Button
                      variant='outline'
                      className='w-full border-purple-200 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300'
                      onMouseEnter={() =>
                        handleMouseEnter(`chapter-${book.id}`)
                      }
                      onMouseLeave={() =>
                        handleMouseLeave(`chapter-${book.id}`)
                      }>
                      <span className='flex items-center justify-center'>
                        <FileText className='mr-2 h-4 w-4' />
                        Mandar Capítulo
                        <motion.span
                          animate={{
                            x: hoverStates[`chapter-${book.id}`] ? 5 : 0,
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

        {/* Sección adicional de información sobre participación */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='mt-16 backdrop-blur-sm bg-white/60 p-8 rounded-xl shadow-lg border border-purple-100'>
          <h3 className='text-xl font-bold text-gray-900 mb-4'>
            ¿Cómo participar?
          </h3>
          <div className='grid md:grid-cols-3 gap-6 mt-6'>
            <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
              <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3'>
                <BookOpen className='h-5 w-5 text-purple-700' />
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>
                1. Elige un libro
              </h4>
              <p className='text-sm text-gray-600'>
                Selecciona el libro que mejor se adapte a tu temática de
                investigación.
              </p>
            </div>
            <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
              <div className='w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-3'>
                <FileText className='h-5 w-5 text-yellow-700' />
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>
                2. Envía tu capítulo
              </h4>
              <p className='text-sm text-gray-600'>
                Redacta y envía tu capítulo siguiendo las normas de publicación.
              </p>
            </div>
            <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
              <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3'>
                <CheckCircle className='h-5 w-5 text-green-700' />
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>
                3. Obtén tu certificado
              </h4>
              <p className='text-sm text-gray-600'>
                Una vez publicado, recibirás tu certificado oficial de autoría.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
