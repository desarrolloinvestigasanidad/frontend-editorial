"use client";

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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";

/* ------------------------------------------------------------------ */
/*                                TYPES                               */
/* ------------------------------------------------------------------ */

type Book = {
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
  status: string;
  active: number;
  price?: number;
  authorId?: string;
  editionId?: string | null;
  createdAt: string;
  updatedAt: string;
};

/* ------------------------------------------------------------------ */
/*                       MAIN COMPONENT                               */
/* ------------------------------------------------------------------ */

export default function PublicationsPage() {
  const { user } = useUser();
  const userId = user?.id ?? null;

  /* ------------------------------ state ---------------------------- */
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});
  const [statusFilter, setStatusFilter] = useState<
    "all" | "publicado" | "en proceso" | "desarrollo"
  >("all");

  /* ----------------------------- fetch ----------------------------- */
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token || !userId) throw new Error("No token o userId");

        const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";
        const headers = { Authorization: `Bearer ${token}` };

        // 1️⃣ Libros propios
        const ownRes = await fetch(`${base}/books?userId=${userId}`, {
          headers,
        });
        if (!ownRes.ok) throw new Error("Error al obtener libros propios");
        const ownData: Book[] = await ownRes.json();

        // 2️⃣ Libros como coautor
        const coRes = await fetch(`${base}/books/coauthor?userId=${userId}`, {
          headers,
        });
        if (!coRes.ok) throw new Error("Error al obtener libros de coautor");
        const coData: Book[] = await coRes.json();

        // 3️⃣ Unir sin duplicados
        const allBooksMap = new Map<string, Book>();
        ownData.forEach((b) => allBooksMap.set(b.id, b));
        coData.forEach((b) => allBooksMap.set(b.id, b));

        setBooks(Array.from(allBooksMap.values()));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [userId]);

  /* --------------------------- filters ----------------------------- */
  // 1. Solo libros propios (sin editionId)
  const ownBooks = useMemo(
    () =>
      books.filter(
        (b) =>
          !b.editionId &&
          (b.bookType?.toLowerCase() === "libro propio" || !b.bookType)
      ),
    [books]
  );

  // 2. Filtro por estado + búsqueda
  const filteredBooks = useMemo(() => {
    return ownBooks
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
  }, [ownBooks, statusFilter, searchTerm]);

  /* --------------------------- helpers ----------------------------- */
  const handleMouseEnter = (id: string) =>
    setHoverStates((s) => ({ ...s, [id]: true }));
  const handleMouseLeave = (id: string) =>
    setHoverStates((s) => ({ ...s, [id]: false }));

  const getStatusIcon = (s: string) => {
    switch (s?.toLowerCase()) {
      case "publicado":
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case "desarrollo":
      case "en proceso":
        return <Clock className='h-5 w-5 text-yellow-500' />;
      default:
        return <AlertCircle className='h-5 w-5 text-gray-400' />;
    }
  };
  const getStatusColor = (s: string) => {
    switch (s?.toLowerCase()) {
      case "publicado":
        return "bg-green-100 text-green-800";
      case "desarrollo":
      case "en proceso":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "No disponible";

  /* ---------------------------- render ----------------------------- */
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
      {/* Fondo decorativo */}
      <BackgroundBlobs />

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        {/* Cabecera */}
        <HeaderSection />

        {/* Título y subtítulo */}
        <TitleSection />

        {/* Buscador + botón crear */}
        <SearchAndCreate
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Botonera de filtros por estado */}
        <StatusFilterButtons
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Grid de libros o estado vacío */}
        {filteredBooks.length ? (
          <BookGrid
            books={filteredBooks}
            hoverStates={hoverStates}
            handleMouseEnter={handleMouseEnter}
            handleMouseLeave={handleMouseLeave}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        ) : (
          <EmptyState searchTerm={searchTerm} />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*             COMPONENTES AUXILIARES SEPARADOS                       */
/* ------------------------------------------------------------------ */

function BackgroundBlobs() {
  return (
    <div className='absolute inset-0 z-0'>
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
      <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
      <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
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
    <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
      Mis Publicaciones
    </span>
  </motion.div>
);

const TitleSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className='text-center mb-8'>
    <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
      Mis Libros Personalizados
    </h2>
    <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mb-4'></div>
    <p className='text-gray-600 max-w-2xl mx-auto'>
      Gestiona aquí los libros que has creado
    </p>
  </motion.div>
);

function SearchAndCreate({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
      <div className='relative w-full md:w-auto flex-1 max-w-md'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
        <Input
          placeholder='Buscar publicaciones...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200'
        />
      </div>

      <Link href='/create-book'>
        <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
          <BookOpen className='mr-2 h-4 w-4' />
          Crear libro
        </Button>
      </Link>
    </motion.div>
  );
}

function StatusFilterButtons({
  statusFilter,
  setStatusFilter,
}: {
  statusFilter: string;
  setStatusFilter: (
    v: "all" | "publicado" | "en proceso" | "desarrollo"
  ) => void;
}) {
  const btnClass = (active: boolean) =>
    `text-sm px-3 py-1 rounded-full border transition
     ${
       active
         ? "bg-purple-600 text-white border-purple-600"
         : "bg-white/70 text-gray-600 border-gray-200 hover:bg-purple-50"
     }`;

  return (
    <div className='flex flex-wrap gap-2 mb-4'>
      {[
        { key: "all", label: "Todos" },
        { key: "publicado", label: "Publicado" },
        { key: "en proceso", label: "En proceso" },
        { key: "desarrollo", label: "Desarrollo" },
      ].map(({ key, label }) => (
        <button
          key={key}
          className={btnClass(statusFilter === key)}
          onClick={() => setStatusFilter(key as any)}>
          {label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*              GRID DE LIBROS Y ESTADO VACÍO                          */
/* ------------------------------------------------------------------ */

interface BookGridProps {
  books: Book[];
  hoverStates: Record<string, boolean>;
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: (id: string) => void;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusColor: (status: string) => string;
  formatDate: (dateString?: string) => string;
}

function BookGrid({
  books,
  hoverStates,
  handleMouseEnter,
  handleMouseLeave,
  getStatusIcon,
  getStatusColor,
  formatDate,
}: BookGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
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
            <div className='flex items-center mb-4'>
              <div className='bg-purple-100 p-3 rounded-full mr-3 group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110'>
                <BookOpen className='w-5 h-5 text-purple-700' />
              </div>
              <h3 className='text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-2'>
                {book.title}
              </h3>
            </div>

            {book.subtitle && book.subtitle !== "Ninguno" && (
              <p className='text-gray-600 mb-4 italic'>{book.subtitle}</p>
            )}

            <div className='flex items-center gap-2 mb-4'>
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(
                  book.status
                )}`}>
                {getStatusIcon(book.status)}
                <span className='ml-1 capitalize'>{book.status}</span>
              </span>

              {book.isbn && (
                <span className='text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800'>
                  ISBN: {book.isbn}
                </span>
              )}
            </div>

            <div className='space-y-2 mb-6'>
              {book.deadlineChapters && (
                <div className='flex items-center text-sm text-gray-600'>
                  <Clock className='h-4 w-4 mr-2 text-yellow-600' />
                  <span>Fecha límite: {formatDate(book.deadlineChapters)}</span>
                </div>
              )}

              {book.publishDate && (
                <div className='flex items-center text-sm text-gray-600'>
                  <Calendar className='h-4 w-4 mr-2 text-green-600' />
                  <span>Publicación: {formatDate(book.publishDate)}</span>
                </div>
              )}
            </div>

            <div className='mt-auto pt-4'>
              <Link href={`/books/${book.id}`}>
                <Button
                  className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-lg'
                  onMouseEnter={() => handleMouseEnter(`book-${book.id}`)}
                  onMouseLeave={() => handleMouseLeave(`book-${book.id}`)}>
                  <span className='flex items-center justify-center'>
                    Ver detalles
                    <motion.span
                      animate={{
                        x: hoverStates[`book-${book.id}`] ? 5 : 0,
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
  );
}

/* ------------------------------ Empty ----------------------------- */

interface EmptyStateProps {
  type?: string;
  searchTerm: string;
}

function EmptyState({ type = "", searchTerm }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 text-center'>
      <div className='flex flex-col items-center justify-center p-8'>
        <BookOpen className='w-16 h-16 text-purple-300 mb-4' />
        {searchTerm ? (
          <>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              No se encontraron resultados
            </h3>
            <p className='text-gray-500 mb-6'>
              No hay libros que coincidan con "{searchTerm}"
            </p>
          </>
        ) : (
          <>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              {type ? `No tienes libros ${type} todavía` : "No tienes libros"}
            </h3>
            <p className='text-gray-500 mb-6'>
              Comienza creando tu primer libro personalizado
            </p>
          </>
        )}
        <Link href='/create-book'>
          <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
            <BookOpen className='mr-2 h-4 w-4' />
            Crear libro
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
