"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

export type Chapter = {
  id: string;
  title: string;
  description?: string;
  status: string; // "en revisión", "aprobado", "rechazado", etc.
  createdAt: string;
  updatedAt: string;
  bookId: string;
  editionId: string | null;
};

export default function ChapterDetailPage() {
  const { user } = useUser();
  const userId = user?.id || null;
  const { chapterId } = useParams(); // <-- aquí saco chapterId
  const router = useRouter();

  // Estados para el breadcrumb
  const [bookId, setBookId] = useState<string>();
  const [bookTitle, setBookTitle] = useState<string>();
  const [editionId, setEditionId] = useState<string | null>(null);
  const [editionTitle, setEditionTitle] = useState<string>();

  // Estados para los capítulos listados (si en realidad vas a listar varios).
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  // 1) Antes de todo: traigo el capítulo y su libro/edición expandidos
  useEffect(() => {
    if (!chapterId) return;
    async function fetchChapter() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chapters/
            ${chapterId}?_expand=book&_expand=edition`.replace(/\s+/g, "")
        );
        if (!res.ok) throw new Error("No se encontró el capítulo");
        const data = await res.json();
        // el backend ha de devolver algo así:
        // data.book = { id, title, … }
        // data.edition = { id, title, … } o null
        setBookId(data.book.id);
        setBookTitle(data.book.title);
        setEditionId(data.book.editionId);
        if (data.edition) setEditionTitle(data.edition.title);
      } catch (err) {
        console.error(err);
      }
    }
    fetchChapter();
  }, [chapterId]);

  // 2) Si luego tienes sentido en listar TODOS los capítulos de ese mismo libro:
  useEffect(() => {
    if (!userId || !bookId) return;
    async function fetchChapters() {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/chapters?
             authorId=${userId}&bookId=${bookId}`.replace(/\s+/g, "")
        );
        if (!res.ok) throw new Error("Error al obtener los capítulos");
        setChapters(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchChapters();
  }, [userId, bookId]);

  // Filtrado y helpers…
  const filtered = chapters.filter((ch) =>
    ch.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprobado":
        return <CheckCircle className='h-5 w-5 text-green-500' />;
      case "en revisión":
        return <Clock className='h-5 w-5 text-yellow-500' />;
      case "rechazado":
        return <AlertCircle className='h-5 w-5 text-red-500' />;
      default:
        return <AlertCircle className='h-5 w-5 text-gray-400' />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "aprobado":
        return "bg-green-100 text-green-800";
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
        <p>Cargando capítulos del libro…</p>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo decorativo */}
      <div className='absolute inset-0 z-0'>{/* … */}</div>

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        {/* === Breadcrumb === */}
        <div className='flex items-center justify-between'>
          <nav
            aria-label='breadcrumb'
            className='flex items-center space-x-2 text-sm text-gray-600'>
            <Link href='/publications' className='hover:underline'>
              Mis Publicaciones
            </Link>
            <span>/</span>
            {bookTitle && (
              <>
                <Link href={`/books/${bookId}`} className='hover:underline'>
                  {bookTitle}
                </Link>
                <span>/</span>
              </>
            )}
            {editionTitle && editionId && (
              <>
                <Link
                  href={`/editions/${editionId}`}
                  className='hover:underline'>
                  Ed. {editionTitle}
                </Link>
                <span>/</span>
              </>
            )}
            <span className='font-medium'>Mis Capítulos</span>
          </nav>

          <Button
            variant='ghost'
            className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50'
            onClick={() => router.push("/publications")}>
            <ChevronLeft className='mr-1 h-4 w-4' />
            Volver
          </Button>
        </div>

        {/* === Listado de capítulos === */}
        <div className='text-center mb-6'>
          <h2 className='text-2xl md:text-3xl font-bold'>
            Mis Capítulos en este Libro
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mt-2' />
        </div>

        <div className='mb-6 max-w-md mx-auto'>
          <Input
            placeholder='Buscar capítulos...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <div className='text-center'>
            <p>No hay capítulos que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <motion.div
            initial='hidden'
            animate='visible'
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filtered.map((ch) => (
              <motion.div
                key={ch.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                whileHover={{ y: -5 }}
                className='group'>
                <div
                  className='relative backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:border-purple-200'
                  onMouseEnter={() =>
                    setHoverStates((hs) => ({ ...hs, [ch.id]: true }))
                  }
                  onMouseLeave={() =>
                    setHoverStates((hs) => ({ ...hs, [ch.id]: false }))
                  }>
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
                  {ch.description && (
                    <p className='text-gray-600 mb-4 line-clamp-2'>
                      {ch.description}
                    </p>
                  )}
                  <div className='flex justify-center'>
                    <Link href={`/books/${ch.bookId}/my-chapters/${ch.id}`}>
                      <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
                        <BookOpen className='mr-2 h-4 w-4' />
                        Ver Detalles
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className='text-center mt-16'>
          <p className='text-sm text-gray-600'>
            Aquí puedes revisar el estado de tus capítulos para este libro:
            aprobados, en revisión o rechazados.
          </p>
        </div>
      </div>
    </div>
  );
}
