"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Library,
  PlusCircle,
  BookOpen,
  ArrowRight,
  BookMarked,
  Sparkles,
} from "lucide-react";

export default function DashboardPage() {
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions`)
      .then((res) => res.json())
      .then((data) => {
        setEditions(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching editions:", error);
        setLoading(false);
      });
  }, []);

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
            Mi Panel
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Bienvenido a tu panel de autor
          </h2>
          <p className='text-gray-600 text-sm md:text-base'>
            Aquí encontrarás un resumen y acceso directo a las principales
            funcionalidades de tu plataforma
          </p>

          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        <motion.div
          initial='hidden'
          animate='visible'
          variants={containerVariants}
          className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Lista de ediciones obtenidas desde la BBDD */}
          {editions.length > 0 ? (
            editions.map((edition) => (
              <motion.div
                key={edition.id}
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
                      {edition.title || edition.name}
                    </h3>
                  </div>

                  <p className='text-gray-600 mb-6'>{edition.description}</p>

                  <div className='mt-auto'>
                    <Link href={`/editions/${edition.id}/books`}>
                      <Button
                        className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-lg'
                        onMouseEnter={() =>
                          handleMouseEnter(`edition-${edition.id}`)
                        }
                        onMouseLeave={() =>
                          handleMouseLeave(`edition-${edition.id}`)
                        }>
                        <span className='flex items-center justify-center'>
                          Ver Libros / Mandar Capítulos
                          <motion.span
                            animate={{
                              x: hoverStates[`edition-${edition.id}`] ? 5 : 0,
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
            ))
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

          {/* Card: Crear libro propio */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className='group'>
            <div className='relative backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 h-full transition-all duration-300 hover:shadow-xl hover:border-green-200'>
              <div className='absolute top-0 right-0 w-24 h-24 bg-green-100 rounded-bl-full -z-10 group-hover:bg-green-200 transition-colors duration-300'></div>

              <div className='flex items-center mb-4'>
                <div className='bg-green-100 p-3 rounded-full mr-3 group-hover:bg-green-200 transition-colors duration-300 group-hover:scale-110'>
                  <BookOpen className='w-5 h-5 text-green-700' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors'>
                  Crear Libro Propio
                </h3>
              </div>

              <p className='text-gray-600 mb-6'>
                Crea tu propio libro y coordina tus capítulos. Tú eliges el
                título y puedes invitar a otros autores.
              </p>

              <div className='mt-auto'>
                <Link href='/create-book'>
                  <Button
                    className='w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-lg text-white'
                    onMouseEnter={() => handleMouseEnter("create-book")}
                    onMouseLeave={() => handleMouseLeave("create-book")}>
                    <span className='flex items-center justify-center'>
                      Crear tu propio libro
                      <motion.span
                        animate={{ x: hoverStates["create-book"] ? 5 : 0 }}
                        transition={{ duration: 0.2 }}>
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </motion.span>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Feature showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='mt-16 backdrop-blur-sm bg-white/60 p-8 rounded-xl shadow-lg border border-purple-100'>
          <div className='flex items-center gap-2 mb-4'>
            <Sparkles className='h-5 w-5 text-purple-500' />
            <h3 className='text-xl font-bold text-gray-900'>
              Beneficios de publicar con nosotros
            </h3>
          </div>

          <div className='grid md:grid-cols-3 gap-6 mt-6'>
            <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
              <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3'>
                <BookOpen className='h-5 w-5 text-purple-700' />
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>ISBN Oficial</h4>
              <p className='text-sm text-gray-600'>
                Cada libro con ISBN diferente, para mayor difusión académica.
              </p>
            </div>

            <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
              <div className='w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-3'>
                <Library className='h-5 w-5 text-yellow-700' />
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>
                Certificado oficial
              </h4>
              <p className='text-sm text-gray-600'>
                Certificados de autoría para concursos y oposiciones.
              </p>
            </div>

            <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
              <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3'>
                <PlusCircle className='h-5 w-5 text-green-700' />
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>
                Revisión por expertos
              </h4>
              <p className='text-sm text-gray-600'>
                Comité científico especializado y revisión por pares.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
