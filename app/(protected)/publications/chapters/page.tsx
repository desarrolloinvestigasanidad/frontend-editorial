"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Edit3,
  MessageCircleWarning, // Added for rejection reason icon (optional)
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";
import { useUser } from "@/context/UserContext";

/* ------------------------------------------------------------------ */
/* TYPES                                  */
/* ------------------------------------------------------------------ */
export type Chapter = {
  id: string;
  title: string;
  status: string; // "pendiente", "aprobado", "rechazado"
  createdAt: string;
  editionId: string | null;
  bookId: string;
  bookTitle: string;
  editionTitle?: string;
  rejectionReason?: string | null; // Added for rejection reason
};

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT                             */
/* ------------------------------------------------------------------ */
export default function OwnChaptersPage() {
  const { user } = useUser();
  const userId = user?.id ?? null;

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pendiente" | "aprobado" | "rechazado"
  >("all");
  const [bookTypeFilter, setBookTypeFilter] = useState<
    "all" | "personalizado" | "edicion"
  >("all");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  /* ----------------------------- fetch ----------------------------- */
  useEffect(() => {
    async function fetchChaptersWithNames() {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);

        // 1) Trae los capítulos “pelados”
        const chaptersRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chapters?authorId=${userId}`
        );
        if (!chaptersRes.ok) throw new Error("Error al obtener los capítulos");
        // The API should return the rejectionReason field directly
        const chaptersData: Omit<Chapter, "bookTitle" | "editionTitle">[] =
          await chaptersRes.json();

        // 2) Extrae los IDs únicos
        const bookIds = Array.from(
          new Set(chaptersData.map((ch) => ch.bookId))
        );
        const editionIds = Array.from(
          new Set(
            chaptersData
              .map((ch) => ch.editionId)
              .filter((id): id is string => id !== null)
          )
        );

        // 3) Pide una sola vez cada libro y edición
        const booksFetch = Promise.all(
          bookIds.map((id) =>
            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/books/${id}`).then(
              (r) => {
                if (!r.ok) throw new Error(`Libro no encontrado: ${id}`);
                return r.json();
              }
            )
          )
        );
        const editionsFetch =
          editionIds.length > 0
            ? Promise.all(
                editionIds.map((id) =>
                  fetch(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${id}`
                  ).then((r) => {
                    if (!r.ok) throw new Error(`Edición no encontrada: ${id}`);
                    return r.json();
                  })
                )
              )
            : Promise.resolve([]);

        const [books, editions] = await Promise.all([
          booksFetch,
          editionsFetch,
        ]);

        // 4) Construye mapas de id → título
        const bookMap = new Map(books.map((b) => [b.id, b.title]));
        const editionMap = new Map(editions.map((e) => [e.id, e.title]));

        // 5) Enriquecer cada capítulo con bookTitle y editionTitle
        // The rejectionReason should already be part of chaptersData
        const enriched: Chapter[] = chaptersData.map((ch) => ({
          ...ch,
          bookTitle: bookMap.get(ch.bookId) || "Título de libro no disponible",
          editionTitle:
            ch.editionId != null
              ? editionMap.get(ch.editionId) ||
                "Título de edición no disponible"
              : undefined,
        }));

        setChapters(enriched);
      } catch (err) {
        console.error("Error detallado al cargar capítulos:", err);
        // Potentially set an error state here to show in UI
      } finally {
        setLoading(false);
      }
    }

    fetchChaptersWithNames();
  }, [userId]);

  /* --------------------------- filters ----------------------------- */
  const filteredChapters = useMemo(() => {
    return chapters
      .filter((ch) => ch.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((ch) =>
        statusFilter === "all" ? true : ch.status.toLowerCase() === statusFilter
      )
      .filter((ch) => {
        if (bookTypeFilter === "all") return true;
        if (bookTypeFilter === "edicion") return ch.editionId !== null;
        return ch.editionId === null; // personalizado
      });
  }, [chapters, searchTerm, statusFilter, bookTypeFilter]);

  /* --------------------------- helpers ----------------------------- */
  const btnClass = (active: boolean) =>
    `text-sm px-3 py-1 rounded-full border transition ${
      active
        ? "bg-purple-600 text-white border-purple-600"
        : "bg-white/70 text-gray-600 border-gray-200 hover:bg-purple-50 hover:border-purple-300"
    }`;

  const getStatusIcon = (s: string) => {
    switch (s.toLowerCase()) {
      case "aprobado":
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case "pendiente":
        return <Clock className='h-5 w-5 text-yellow-500' />;
      default: // rechazado
        return <AlertCircle className='h-5 w-5 text-red-500' />;
    }
  };
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "aprobado":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      default: // rechazado
        return "bg-red-100 text-red-800";
    }
  };
  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Fecha inválida";
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        {" "}
        {/* Changed to h-screen for full page loading */}
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <Clock className='h-8 w-8 text-purple-500' />{" "}
            {/* Slightly larger icon */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8 min-h-screen'>
      {" "}
      {/* Ensure it takes at least screen height */}
      <BackgroundBlobs />
      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <HeaderSection
          // Pass either the first chapter's details or undefined if no chapters
          bookId={chapters.length > 0 ? chapters[0].bookId : undefined}
          bookTitle={chapters.length > 0 ? chapters[0].bookTitle : undefined}
          editionId={chapters.length > 0 ? chapters[0].editionId : undefined}
          editionTitle={
            chapters.length > 0 ? chapters[0].editionTitle : undefined
          }
        />

        <TitleSection />

        <SearchAndFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          bookTypeFilter={bookTypeFilter}
          setBookTypeFilter={setBookTypeFilter}
          btnClass={btnClass}
        />

        {filteredChapters.length > 0 ? (
          <ChapterGrid
            chapters={filteredChapters}
            hoverStates={hoverStates}
            setHoverStates={setHoverStates}
            getStatusIcon={getStatusIcon}
            getStatusColor={getStatusColor}
            formatDate={formatDate}
          />
        ) : (
          <EmptyState
            searchTerm={searchTerm}
            hasChapters={chapters.length > 0}
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
      {" "}
      {/* pointer-events-none to prevent interference */}
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50' />{" "}
      {/* Adjusted gradient */}
      <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob' />
      <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000' />
      <div className='absolute top-1/2 right-1/3 w-56 h-56 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000' />{" "}
      {/* Added another blob */}
    </div>
  );
}

interface HeaderSectionProps {
  bookId?: string; // Optional because there might be no chapters initially
  bookTitle?: string;
  editionId?: string | null;
  editionTitle?: string;
}
function HeaderSection({
  bookId,
  bookTitle,
  editionId,
  editionTitle,
}: HeaderSectionProps) {
  // Only render breadcrumbs if there's a book context
  const showBookBreadcrumb = bookId && bookTitle;
  const showEditionBreadcrumb = showBookBreadcrumb && editionId && editionTitle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='flex items-center justify-between'>
      <nav
        aria-label='breadcrumb'
        className='flex items-center space-x-2 text-sm text-gray-600'>
        <Link
          href='/publications'
          className='hover:underline hover:text-purple-700'>
          Mis Publicaciones
        </Link>

        <span>/</span>
        <span className='font-medium text-purple-700'>Mis Capítulos</span>
      </nav>

      <span className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
        Mis Capítulos
      </span>
    </motion.div>
  );
}

const TitleSection = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className='text-center mb-8'>
    <h1 className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-3'>
      {" "}
      {/* Changed h2 to h1 for semantics, adjusted gradient */}
      Mis Capítulos
    </h1>
    <div className='w-24 h-1.5 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mb-6' />{" "}
    {/* Made underline thicker and longer */}
    <p className='text-gray-700 max-w-2xl mx-auto text-base'>
      Aquí puedes gestionar todos los capítulos que has enviado, revisar su
      estado y acceder a su contenido o edición.
    </p>
  </motion.div>
);

interface SearchAndFilterProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: "all" | "pendiente" | "aprobado" | "rechazado";
  setStatusFilter: (v: "all" | "pendiente" | "aprobado" | "rechazado") => void;
  bookTypeFilter: "all" | "personalizado" | "edicion";
  setBookTypeFilter: (v: "all" | "personalizado" | "edicion") => void;
  btnClass: (active: boolean) => string;
}

function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  bookTypeFilter,
  setBookTypeFilter,
  btnClass,
}: SearchAndFilterProps) {
  const statusOptions = [
    { key: "all", label: "Todos" },
    { key: "pendiente", label: "Pendiente" },
    { key: "aprobado", label: "Aprobado" },
    { key: "rechazado", label: "Rechazado" },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className='p-6 bg-white/70 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 space-y-4 md:space-y-0 md:flex md:flex-wrap md:items-center md:justify-between md:gap-4' // Enhanced styling
    >
      {/* Buscador */}
      <div className='relative flex-grow md:flex-grow-0 md:w-auto lg:w-1/3'>
        {" "}
        {/* Adjusted width for responsiveness */}
        <Search className='absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
        <Input
          type='search' // Use type="search" for better semantics and potential browser features
          placeholder='Buscar por título...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='pl-10 pr-4 py-2.5 border-gray-300 focus:border-purple-500 focus:ring-purple-500 focus:ring-1 rounded-lg w-full' // Enhanced styling
        />
      </div>

      {/* Filtro de Estado */}
      <div className='flex items-center space-x-2 flex-wrap gap-y-2'>
        {" "}
        {/* Allow wrapping for smaller screens */}
        <span className='whitespace-nowrap font-medium text-gray-700'>
          Estado:
        </span>
        {statusOptions.map(({ key, label }) => (
          <button
            key={key}
            type='button' // Explicitly type buttons
            className={btnClass(statusFilter === key)}
            onClick={() => setStatusFilter(key)}>
            {label}
          </button>
        ))}
      </div>

      {/* Filtro de Tipo de Libro */}
      <div>
        <Select
          value={bookTypeFilter}
          onValueChange={(val: "all" | "personalizado" | "edicion") =>
            setBookTypeFilter(val)
          }>
          <SelectTrigger className='w-full md:w-48 border-gray-300 focus:border-purple-500 focus:ring-purple-500 focus:ring-1 rounded-lg'>
            {" "}
            {/* Enhanced styling */}
            <SelectValue placeholder='Tipo de libro' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Todos los libros</SelectItem>
            <SelectItem value='personalizado'>Libro personalizado</SelectItem>
            <SelectItem value='edicion'>Libro de edición</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
}

interface ChapterGridProps {
  chapters: Chapter[];
  hoverStates: Record<string, boolean>;
  setHoverStates: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  getStatusIcon: (s: string) => JSX.Element;
  getStatusColor: (s: string) => string;
  formatDate: (d: string) => string;
}
function ChapterGrid({
  chapters,
  // hoverStates, // Removed as whileHover is used directly on motion.div
  // setHoverStates, // No longer needed if we use Framer Motion's whileHover
  getStatusIcon,
  getStatusColor,
  formatDate,
}: ChapterGridProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.2 },
    }, // Adjusted timing
  };
  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    }, // Spring animation
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={container}
      className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {" "}
      {/* Added xl breakpoint */}
      {chapters.map((ch) => (
        <motion.div
          key={ch.id}
          variants={item}
          whileHover={{ y: -6, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }} // Enhanced hover effect
          className='group flex flex-col h-full'>
          {" "}
          {/* Make card take full height if needed in grid layout */}
          <div
            // onMouseEnter={() =>
            //   setHoverStates((prev) => ({ ...prev, [ch.id]: true }))
            // } // Framer Motion's whileHover can handle this visually
            // onMouseLeave={() =>
            //   setHoverStates((prev) => ({ ...prev, [ch.id]: false }))
            // }
            className='flex-grow relative backdrop-blur-sm bg-white/80 p-5 rounded-xl shadow-lg border border-gray-200/60 transition-all duration-300 group-hover:shadow-xl group-hover:border-purple-300 flex flex-col'>
            {" "}
            {/* Enhanced styling, flex-col */}
            {/* Breadcrumb navigation */}
            <div className='flex items-center text-xs text-gray-500 mb-2 pb-2 border-b border-gray-200/80 truncate'>
              {" "}
              {/* truncate long breadcrumbs */}
              {ch.editionTitle && ch.editionId && (
                <>
                  <Link
                    href={`/editions/${ch.editionId}`}
                    className='hover:text-purple-600 hover:underline transition-colors truncate'>
                    {ch.editionTitle}
                  </Link>
                  <span className='mx-1.5'>/</span>
                </>
              )}
              <Link
                href={`/books/${ch.bookId}`}
                className='hover:text-purple-600 hover:underline transition-colors truncate'>
                {ch.bookTitle}
              </Link>
            </div>
            <div className='flex items-start justify-between mb-3'>
              {" "}
              {/* items-start for title alignment */}
              <h3 className='text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors flex-1 mr-2 break-words'>
                {" "}
                {/* break-words for long titles */}
                {ch.title}
              </h3>
              <span
                className={`text-xs px-2.5 py-1 rounded-full flex items-center font-medium shrink-0 ${getStatusColor(
                  // shrink-0 to prevent status from shrinking
                  ch.status
                )}`}>
                {getStatusIcon(ch.status)}
                <span className='ml-1.5 capitalize'>{ch.status}</span>
              </span>
            </div>
            <div className='text-gray-500 text-xs mb-3'>
              <span className='font-medium'>Creado:</span>{" "}
              {formatDate(ch.createdAt)}
            </div>
            {/* REJECTION REASON DISPLAY */}
            {ch.status.toLowerCase() === "rechazado" && ch.rejectionReason && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className='mt-1 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 overflow-hidden'>
                {" "}
                {/* Added overflow-hidden for animation */}
                <div className='flex items-start'>
                  <MessageCircleWarning className='h-5 w-5 text-red-600 mr-2 shrink-0 mt-0.5' />
                  <div>
                    <strong className='font-semibold block mb-0.5'>
                      Motivo del rechazo:
                    </strong>
                    <p className='text-red-700 text-xs leading-relaxed'>
                      {ch.rejectionReason}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            <div className='mt-auto pt-4 border-t border-gray-200/80 flex flex-col sm:flex-row justify-center items-center gap-3'>
              {" "}
              {/* Buttons at the bottom, responsive layout */}
              <Link
                href={`/books/${ch.bookId}/my-chapters/${ch.id}`}
                className='w-full sm:w-auto'>
                <Button
                  size='sm'
                  className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white transition-all duration-300 ease-in-out transform hover:scale-105'>
                  Ver Detalles
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
              <Link
                href={
                  ch.editionId
                    ? `/editions/${ch.editionId}/books/${ch.bookId}/chapters/${ch.id}/edit`
                    : `/books/${ch.bookId}/my-chapters/${ch.id}/edit`
                }
                className='w-full sm:w-auto'>
                <Button
                  size='sm'
                  variant='outline'
                  className='w-full gap-1.5 border-purple-500 text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105'>
                  <Edit3 className='h-4 w-4' />
                  Editar
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

interface EmptyStateProps {
  searchTerm: string;
  hasChapters: boolean; // New prop to differentiate between "no results for search" and "no chapters at all"
}
function EmptyState({ searchTerm, hasChapters }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='backdrop-blur-sm bg-white/80 p-8 md:p-12 rounded-2xl shadow-xl border border-white/50 text-center'>
      <div className='flex flex-col items-center justify-center'>
        <AlertCircle className='w-16 h-16 text-purple-400 mb-6' />{" "}
        {/* Enhanced styling */}
        {searchTerm && !hasChapters ? ( // This case implies filtered results are empty, but there might be chapters overall
          <>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              No se encontraron resultados
            </h3>
            <p className='text-gray-600 max-w-md mx-auto'>
              No hay capítulos que coincidan con tu búsqueda "{searchTerm}" y
              los filtros aplicados. Intenta con otros términos o ajusta los
              filtros.
            </p>
          </>
        ) : !hasChapters && !searchTerm ? ( // No chapters at all for this user
          <>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              Aún no tienes capítulos personalizados
            </h3>
            <p className='text-gray-600 mb-6 max-w-md mx-auto'>
              Parece que no has enviado ningún capítulo todavía. ¡Anímate a
              crear el primero!
            </p>
            {/* Optional: Add a button to create a new chapter if applicable */}
            {/* <Link href="/chapters/new">
                    <Button className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white'>
                        Crear mi primer capítulo
                    </Button>
                </Link> */}
          </>
        ) : (
          // Default: No results for current filters/search but chapters exist
          <>
            <h3 className='text-xl font-semibold text-gray-800 mb-2'>
              No hay capítulos que coincidan
            </h3>
            <p className='text-gray-600 max-w-md mx-auto'>
              Prueba a cambiar los filtros o el término de búsqueda "
              {searchTerm}".
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
