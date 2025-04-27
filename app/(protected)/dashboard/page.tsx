"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Library,
  BookOpen,
  ArrowRight,
  BookMarked,
  PlusCircle,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export default function DashboardPage() {
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  // Simulación: variable que indica si el usuario tiene libros creados
  // (reemplazar con el dato real obtenido desde la API o estado global)
  const hasCreatedBooks = false;

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

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo con gradiente y "blobs" */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
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

        {/* Contenedor donde añadimos nuestras tarjetas */}
        <motion.div
          initial='hidden'
          animate='visible'
          variants={containerVariants}
          className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* NUEVA TARJETA: Participar en Edición -> /editions */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className='group'>
            <div className='relative backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 h-full transition-all duration-300 hover:shadow-xl hover:border-blue-200'>
              <div className='absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-bl-full -z-10 group-hover:bg-blue-200 transition-colors duration-300'></div>

              <div className='flex items-center mb-4'>
                <div className='bg-blue-100 p-3 rounded-full mr-3 group-hover:bg-blue-200 transition-colors duration-300 group-hover:scale-110'>
                  <CheckCircle className='w-5 h-5 text-blue-700' />
                </div>
                <h3 className='text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors'>
                  Participar en Edición
                </h3>
              </div>

              <p className='text-gray-600 mb-6'>
                Envía tus capítulos y participa en la edición que más te
                interese.
              </p>

              <div className='mt-auto'>
                <Link href='/editions'>
                  <Button
                    className='w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-lg text-white'
                    onMouseEnter={() => handleMouseEnter("participar")}
                    onMouseLeave={() => handleMouseLeave("participar")}>
                    <span className='flex items-center justify-center'>
                      Ir a Ediciones
                      <motion.span
                        animate={{ x: hoverStates["participar"] ? 5 : 0 }}
                        transition={{ duration: 0.2 }}>
                        <ArrowRight className='ml-2 h-4 w-4' />
                      </motion.span>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
          {/* Tarjeta de Libros Personalizados (ya existente) */}
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
                  Libros Personalizados
                </h3>
              </div>

              <p className='text-gray-600 mb-6'>
                Crea tu propio libro y consulta los que ya has creado.
              </p>

              <div className='mt-auto flex gap-2'>
                <Link href='/create-book'>
                  <Button
                    className='flex-1 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 transition-all duration-300 transform group-hover:-translate-y-1 hover:shadow-lg text-white'
                    onMouseEnter={() => handleMouseEnter("create-book")}
                    onMouseLeave={() => handleMouseLeave("create-book")}>
                    Crear Libro Personalizado
                  </Button>
                </Link>
                {hasCreatedBooks ? (
                  <Link href='/my-books'>
                    <Button
                      variant='outline'
                      className='flex-1 border-green-600 text-green-600 hover:bg-green-50 transition-all duration-300'
                      onMouseEnter={() => handleMouseEnter("my-books")}
                      onMouseLeave={() => handleMouseLeave("my-books")}>
                      Ver Libros creados
                    </Button>
                  </Link>
                ) : (
                  // Si no hay libros creados, redirigimos a la creación
                  <Link href='/publications'>
                    <Button
                      variant='outline'
                      className='flex-1 border-green-600 text-green-600 hover:bg-green-50 transition-all duration-300'
                      onMouseEnter={() => handleMouseEnter("my-books")}
                      onMouseLeave={() => handleMouseLeave("my-books")}>
                      Ver Libros creados
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Sección de Beneficios (resto del código sin cambios) */}
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
                Revisión por expertos. Comité Científico especializado y
                revisión de contenido y de plagio.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
