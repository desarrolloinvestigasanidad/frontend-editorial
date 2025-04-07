"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  Book,
  CheckCircle,
  Users,
  Shield,
  ArrowRight,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUser } from "@/context/UserContext";

export default function CrearLibroPage() {
  const { user } = useUser();
  const userId = user?.id;
  const [step, setStep] = useState<"normativa" | "titulo">("normativa");
  const [titulo, setTitulo] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  // Función que maneja el avance de pasos o la creación final
  const handleCreateBook = async () => {
    if (step === "normativa") {
      // Paso 1 -> Paso 2
      setStep("titulo");
    } else if (step === "titulo" && titulo.trim()) {
      const amount = 99;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/create-checkout-session`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, bookTitle: titulo, amount }),
          }
        );
        const data = await response.json();
        if (data.url) {
          // Redirige al usuario a la sesión de Checkout de Stripe
          window.location.href = data.url;
        } else {
          console.error("No se recibió URL de Checkout", data);
        }
      } catch (error) {
        console.error("Error al crear la sesión de Checkout:", error);
      }
    }
  };

  // Animation variants
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
    <div className='py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-white to-purple-50'>
      <div className='container mx-auto px-4'>
        <AnimatePresence mode='wait'>
          {step === "normativa" && (
            <motion.div
              key='normativa'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}>
              <motion.div
                initial='hidden'
                animate='visible'
                variants={itemVariants}
                className='text-center mb-12'>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700 mb-4'>
                  Crea tu propio libro
                </motion.span>
                <h2 className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
                  Libro Personalizado
                </h2>
                <p className='text-gray-600 max-w-2xl mx-auto'>
                  Crea tu propio libro y coordina tus capítulos. Tú eliges el
                  título y puedes invitar a otros autores.
                </p>
                <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mt-4'></div>
              </motion.div>

              <div className='grid md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
                {/* Tarjeta de precio */}
                <motion.div
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className='backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-500 relative'>
                  <div className='absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg'>
                    Recomendado
                  </div>
                  <div className='p-8'>
                    <h3 className='text-2xl font-bold text-center mb-2'>
                      Libro personalizado
                    </h3>
                    <div className='text-center mb-8'>
                      <span className='text-5xl font-bold text-purple-700'>
                        99€
                      </span>
                      <span className='text-gray-600 ml-2'>IVA incluido</span>
                    </div>
                    <ul className='space-y-4 mb-8'>
                      {[
                        "Título personalizado para tu libro",
                        "Hasta 7 autores en total",
                        "ISBN oficial reconocido",
                        "Certificado de autoría",
                        "Revisión por expertos",
                        "Publicación digital",
                        "Difusión internacional",
                      ].map((feature, idx) => (
                        <li key={idx} className='flex items-center'>
                          <CheckCircle className='h-5 w-5 text-green-500 mr-3 flex-shrink-0' />
                          <span className='text-gray-700'>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleCreateBook}
                        className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white py-6 text-lg rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}>
                        <span className='flex items-center justify-center'>
                          Crear mi libro
                          <motion.span
                            animate={{ x: isHovered ? 5 : 0 }}
                            transition={{ duration: 0.2 }}>
                            <ArrowRight className='ml-2 h-5 w-5' />
                          </motion.span>
                        </span>
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Información adicional */}
                <motion.div variants={containerVariants} className='space-y-6'>
                  <motion.div
                    variants={itemVariants}
                    className='backdrop-blur-sm bg-white/80 p-6 rounded-xl shadow-md border border-purple-100'>
                    <div className='flex items-center gap-2 mb-3'>
                      <Users className='h-5 w-5 text-purple-700' />
                      <h4 className='font-semibold text-lg text-gray-900'>
                        Participación
                      </h4>
                    </div>
                    <p className='text-gray-700 mb-4'>
                      Un usuario podrá crear un libro con hasta otros 6 autores
                      (7 autores en total). El autor que proponga el libro será
                      el "coordinador" y el encargado de vincular a todos los
                      autores que quiera que participen en ese libro.
                    </p>
                    <Alert className='bg-yellow-50 border-yellow-200 text-yellow-800'>
                      <AlertCircle className='h-4 w-4 text-yellow-700' />
                      <AlertDescription className='text-yellow-800'>
                        Todos los autores deberán estar registrados e inscritos
                        para que el libro se pueda publicar.
                      </AlertDescription>
                    </Alert>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className='backdrop-blur-sm bg-white/80 p-6 rounded-xl shadow-md border border-purple-100'>
                    <div className='flex items-center gap-2 mb-3'>
                      <BookOpen className='h-5 w-5 text-purple-700' />
                      <h4 className='font-semibold text-lg text-gray-900'>
                        El coordinador podrá:
                      </h4>
                    </div>
                    <ul className='space-y-3'>
                      {[
                        "Añadir o quitar coautores en cualquier momento hasta llegar al máximo permitido de 7.",
                        "Consultar todos los capítulos que forman parte de su libro y su estado.",
                        "Visualizar el libro definitivo antes de mandarlo a publicar.",
                      ].map((item, index) => (
                        <li key={index} className='flex items-start gap-2'>
                          <div className='bg-purple-100 p-1 rounded-full mt-1'>
                            <CheckCircle className='h-3 w-3 text-purple-700' />
                          </div>
                          <span className='text-gray-700'>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className='backdrop-blur-sm bg-white/80 p-6 rounded-xl shadow-md border border-purple-100'>
                    <div className='flex items-center gap-2 mb-3'>
                      <Shield className='h-5 w-5 text-purple-700' />
                      <h4 className='font-semibold text-lg text-gray-900'>
                        Medidas anti-plagio
                      </h4>
                    </div>
                    <p className='text-gray-700'>
                      Si tu capítulo es detectado con un porcentaje de plagio
                      superior al 45%, será rechazado directamente. Puedes
                      comprobar el plagio en:{" "}
                      <a
                        href='http://plagiarisma.net/es/'
                        className='text-purple-700 font-medium hover:underline'
                        target='_blank'
                        rel='noopener noreferrer'>
                        plagiarisma.net
                      </a>
                    </p>
                  </motion.div>
                </motion.div>
              </div>

              {/* Tabla comparativa */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className='mt-16 backdrop-blur-sm bg-white/60 p-8 rounded-xl shadow-lg border border-purple-100 max-w-5xl mx-auto'>
                <h3 className='text-2xl font-bold text-center mb-8'>
                  Comparativa de Opciones
                </h3>
                <div className='overflow-x-auto'>
                  <table className='w-full'>
                    <thead>
                      <tr className='border-b border-gray-200'>
                        <th className='py-3 px-4 text-left font-semibold text-gray-700'>
                          Características
                        </th>
                        <th className='py-3 px-4 text-center font-semibold text-gray-700'>
                          Capítulos Individuales
                        </th>
                        <th className='py-3 px-4 text-center font-semibold text-gray-700'>
                          Libro Completo
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className='border-b border-gray-200'>
                        <td className='py-3 px-4 text-gray-700'>
                          ISBN Oficial
                        </td>
                        <td className='py-3 px-4 text-center text-green-600'>
                          <CheckCircle className='h-5 w-5 mx-auto' />
                        </td>
                        <td className='py-3 px-4 text-center text-green-600'>
                          <CheckCircle className='h-5 w-5 mx-auto' />
                        </td>
                      </tr>
                      <tr className='border-b border-gray-200'>
                        <td className='py-3 px-4 text-gray-700'>
                          Certificado de autoría
                        </td>
                        <td className='py-3 px-4 text-center text-green-600'>
                          <CheckCircle className='h-5 w-5 mx-auto' />
                        </td>
                        <td className='py-3 px-4 text-center text-green-600'>
                          <CheckCircle className='h-5 w-5 mx-auto' />
                        </td>
                      </tr>
                      <tr className='border-b border-gray-200'>
                        <td className='py-3 px-4 text-gray-700'>
                          Elección del título
                        </td>
                        <td className='py-3 px-4 text-center text-red-600'>
                          <AlertCircle className='h-5 w-5 mx-auto' />
                        </td>
                        <td className='py-3 px-4 text-center text-green-600'>
                          <CheckCircle className='h-5 w-5 mx-auto' />
                        </td>
                      </tr>
                      <tr className='border-b border-gray-200'>
                        <td className='py-3 px-4 text-gray-700'>Coautores</td>
                        <td className='py-3 px-4 text-center text-gray-600'>
                          Limitado
                        </td>
                        <td className='py-3 px-4 text-center text-green-600'>
                          Hasta 7 autores
                        </td>
                      </tr>
                      <tr>
                        <td className='py-3 px-4 text-gray-700'>
                          Difusión internacional
                        </td>
                        <td className='py-3 px-4 text-center text-green-600'>
                          <CheckCircle className='h-5 w-5 mx-auto' />
                        </td>
                        <td className='py-3 px-4 text-center text-green-600'>
                          <CheckCircle className='h-5 w-5 mx-auto' />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}

          {step === "titulo" && (
            <motion.div
              key='titulo'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 max-w-2xl mx-auto'>
              <div className='flex items-center gap-3 mb-6'>
                <div className='bg-purple-100 p-3 rounded-full'>
                  <Book className='h-6 w-6 text-purple-700' />
                </div>
                <div>
                  <h1 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900'>
                    Nuevo libro
                  </h1>
                  <p className='text-gray-600'>
                    Introduce el título de tu nuevo libro
                  </p>
                </div>
              </div>

              <div className='bg-white/90 p-6 rounded-xl border border-gray-100 shadow-sm mb-8'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Título del libro
                </label>
                <Input
                  placeholder='Introduce el título del nuevo libro'
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 text-lg py-6'
                />
                <p className='text-sm text-gray-500 mt-2'>
                  El título debe ser descriptivo y representativo del contenido
                  del libro.
                </p>
              </div>

              <div className='flex justify-between gap-4'>
                <Button
                  variant='outline'
                  onClick={() => setStep("normativa")}
                  className='border-gray-200 hover:bg-gray-50 hover:text-gray-700'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Volver
                </Button>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleCreateBook}
                    disabled={!titulo.trim()}
                    className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 hover:shadow-lg px-8'>
                    <span className='flex items-center'>
                      Crear libro
                      <ArrowRight className='ml-2 h-4 w-4' />
                    </span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
