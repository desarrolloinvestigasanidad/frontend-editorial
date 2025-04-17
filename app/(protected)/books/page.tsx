"use client";

import Link from "next/link";
import { ArrowLeft, Book, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function BooksPage() {
  // Ejemplo: varias ediciones, cada una con sus libros
  const allEditions = [
    {
      id: "abril-2025",
      title: "Edición de Libros Electrónicos Abril 2025 Investiga Sanidad",
      books: [
        "Lecciones en Ciencias de la Salud y Gestión Sanitaria",
        "Lecciones en Innovación y Desarrollo en el Ámbito de la Salud",
        "Lecciones en Salud, Tecnología y Nuevos Modelos de Atención",
        "Lecciones en Avances Científicos y Gestión del Conocimiento en Salud",
        "Lecciones de Prevención y Atención Sanitaria Básica",
        "Lecciones de Promoción de la Salud y Prevención de Enfermedades",
        "Lecciones de Salud Pública y Prevención Comunitaria",
        "Lecciones de Cuidados y Atención a la Salud de los pacientes",
      ],
    },
    {
      id: "junio-2025",
      title: "Edición de Libros Electrónicos Junio 2025 Investiga Sanidad",
      books: ["Libro A", "Libro B", "Libro C"],
    },
  ];

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
            <Link href='/profile'>
              <Button
                variant='ghost'
                className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50'>
                <ArrowLeft className='mr-1 h-4 w-4' />
                Regresar
              </Button>
            </Link>
            <h1 className='text-2xl font-bold text-purple-800'>
              Todas las ediciones
            </h1>
          </div>
          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Biblioteca
          </div>
        </motion.div>

        <motion.div
          initial='hidden'
          animate='visible'
          variants={containerVariants}
          className='space-y-6'>
          {allEditions.map((edition) => (
            <motion.div
              key={edition.id}
              variants={itemVariants}
              className='backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='bg-purple-100 p-3 rounded-full transition-colors duration-300 group-hover:bg-purple-200'>
                  <Book className='w-6 h-6 text-purple-700' />
                </div>
                <div>
                  <h2 className='text-xl font-bold text-gray-900'>
                    {edition.title}
                  </h2>
                  <Badge className='mt-1 bg-purple-100 text-purple-800 border-purple-200'>
                    {edition.books.length} libros
                  </Badge>
                </div>
              </div>

              <div className='bg-white/70 rounded-xl p-4 border border-purple-100 mb-4'>
                <h3 className='text-md font-medium text-purple-800 mb-2 flex items-center'>
                  <BookOpen className='h-4 w-4 mr-2' />
                  Libros en esta edición
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                  {edition.books.map((book, idx) => (
                    <div
                      key={idx}
                      className='flex items-start gap-2 p-2 rounded-lg hover:bg-purple-50 transition-colors'>
                      <div className='bg-purple-100 rounded-full p-1 mt-0.5'>
                        <BookOpen className='h-3 w-3 text-purple-600' />
                      </div>
                      <span className='text-sm text-gray-700'>{book}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex justify-end'>
                <Link href={`/books/${edition.id}`}>
                  <Button className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 hover:shadow-lg'>
                    Ver detalles
                    <ChevronRight className='ml-2 h-4 w-4' />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
