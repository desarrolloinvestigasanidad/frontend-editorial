"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb } from "@/components/breadcrumb";
import {
  BookOpen,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  BookMarked,
  Search,
  Library,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";

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
  editionId?: string; // Si existe, es libro de edición.
  createdAt: string;
  updatedAt: string;
};

type Edition = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
};

export default function PublicationsPage() {
  const { user } = useUser();
  const userId = user?.id || null;
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});
  // Estado para almacenar la información real de las ediciones, mapeado por su id.
  const [editionsDetails, setEditionsDetails] = useState<
    Record<string, Edition>
  >({});

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_BASE_URL}/publications`;
        if (userId) {
          // Si existe userId, lo agregamos como query parameter para obtener solo los libros del usuario.
          url += `?userId=${userId}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Error al obtener los libros");
        }
        const data = await response.json();
        setBooks(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching books:", error);
        setLoading(false);
      }
    };

    fetchBooks();
  }, [userId]);

  // Filtrar libros según el término de búsqueda.
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Determinar libros propios y de edición según la existencia de editionId.
  const ownBooks = filteredBooks.filter((book) => !book.editionId);
  const editionBooks = filteredBooks.filter((book) => book.editionId);

  // Extraer uniqueEditionIds de los libros de edición.
  const uniqueEditionIds = Array.from(
    new Set(editionBooks.map((book) => book.editionId))
  ).filter((id): id is string => Boolean(id));

  // Efecto para hacer fetch de la información de cada edición usando /editions/{id}.
  useEffect(() => {
    if (uniqueEditionIds.length === 0) return;
    Promise.all(
      uniqueEditionIds.map((id) =>
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions/${id}`).then(
          (res) => {
            if (!res.ok) {
              throw new Error(`Error al obtener la edición ${id}`);
            }
            return res.json();
          }
        )
      )
    )
      .then((editionsData: Edition[]) => {
        // Creamos un mapa de ediciones con key = edition.id.
        const map: Record<string, Edition> = {};
        editionsData.forEach((edition) => {
          map[edition.id] = edition;
        });
        setEditionsDetails(map);
      })
      .catch((error) => console.error("Error fetching editions:", error));
  }, [uniqueEditionIds]);

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
      case "desarrollo":
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
      case "desarrollo":
      case "en proceso":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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

  console.log(books);
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
          <Breadcrumb />
          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Mis Publicaciones
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Mis Publicaciones
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mb-4'></div>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Gestiona tus libros propios y participa en libros de edición
          </p>
        </motion.div>

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

          <div className='flex gap-2 w-full md:w-auto'>
            <Link href='/create-book'>
              <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
                <BookOpen className='mr-2 h-4 w-4' />
                Crear libro propio
              </Button>
            </Link>
          </div>
        </motion.div>

        <Tabs defaultValue='all' className='w-full'>
          <TabsList className='mb-6 bg-white/50 backdrop-blur-sm border border-gray-100 p-1 rounded-lg'>
            <TabsTrigger
              value='all'
              className='data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800'>
              Todos los libros
            </TabsTrigger>
            <TabsTrigger
              value='own'
              className='data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800'>
              Libros propios
            </TabsTrigger>
            <TabsTrigger
              value='edition'
              className='data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800'>
              Libros de edición
            </TabsTrigger>
          </TabsList>

          <TabsContent value='all'>
            {filteredBooks.length === 0 ? (
              <EmptyState searchTerm={searchTerm} />
            ) : (
              <BookGrid
                books={filteredBooks}
                hoverStates={hoverStates}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
              />
            )}
          </TabsContent>

          <TabsContent value='own'>
            {ownBooks.length === 0 ? (
              <EmptyState type='propios' searchTerm={searchTerm} />
            ) : (
              <BookGrid
                books={ownBooks}
                hoverStates={hoverStates}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
                getStatusIcon={getStatusIcon}
                getStatusColor={getStatusColor}
                formatDate={formatDate}
              />
            )}
          </TabsContent>

          <TabsContent value='edition'>
            {/* Mostrar las tarjetas de edición */}
            {uniqueEditionIds.length > 0 ? (
              <motion.div
                initial='hidden'
                animate='visible'
                variants={containerVariants}
                className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {uniqueEditionIds.map((id) => {
                  // Utilizamos el objeto editionsDetails para obtener los datos reales
                  const edition = editionsDetails[id];
                  return (
                    <motion.div
                      key={id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                      className='group'>
                      <div className='relative backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 h-full transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
                        <div className='absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -z-10 group-hover:bg-purple-200 transition-colors duration-300'></div>

                        <div className='flex items-center mb-4'>
                          <div className='bg-purple-100 p-3 rounded-full mr-3 group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110'>
                            <Library className='w-5 h-5 text-purple-700' />
                          </div>
                          <h3 className='text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors'>
                            {edition
                              ? edition.title || edition.name
                              : `Edición ${id.slice(0, 8)}`}
                          </h3>
                        </div>

                        <p className='text-gray-600 mb-6'>
                          {edition
                            ? edition.description
                            : "Haz clic para ver libros de esta edición"}
                        </p>

                        <div className='mt-auto'>
                          <Link href={`/publications/editions/${id}`}>
                            <Button
                              className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-lg'
                              onMouseEnter={() =>
                                handleMouseEnter(`edition-${id}`)
                              }
                              onMouseLeave={() =>
                                handleMouseLeave(`edition-${id}`)
                              }>
                              <span className='flex items-center justify-center'>
                                Ver Libros / Mandar Capítulos
                                <motion.span
                                  animate={{
                                    x: hoverStates[`edition-${id}`] ? 5 : 0,
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
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                variants={itemVariants}
                className='col-span-full backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50'>
                <div className='flex flex-col items-center justify-center text-center p-8'>
                  <BookMarked className='w-12 h-12 text-purple-300 mb-4' />
                  <h3 className='text-xl font-semibold text-gray-700 mb-2'>
                    No hay ediciones disponibles
                  </h3>
                  <p className='text-gray-500'>
                    Pronto se añadirán nuevas ediciones para participar
                  </p>
                </div>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

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
            <div className='absolute top-0 right-0 w-24 h-24 bg-purple-100 rounded-bl-full -z-10 group-hover:bg-purple-200 transition-colors duration-300'></div>

            {/* Badge para tipo de libro */}
            <Badge
              className={`absolute top-4 right-4 ${
                book.bookType.toLowerCase() === "libro propio"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}>
              {book.bookType}
            </Badge>

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
              <Link href={`/publications/${book.id}`}>
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
        <BookMarked className='w-16 h-16 text-purple-300 mb-4' />
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
              {type
                ? `No tienes libros ${type} todavía`
                : "No tienes libros todavía"}
            </h3>
            <p className='text-gray-500 mb-6'>
              {type === "propios"
                ? "Crea tu primer libro personalizado"
                : type === "edición"
                ? "Participa en una edición para ver libros aquí"
                : "Comienza creando un libro o participando en una edición"}
            </p>
          </>
        )}
        <Link href='/create-book'>
          <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
            <BookOpen className='mr-2 h-4 w-4' />
            Crear libro propio
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}
