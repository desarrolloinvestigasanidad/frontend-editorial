"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  Search,
  ArrowLeft,
  ArrowRight,
  Calendar,
  BookMarked,
  Library,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface Edition {
  id: number;
  title: string;
  color: "orange" | "blue" | "green" | "brown" | "red" | "yellow";
  books?: number;
}

interface YearData {
  year: number;
  color: "orange" | "blue" | "green";
  editions?: number;
}

interface Book {
  id: number;
  title: string;
  color: "orange" | "blue" | "green" | "brown" | "red" | "yellow";
  authors?: string;
  date?: string;
}

export default function LibraryPage() {
  // Mock: el usuario sí tiene libros propios
  const hasOwnBooks = true;

  // Mock: Años disponibles en la biblioteca pública
  const publicYears: YearData[] = [
    { year: 2024, color: "orange", editions: 11 },
    { year: 2023, color: "blue", editions: 12 },
    { year: 2022, color: "blue", editions: 12 },
    { year: 2021, color: "green", editions: 12 },
    { year: 2020, color: "orange", editions: 12 },
  ];

  // Mock: Ediciones para el año 2024
  const editions2024: Edition[] = [
    {
      id: 1,
      title: "Edición XVI Libros Electrónicos enero 2024",
      color: "orange",
      books: 8,
    },
    {
      id: 2,
      title: "Edición XVII Libros Electrónicos febrero 2024",
      color: "green",
      books: 12,
    },
    {
      id: 3,
      title: "Edición XVIII Libros Electrónicos marzo 2024",
      color: "blue",
      books: 10,
    },
    {
      id: 4,
      title: "Edición XIX Libros Electrónicos abril 2024",
      color: "brown",
      books: 9,
    },
    {
      id: 5,
      title: "Edición XX Libros Electrónicos mayo 2024",
      color: "red",
      books: 11,
    },
    {
      id: 6,
      title: "Edición XXI Libros Electrónicos junio 2024",
      color: "yellow",
      books: 7,
    },
    {
      id: 7,
      title: "Edición XXII Libros Electrónicos julio 2024",
      color: "orange",
      books: 14,
    },
    {
      id: 8,
      title: "Edición XXIII Libros Electrónicos agosto 2024",
      color: "green",
      books: 9,
    },
    {
      id: 9,
      title: "Edición XXIV Libros Electrónicos septiembre 2024",
      color: "blue",
      books: 10,
    },
    {
      id: 10,
      title: "Edición XXV Libros Electrónicos octubre 2024",
      color: "brown",
      books: 8,
    },
    {
      id: 11,
      title: "Edición XXVI Libros Electrónicos noviembre 2024",
      color: "red",
      books: 6,
    },
  ];

  // Mock: Tus libros propios
  const ownBooks: Book[] = [
    {
      id: 101,
      title: "Libro Propio: Emergencias 2024",
      color: "orange",
      authors: "María García, Juan Pérez, Carlos Rodríguez",
      date: "15 de marzo de 2024",
    },
    {
      id: 102,
      title: "Libro Propio: Salud Pública",
      color: "blue",
      authors: "Ana Martínez, Luis Sánchez",
      date: "22 de enero de 2024",
    },
  ];

  // Estado de navegación
  const [view, setView] = useState<
    "main" | "publicYears" | "publicEditions" | "ownBooks"
  >("main");
  const [selectedYear, setSelectedYear] = useState<YearData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulamos una carga de datos
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  // Función para decidir qué clase de color usar en el ícono
  function iconColorClass(color: string) {
    switch (color) {
      case "orange":
        return "text-orange-600";
      case "blue":
        return "text-blue-600";
      case "green":
        return "text-green-600";
      case "brown":
        return "text-yellow-900"; // Asignamos un marrón
      case "red":
        return "text-red-600";
      case "yellow":
        return "text-yellow-500";
      default:
        return "text-gray-600";
    }
  }

  // Función para decidir qué clase de color usar en el fondo
  function bgColorClass(color: string) {
    switch (color) {
      case "orange":
        return "bg-orange-50 border-orange-200";
      case "blue":
        return "bg-blue-50 border-blue-200";
      case "green":
        return "bg-green-50 border-green-200";
      case "brown":
        return "bg-yellow-50/70 border-yellow-300";
      case "red":
        return "bg-red-50 border-red-200";
      case "yellow":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
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
          <Breadcrumb />
          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Biblioteca
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Biblioteca de Libros
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mb-4'></div>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Accede a todos los libros publicados y a tus libros propios
          </p>
        </motion.div>

        <div className='backdrop-blur-sm bg-white/80 p-6 md:p-8 rounded-2xl shadow-lg border border-white/50'>
          {view !== "main" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}>
              <Button
                variant='ghost'
                className='mb-6 text-purple-700 hover:text-purple-900 hover:bg-purple-50'
                onClick={() => {
                  if (view === "publicEditions") {
                    setView("publicYears");
                  } else {
                    setView("main");
                  }
                }}>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Volver
              </Button>
            </motion.div>
          )}

          {view === "publicYears" ||
          view === "publicEditions" ||
          view === "ownBooks" ? (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className='relative w-full md:w-64 mb-6'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                type='search'
                placeholder='Buscar libros...'
                className='pl-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>
          ) : null}

          {/* Render condicional según el estado "view" */}
          {view === "main" && renderMainMenu()}
          {view === "publicYears" && renderPublicYears()}
          {view === "publicEditions" && renderPublicEditions()}
          {view === "ownBooks" && renderOwnBooks()}
        </div>
      </div>
    </div>
  );

  // Sección principal: 2 tarjetas (Biblioteca pública y propia)
  function renderMainMenu() {
    return (
      <motion.div
        initial='hidden'
        animate='visible'
        variants={containerVariants}
        className='grid grid-cols-1 md:grid-cols-1 gap-6'>
        {/* Card: Biblioteca de libros (pública) */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -10 }}
          className='group'>
          <div
            onClick={() => setView("publicYears")}
            className='cursor-pointer backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 h-full transition-all duration-300 hover:shadow-xl hover:border-orange-200 flex flex-col items-center justify-center'>
            <div className='bg-orange-100 p-6 rounded-full mb-6 group-hover:bg-orange-200 transition-colors duration-300 group-hover:scale-110'>
              <Library className='h-12 w-12 text-orange-600' />
            </div>
            <h2 className='text-xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors mb-2'>
              Biblioteca de libros
            </h2>
            <p className='text-gray-600 text-center mb-6'>
              Accede a todos los libros publicados organizados por año y edición
            </p>
            <Button
              className='mt-auto bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800'
              onMouseEnter={() => handleMouseEnter("public")}
              onMouseLeave={() => handleMouseLeave("public")}>
              <span className='flex items-center justify-center'>
                Explorar biblioteca
                <motion.span
                  animate={{ x: hoverStates["public"] ? 5 : 0 }}
                  transition={{ duration: 0.2 }}>
                  <ArrowRight className='ml-2 h-4 w-4' />
                </motion.span>
              </span>
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Sección para mostrar los años disponibles (públicos)
  function renderPublicYears() {
    const filteredYears = publicYears.filter((year) =>
      year.year.toString().includes(searchTerm)
    );

    return (
      <div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900'>
          Biblioteca de libros por año
        </motion.h2>

        {filteredYears.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='backdrop-blur-sm bg-white/60 p-8 rounded-xl shadow-md border border-gray-100 text-center'>
            <BookOpen className='h-12 w-12 mx-auto text-gray-400 mb-4' />
            <p className='text-gray-600 mb-2'>
              No se encontraron resultados para "{searchTerm}"
            </p>
            <Button
              variant='outline'
              className='mt-4'
              onClick={() => setSearchTerm("")}>
              Limpiar búsqueda
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
            {filteredYears.map((yearObj) => (
              <motion.div
                key={yearObj.year}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className='group'>
                <div
                  onClick={() => {
                    setSelectedYear(yearObj);
                    setView("publicEditions");
                  }}
                  className={`cursor-pointer backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-md border transition-all duration-300 hover:shadow-xl flex flex-col items-center justify-center h-full ${bgColorClass(
                    yearObj.color
                  )}`}>
                  <div
                    className={`p-4 rounded-full mb-4 transition-colors duration-300 group-hover:scale-110 ${
                      yearObj.color === "orange"
                        ? "bg-orange-100 group-hover:bg-orange-200"
                        : yearObj.color === "blue"
                        ? "bg-blue-100 group-hover:bg-blue-200"
                        : "bg-green-100 group-hover:bg-green-200"
                    }`}>
                    <Calendar
                      className={`h-8 w-8 ${iconColorClass(yearObj.color)}`}
                    />
                  </div>
                  <h3 className='font-bold text-lg mb-1 group-hover:text-purple-700'>
                    Ediciones {yearObj.year}
                  </h3>
                  {yearObj.editions && (
                    <p className='text-sm text-gray-600'>
                      {yearObj.editions} ediciones disponibles
                    </p>
                  )}
                  <div className='mt-4 flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-800'>
                    Ver ediciones
                    <ChevronRight className='ml-1 h-4 w-4' />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    );
  }

  // Sección para mostrar las ediciones dentro del año seleccionado
  function renderPublicEditions() {
    if (!selectedYear) return null;

    const filteredEditions = editions2024.filter((edition) =>
      edition.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900'>
          Ediciones {selectedYear.year}
        </motion.h2>

        {filteredEditions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='backdrop-blur-sm bg-white/60 p-8 rounded-xl shadow-md border border-gray-100 text-center'>
            <BookOpen className='h-12 w-12 mx-auto text-gray-400 mb-4' />
            <p className='text-gray-600 mb-2'>
              No se encontraron resultados para "{searchTerm}"
            </p>
            <Button
              variant='outline'
              className='mt-4'
              onClick={() => setSearchTerm("")}>
              Limpiar búsqueda
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
            {filteredEditions.map((ed) => (
              <motion.div
                key={ed.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className='group'>
                <Link href={`/library/editions/${ed.id}`}>
                  <div
                    className={`cursor-pointer backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-md border transition-all duration-300 hover:shadow-xl flex flex-col items-center justify-center h-full ${bgColorClass(
                      ed.color
                    )}`}>
                    <div
                      className={`p-3 rounded-full mb-4 transition-colors duration-300 group-hover:scale-110 ${
                        ed.color === "orange"
                          ? "bg-orange-100 group-hover:bg-orange-200"
                          : ed.color === "blue"
                          ? "bg-blue-100 group-hover:bg-blue-200"
                          : ed.color === "green"
                          ? "bg-green-100 group-hover:bg-green-200"
                          : ed.color === "brown"
                          ? "bg-yellow-100 group-hover:bg-yellow-200"
                          : ed.color === "red"
                          ? "bg-red-100 group-hover:bg-red-200"
                          : "bg-yellow-100 group-hover:bg-yellow-200"
                      }`}>
                      <BookOpen
                        className={`h-6 w-6 ${iconColorClass(ed.color)}`}
                      />
                    </div>
                    <h3 className='font-bold text-center mb-2 group-hover:text-purple-700'>
                      {ed.title}
                    </h3>
                    {ed.books && (
                      <p className='text-sm text-gray-600 mb-3'>
                        {ed.books} libros disponibles
                      </p>
                    )}
                    <Button
                      size='sm'
                      className='mt-auto bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
                      onMouseEnter={() => handleMouseEnter(`edition-${ed.id}`)}
                      onMouseLeave={() => handleMouseLeave(`edition-${ed.id}`)}>
                      <span className='flex items-center justify-center'>
                        Ver libros
                        <motion.span
                          animate={{
                            x: hoverStates[`edition-${ed.id}`] ? 5 : 0,
                          }}
                          transition={{ duration: 0.2 }}>
                          <ArrowRight className='ml-2 h-4 w-4' />
                        </motion.span>
                      </span>
                    </Button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    );
  }

  // Sección para mostrar los libros propios
  function renderOwnBooks() {
    const filteredBooks = ownBooks.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className='text-xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900'>
          Mis Libros Propios
        </motion.h2>

        {filteredBooks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='backdrop-blur-sm bg-white/60 p-8 rounded-xl shadow-md border border-gray-100 text-center'>
            <BookOpen className='h-12 w-12 mx-auto text-gray-400 mb-4' />
            <p className='text-gray-600 mb-2'>
              {searchTerm
                ? `No se encontraron resultados para "${searchTerm}"`
                : "No tienes libros propios."}
            </p>
            {searchTerm && (
              <Button
                variant='outline'
                className='mt-4'
                onClick={() => setSearchTerm("")}>
                Limpiar búsqueda
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial='hidden'
            animate='visible'
            variants={containerVariants}
            className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className='group'>
                <Link href={`/library/books/${book.id}`}>
                  <div
                    className={`cursor-pointer backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-md border transition-all duration-300 hover:shadow-xl ${bgColorClass(
                      book.color
                    )}`}>
                    <div className='flex items-start gap-4'>
                      <div
                        className={`p-3 rounded-full transition-colors duration-300 group-hover:scale-110 flex-shrink-0 ${
                          book.color === "orange"
                            ? "bg-orange-100 group-hover:bg-orange-200"
                            : book.color === "blue"
                            ? "bg-blue-100 group-hover:bg-blue-200"
                            : "bg-green-100 group-hover:bg-green-200"
                        }`}>
                        <BookMarked
                          className={`h-6 w-6 ${iconColorClass(book.color)}`}
                        />
                      </div>
                      <div>
                        <h3 className='font-bold text-lg mb-2 group-hover:text-purple-700'>
                          {book.title}
                        </h3>
                        {book.authors && (
                          <p className='text-sm text-gray-600 mb-2'>
                            <span className='font-medium'>Autores:</span>{" "}
                            {book.authors}
                          </p>
                        )}
                        {book.date && (
                          <p className='text-sm text-gray-600 mb-4 flex items-center'>
                            <Calendar className='h-4 w-4 mr-1 text-gray-500' />
                            {book.date}
                          </p>
                        )}
                        <Button
                          size='sm'
                          className='mt-2 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
                          onMouseEnter={() =>
                            handleMouseEnter(`book-${book.id}`)
                          }
                          onMouseLeave={() =>
                            handleMouseLeave(`book-${book.id}`)
                          }>
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
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    );
  }
}
