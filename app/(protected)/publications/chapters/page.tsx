"use client";

import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  ChevronLeft,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
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
/*                                TYPES                               */
/* ------------------------------------------------------------------ */
export type Chapter = {
  id: string;
  title: string;
  status: string; // "pendiente", "aprobado", "rechazado"
  createdAt: string;
  editionId: string | null;
  bookId: string;
};

/* ------------------------------------------------------------------ */
/*                       MAIN COMPONENT                               */
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
    async function fetchChapters() {
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/chapters?authorId=${userId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al obtener los capítulos");
        const data: Chapter[] = await res.json();
        setChapters(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (userId) {
      setLoading(true);
      fetchChapters();
    }
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
        return ch.editionId === null;
      });
  }, [chapters, searchTerm, statusFilter, bookTypeFilter]);

  /* --------------------------- helpers ----------------------------- */
  const btnClass = (active: boolean) =>
    `text-sm px-3 py-1 rounded-full border transition ${
      active
        ? "bg-purple-600 text-white border-purple-600"
        : "bg-white/70 text-gray-600 border-gray-200 hover:bg-purple-50"
    }`;

  const getStatusIcon = (s: string) => {
    switch (s.toLowerCase()) {
      case "aprobado":
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case "pendiente":
        return <Clock className='h-5 w-5 text-yellow-500' />;
      default:
        return <AlertCircle className='h-5 w-5 text-red-500' />;
    }
  };
  const getStatusColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "aprobado":
        return "bg-green-100 text-green-800";
      case "pendiente":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <Clock className='h-6 w-6 text-purple-500' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      <BackgroundBlobs />

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <HeaderSection />

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
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white' />
      <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob' />
      <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000' />
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
      Mis Capítulos
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
      Capítulos Personalizados
    </h2>
    <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mb-4' />
    <p className='text-gray-600 max-w-2xl mx-auto'>
      Gestiona aquí los capítulos que has enviado
    </p>
  </motion.div>
);

function SearchAndFilter({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  bookTypeFilter,
  setBookTypeFilter,
  btnClass,
}: {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  statusFilter: "all" | "pendiente" | "aprobado" | "rechazado";
  setStatusFilter: (v: "all" | "pendiente" | "aprobado" | "rechazado") => void;
  bookTypeFilter: "all" | "personalizado" | "edicion";
  setBookTypeFilter: (v: "all" | "personalizado" | "edicion") => void;
  btnClass: (active: boolean) => string;
}) {
  return (
    <div className='space-y-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='flex flex-col md:flex-row md:items-center md:justify-center md:space-x-6'>
        {/* Buscador */}
        <div className='relative w-full md:w-1/3 mb-4 md:mb-0'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
          <Input
            placeholder='Buscar capítulos...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200'
          />
        </div>

        {/* Filtro de Estado */}
        <div className='flex items-center space-x-2'>
          <span className='whitespace-nowrap font-medium'>Estado:</span>
          {(
            [
              { key: "all", label: "Todos" },
              { key: "pendiente", label: "Pendiente" },
              { key: "aprobado", label: "Aprobado" },
              { key: "rechazado", label: "Rechazado" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
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
            onValueChange={(val) => setBookTypeFilter(val as any)}>
            <SelectTrigger className='w-40'>
              <SelectValue placeholder='Todos los libros' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Todos los libros</SelectItem>
              <SelectItem value='personalizado'>Libro personalizado</SelectItem>
              <SelectItem value='edicion'>Libro de edición</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>
    </div>
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
  hoverStates,
  setHoverStates,
  getStatusIcon,
  getStatusColor,
  formatDate,
}: ChapterGridProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={container}
      className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {chapters.map((ch) => (
        <motion.div
          key={ch.id}
          variants={item}
          whileHover={{ y: -5 }}
          className='group'>
          <div
            onMouseEnter={() =>
              setHoverStates((prev) => ({ ...prev, [ch.id]: true }))
            }
            onMouseLeave={() =>
              setHoverStates((prev) => ({ ...prev, [ch.id]: false }))
            }
            className='relative backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-xl font-bold'>{ch.title}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(
                  ch.status
                )}`}>
                {getStatusIcon(ch.status)}
                <span className='ml-1 capitalize'>{ch.status}</span>
              </span>
            </div>
            <div className='text-gray-500 text-xs mb-4'>
              Creado: {formatDate(ch.createdAt)}
            </div>
            <div className='flex justify-center'>
              <Link href={`/books/${ch.bookId}/my-chapters/${ch.id}`}>
                <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
                  Ver Detalles
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

function EmptyState({ searchTerm }: { searchTerm: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 text-center'>
      <div className='flex flex-col items-center justify-center p-8'>
        <AlertCircle className='w-16 h-16 text-purple-300 mb-4' />
        {searchTerm ? (
          <>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              No se encontraron resultados
            </h3>
            <p className='text-gray-500 mb-6'>
              No hay capítulos que coincidan con "{searchTerm}"
            </p>
          </>
        ) : (
          <>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              No tienes capítulos personalizados todavía
            </h3>
            <p className='text-gray-500 mb-6'>
              Comienza enviando tu primer capítulo
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
