"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  PlusCircle,
  MessageCircleWarning,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

/* ------------------------------------------------------------------ */
/* TYPES                                  */
/* ------------------------------------------------------------------ */

type Book = {
  id: string;
  title: string;
  subtitle?: string;
  bookType: string;
  cover?: string;
  documentUrl?: string;
  openDate?: string;
  deadlineChapters?: string;
  publishDate?: string;
  isbn?: string | null;
  interests?: string;
  status: string;
  active: number;
  price?: number;
  authorId?: string;
  editionId?: string | null;
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string | null;
};

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT                             */
/* ------------------------------------------------------------------ */

export default function PublicationsPage() {
  const { user } = useUser();
  const userId = user?.id ?? null;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "publicado" | "pendiente" | "borrador" | "aprobado" | "rechazado"
  >("all");

  useEffect(() => {
    const fetchBooks = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Token de autenticación no encontrado");

        const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";
        const headers = { Authorization: `Bearer ${token}` };

        // 1. Obtener solo los libros donde el usuario es el autor principal
        const ownRes = await fetch(`${base}/books?userId=${userId}`, {
          headers,
        });
        if (!ownRes.ok)
          throw new Error(
            `Error al obtener libros propios: ${ownRes.statusText}`
          );

        // Filtra para excluir ediciones, si es necesario para los libros propios
        const ownData: Book[] = (await ownRes.json()).filter(
          (book: Book) => !book.editionId
        );

        // --- SECCIÓN DE COAUTOR ELIMINADA ---
        // La siguiente sección que obtenía coAuthoredRes y coAuthoredData ha sido eliminada.
        /*
        const coAuthoredRes = await fetch(
          `${base}/books/coauthor?userId=${userId}`,
          { headers }
        );
        let coAuthoredData: Book[] = [];
        if (coAuthoredRes.ok) {
          coAuthoredData = (await coAuthoredRes.json()).filter(
            (book: Book) => !book.editionId
          );
        } else {
          console.warn(
            "Error al obtener libros de coautor, continuando sin ellos."
          );
        }
        */

        // 2. Establecer el estado 'books' solo con los libros propios.
        // Si ownData ya es una lista de libros únicos y no necesitas la lógica del Map para deduplicar
        // (porque solo hay una fuente de datos), puedes hacer directamente:
        // setBooks(ownData);
        // O, para mantener una estructura similar por si se reintroduce otra fuente en el futuro
        // o para asegurar unicidad si la API pudiera devolver duplicados para authorId:
        const booksMap = new Map<string, Book>();
        ownData.forEach((b) => booksMap.set(b.id, b));
        setBooks(Array.from(booksMap.values()));
      } catch (err) {
        console.error("Error detallado al cargar publicaciones:", err);
        setBooks([]); // Es buena práctica limpiar los libros en caso de error
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [userId]); // El efecto depende de userId

  const personalBooks = useMemo(
    () =>
      books.filter(
        (b) =>
          !b.editionId &&
          (b.bookType?.toLowerCase() === "libro propio" || !b.bookType)
      ),
    [books]
  );

  const filteredPersonalBooks = useMemo(() => {
    return personalBooks
      .filter(
        (b) =>
          (statusFilter === "all" ||
            b.status?.toLowerCase() === statusFilter) &&
          b.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [personalBooks, statusFilter, searchTerm]);

  const getStatusIcon = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "publicado":
        return <CheckCircle className='h-4 w-4 text-green-600' />;
      case "aprobado":
        return <CheckCircle className='h-4 w-4 text-blue-600' />;
      case "rechazado":
        return <AlertCircle className='h-4 w-4 text-red-600' />;
      case "borrador":
      case "pendiente":
        return <Clock className='h-4 w-4 text-yellow-600' />;
      default:
        return <AlertCircle className='h-4 w-4 text-gray-500' />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "publicado":
        return "bg-green-100 text-green-800 border-green-200";
      case "aprobado":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "rechazado":
        return "bg-red-100 text-red-800 border-red-200";
      case "borrador":
      case "pendiente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      console.warn("Invalid date string:", dateString);
      return "Fecha inválida";
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='relative'>
          <div className='h-20 w-20 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <BookOpen className='h-10 w-10 text-purple-600' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8 min-h-screen'>
      <BackgroundBlobs />
      <div className='container mx-auto px-4 relative z-10 space-y-10'>
        <HeaderSection />
        <TitleSection />

        {/* BARRA DE ACCIONES Y FILTROS UNIFICADA */}
        <PublicationActionsBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {filteredPersonalBooks.length > 0 ? (
          <BookGrid
            books={filteredPersonalBooks}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        ) : (
          <EmptyState
            searchTerm={searchTerm}
            hasBooks={personalBooks.length > 0}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* COMPONENTES AUXILIARES SEPARADOS                    */
/* ------------------------------------------------------------------ */

function BackgroundBlobs() {
  return (
    <div className='absolute inset-0 z-0 pointer-events-none'>
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50' />
      <div className='absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob' />
      <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000' />
      <div className='absolute top-1/3 right-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-4000' />
    </div>
  );
}

const HeaderSection = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className='flex items-center justify-between'>
    <Breadcrumb />
    <span className='inline-block text-sm font-semibold py-1.5 px-4 rounded-full bg-purple-100 text-purple-700 shadow-sm'>
      Mis Publicaciones
    </span>
  </motion.div>
);

const TitleSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className='text-center pt-4 pb-2'>
    <h1 className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 mb-3'>
      Mis Libros Personalizados
    </h1>
    <div className='w-28 h-1.5 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mb-6' />
    <p className='text-gray-700 max-w-2xl mx-auto text-base md:text-lg'>
      Gestiona, edita y revisa el estado de todos los libros que has creado o en
      los que colaboras.
    </p>
  </motion.div>
);

// NUEVO COMPONENTE UNIFICADO PARA ACCIONES Y FILTROS
interface PublicationActionsBarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter:
    | "all"
    | "publicado"
    | "pendiente"
    | "borrador"
    | "aprobado"
    | "rechazado";
  setStatusFilter: (
    v: "all" | "publicado" | "pendiente" | "borrador" | "aprobado" | "rechazado"
  ) => void;
}

function PublicationActionsBar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: PublicationActionsBarProps) {
  const btnClass = (active: boolean) =>
    `text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border font-medium transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 whitespace-nowrap ${
      active
        ? "bg-purple-600 text-white border-purple-700 shadow-md"
        : "bg-white/80 text-gray-700 border-gray-300 hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700"
    }`;

  const filters = [
    { key: "all", label: "Todos" },
    { key: "borrador", label: "Borrador" },
    { key: "pendiente", label: "Pendiente" },
    { key: "aprobado", label: "Aprobado" },
    { key: "rechazado", label: "Rechazado" },
    { key: "publicado", label: "Publicado" },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className='p-4 sm:p-5 bg-white/70 backdrop-blur-md rounded-xl shadow-lg border border-gray-200/50 space-y-4'>
      {/* Fila superior para Búsqueda y Botón Crear */}
      <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
        <div className='relative w-full sm:flex-1 max-w-md'>
          <Search className='absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
          <Input
            type='search'
            placeholder='Buscar por título de libro...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 border-gray-300 focus:border-purple-500 focus:ring-purple-500 focus:ring-1 rounded-lg shadow-sm'
          />
        </div>
        <Link href='/create-book' className='w-full sm:w-auto'>
          <Button
            size='default'
            className='w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-2 py-2.5'>
            <PlusCircle className='h-5 w-5' />
            Crear Libro
          </Button>
        </Link>
      </div>

      {/* Fila inferior para Filtros de Estado */}
      <div className='border-t border-gray-200/80 pt-4 mt-4'>
        <div className='flex items-center gap-x-2 gap-y-2 overflow-x-auto pb-2'>
          <span className='text-sm font-medium text-gray-700 mr-2 shrink-0'>
            Filtrar por estado:
          </span>
          {filters.map(({ key, label }) => (
            <button
              key={key}
              type='button'
              className={btnClass(statusFilter === key)}
              onClick={() => setStatusFilter(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* GRID DE LIBROS Y ESTADO VACÍO                             */
/* ------------------------------------------------------------------ */

interface BookGridProps {
  books: Book[];
  getStatusIcon: (status?: string) => JSX.Element;
  getStatusColor: (status?: string) => string;
  formatDate: (dateString?: string) => string;
}

function BookGrid({
  books,
  getStatusIcon,
  getStatusColor,
  formatDate,
}: BookGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 25, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 90, damping: 15 },
    },
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3'>
      {" "}
      {/* Ajustado lg:grid-cols-3 */}
      {books.map((book) => (
        <motion.div
          key={book.id}
          variants={itemVariants}
          whileHover={{
            y: -8,
            boxShadow:
              "0 12px 25px rgba(0,0,0,0.12), 0 5px 10px rgba(0,0,0,0.08)",
          }}
          className='group flex flex-col h-full'>
          <div className='flex-grow relative backdrop-blur-sm bg-white/85 p-6 rounded-xl shadow-lg border border-gray-200/60 transition-all duration-300 group-hover:shadow-2xl group-hover:border-purple-300/70 flex flex-col'>
            <div className='flex items-start mb-3'>
              <div className='bg-gradient-to-br from-purple-100 to-indigo-100 p-3 rounded-lg mr-4 mt-1 shadow-sm group-hover:scale-105 group-hover:shadow-md transition-all duration-300'>
                <BookOpen className='w-6 h-6 text-purple-600' />
              </div>
              <div className='flex-1'>
                <h3 className='text-xl font-semibold text-gray-800 group-hover:text-purple-700 transition-colors duration-300 line-clamp-2 leading-tight'>
                  {book.title}
                </h3>
                {book.subtitle && book.subtitle !== "Ninguno" && (
                  <p className='text-sm text-gray-500 mt-1 line-clamp-2'>
                    {book.subtitle}
                  </p>
                )}
              </div>
            </div>

            <div
              className={`text-xs px-3 py-1.5 rounded-full font-medium inline-flex items-center gap-2 mb-4 self-start border ${getStatusColor(
                book.status
              )}`}>
              {getStatusIcon(book.status)}
              <span className='capitalize'>{book.status}</span>
            </div>

            {book.status?.toLowerCase() === "rechazado" &&
              book.rejectionReason && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                  className='my-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 overflow-hidden'>
                  <div className='flex items-start'>
                    <MessageCircleWarning className='h-5 w-5 text-red-600 mr-2 shrink-0 mt-0.5' />
                    <div>
                      <strong className='font-semibold block mb-0.5'>
                        Motivo del rechazo:
                      </strong>
                      <p className='text-red-700 text-xs leading-relaxed'>
                        {book.rejectionReason}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

            <div className='space-y-2.5 text-sm mb-5 border-t border-b border-gray-200/70 py-4 my-3'>
              {book.isbn && (
                <div className='flex items-center text-gray-600'>
                  <span className='font-medium w-32 shrink-0'>ISBN:</span>
                  <span className='text-gray-800'>{book.isbn}</span>
                </div>
              )}
              {book.deadlineChapters && (
                <div className='flex items-center text-gray-600'>
                  <Clock className='h-4 w-4 mr-2 text-amber-600 shrink-0' />
                  <span className='font-medium w-32 shrink-0'>
                    Límite Capítulos:
                  </span>
                  <span className='text-gray-800'>
                    {formatDate(book.deadlineChapters)}
                  </span>
                </div>
              )}
              {book.publishDate && (
                <div className='flex items-center text-gray-600'>
                  <Calendar className='h-4 w-4 mr-2 text-green-600 shrink-0' />
                  <span className='font-medium w-32 shrink-0'>
                    Publicación:
                  </span>
                  <span className='text-gray-800'>
                    {formatDate(book.publishDate)}
                  </span>
                </div>
              )}
            </div>

            <div className='mt-auto pt-4'>
              <Link href={`/books/${book.id}`} className='block'>
                <Button
                  variant='default'
                  size='lg'
                  className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300 ease-in-out transform group-hover:scale-105 group-hover:shadow-lg flex items-center justify-center gap-2 shadow-md'>
                  Ver Detalles
                  <ArrowRight className='h-5 w-5 transition-transform duration-300 group-hover:translate-x-1' />
                </Button>
              </Link>
              {book.documentUrl && (
                <a
                  href={book.documentUrl}
                  target='_blank' // Abrir en una nueva pestaña
                  rel='noopener noreferrer' // Buenas prácticas de seguridad para target="_blank"
                  className='block'>
                  <Button
                    variant='outline' // Un estilo diferente para distinguirlo
                    size='lg'
                    className='w-full border-purple-600 text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300 ease-in-out transform group-hover:scale-105 group-hover:shadow-lg flex items-center justify-center gap-2 shadow-md'>
                    Ver Libro Generado
                    <ExternalLink className='h-5 w-5' />
                  </Button>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

interface EmptyStateProps {
  searchTerm: string;
  hasBooks: boolean;
}
function EmptyState({ searchTerm, hasBooks }: EmptyStateProps) {
  const message = !hasBooks
    ? "Aún no tienes libros personalizados. ¡Anímate a crear el primero!"
    : "No se encontraron libros que coincidan con tu búsqueda o filtros aplicados.";

  const title = !hasBooks
    ? "No Tienes Libros Personalizados"
    : "No se Encontraron Resultados";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, type: "spring" }}
      className='backdrop-blur-lg bg-white/80 p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200/50 text-center flex flex-col items-center justify-center min-h-[400px]'>
      <BookOpen className='w-20 h-20 text-purple-400 mb-8' />
      <h3 className='text-2xl font-semibold text-gray-800 mb-3'>
        {searchTerm && hasBooks ? `Sin resultados para "${searchTerm}"` : title}
      </h3>
      <p className='text-gray-600 mb-8 max-w-lg mx-auto text-lg leading-relaxed'>
        {searchTerm && hasBooks
          ? `Intenta ajustar tu búsqueda o cambiar los filtros.`
          : message}
      </p>
      <Link href='/create-book'>
        <Button
          size='lg'
          className='bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:shadow-xl px-8 py-3 text-base'>
          <PlusCircle className='mr-2.5 h-5 w-5' />
          Crear Nuevo Libro
        </Button>
      </Link>
    </motion.div>
  );
}
