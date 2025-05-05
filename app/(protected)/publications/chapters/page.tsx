"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/breadcrumb";
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
import { useUser } from "@/context/UserContext";
import { Input } from "@/components/ui/input";

export type Chapter = {
  id: string;
  title: string;
  description?: string;
  status: string; // "en revisión", "aprobado", "rechazado", etc.
  createdAt: string;
  updatedAt: string;
  editionId: string;
  bookId: string; // Added property
};

export default function OwnChaptersPage() {
  const { user } = useUser();
  const userId = user?.id || null;
  const router = useRouter();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const url = `${process.env.NEXT_PUBLIC_BASE_URL}/chapters?authorId=${userId}`;
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error("Error al obtener los capítulos");
        }
        const data: Chapter[] = await res.json();
        setChapters(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chapters:", err);
        setLoading(false);
      }
    };

    if (userId) {
      fetchChapters();
    }
  }, [userId]);

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  // Variantes para animación
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

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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

  const filteredChapters = chapters.filter((chapter) =>
    chapter.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p>Cargando capítulos...</p>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Puedes reutilizar el mismo fondo que en las demás páginas */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        {/* Breadcrumb y Encabezado */}
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50'
            onClick={() => router.push("/publications")}>
            <ChevronLeft className='mr-1 h-4 w-4' />
            Volver a Mis Publicaciones
          </Button>
          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Mis Capítulos
          </div>
        </div>

        <div className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold'>
            Capítulos en libros Personalizados
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mt-2'></div>
        </div>

        <div className='mb-6 max-w-md mx-auto'>
          <Input
            placeholder='Buscar capítulos...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredChapters.length === 0 ? (
          <div className='text-center'>
            <p>No hay capítulos que coincidan con tu búsqueda.</p>
          </div>
        ) : (
          <motion.div
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {filteredChapters.map((chapter) => (
              <motion.div
                key={chapter.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className='group'>
                <div className='relative backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
                  <div className='flex items-center justify-between mb-4'>
                    <h3 className='text-xl font-bold'>{chapter.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(
                        chapter.status
                      )}`}>
                      {getStatusIcon(chapter.status)}
                      <span className='ml-1 capitalize'>{chapter.status}</span>
                    </span>
                  </div>
                  {chapter.description && (
                    <p className='text-gray-600 mb-4 line-clamp-2'>
                      {chapter.description}
                    </p>
                  )}
                  <div className='flex justify-center'>
                    <Link
                      href={`/editions/${chapter.editionId}/books/${chapter.bookId}/chapters/${chapter.id}`}>
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
        )}

        {/* Información adicional de participación */}
        <div className='text-center mt-16'>
          <p className='text-sm text-gray-600'>
            Revisa el estado de tus capítulos: en revisión, aprobados o
            rechazados, para conocer en qué fase se encuentra tu trabajo.
          </p>
        </div>
      </div>
    </div>
  );
}
