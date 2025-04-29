"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Book,
  Sparkles,
  BookOpen,
  X,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import Image from "next/image";
import Terminos from "./terminos";
import Normativa from "./normativa";

export default function CrearLibroPage() {
  const { user } = useUser();
  const userId = user?.id;
  const [step, setStep] = useState<"normativa" | "titulo">("normativa");
  const [titulo, setTitulo] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Estado para la edición actual
  const [currentEdition, setCurrentEdition] = useState<any>(null);
  const [loadingEdition, setLoadingEdition] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          // Se asume que la primera edición es la actual
          setCurrentEdition(data[0]);
        }
        setLoadingEdition(false);
      })
      .catch((err) => {
        console.error("Error fetching editions:", err);
        setLoadingEdition(false);
      });
  }, []);

  // Función para avanzar en el proceso o crear el libro
  const handleCreateBook = async () => {
    if (!userId) {
      console.error("El usuario no está autenticado");
      return;
    }

    if (step === "normativa") {
      if (!acceptedTerms) {
        // Mostrar algún mensaje de error o feedback
        return;
      }
      setStep("titulo");
    } else if (step === "titulo" && titulo.trim()) {
      const amount = 9900;
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
          window.location.href = data.url;
        } else {
          console.error("No se recibió URL de Checkout", data);
        }
      } catch (error) {
        console.error("Error al crear la sesión de Checkout:", error);
      }
    }
  };

  // Variantes de animación para los elementos
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className='h-screen flex flex-col relative overflow-hidden'>
      {/* Header - Reducido en altura */}
      <header className='pt-8 pb-16 text-center relative'>
        {/* Floating books decoration - Reducido en tamaño */}
        <motion.div
          className='absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-4xl'
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}>
          <div className='relative h-20'>
            <div className='absolute left-10 bottom-0 transform -rotate-12'>
              <Image
                src='/abstract-purple-academic.png'
                alt='Libro ejemplo'
                width={70}
                height={105}
                className='rounded-md shadow-lg'
              />
            </div>
            <div className='absolute left-1/2 bottom-6 transform -translate-x-1/2 rotate-3 z-10'>
              <Image
                src='/cosmic-matter.png'
                alt='Libro ejemplo'
                width={80}
                height={120}
                className='rounded-md shadow-xl'
              />
            </div>
            <div className='absolute right-10 bottom-0 transform rotate-12'>
              <Image
                src='/abstract-purple-research.png'
                alt='Libro ejemplo'
                width={70}
                height={105}
                className='rounded-md shadow-lg'
              />
            </div>
          </div>
        </motion.div>
      </header>

      {/* Main Content - Flex-grow para ocupar el espacio restante */}
      <main className='flex-grow container mx-auto px-4 py-6 relative z-10 overflow-auto'>
        <AnimatePresence mode='wait'>
          {step === "normativa" && (
            <motion.div
              key='normativa'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}>
              {/* Columna Derecha: Tarjeta de Precio con Información de Edición y Cover */}
              <div className='max-w-lg mx-auto p-6'>
                {loadingEdition ? (
                  <div className='flex justify-center items-center h-40 bg-white/80 rounded-xl shadow-md'>
                    <div className='animate-pulse flex space-x-4'>
                      <div className='rounded-full bg-purple-200 h-12 w-12'></div>
                      <div className='flex-1 space-y-4 py-1'>
                        <div className='h-4 bg-purple-200 rounded w-3/4'></div>
                        <div className='space-y-2'>
                          <div className='h-4 bg-purple-200 rounded'></div>
                          <div className='h-4 bg-purple-200 rounded w-5/6'></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    className='backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-purple-50 border border-purple-200 relative'
                    initial='hidden'
                    animate='visible'
                    variants={itemVariants}>
                    <div className='absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-purple-800 text-white px-3 py-1 text-xs font-semibold rounded-bl-lg'>
                      Recomendado
                    </div>

                    <div className='p-4'>
                      {/* Mostrar portada si existe */}
                      {currentEdition && currentEdition.cover ? (
                        <div className='relative mb-4 overflow-hidden rounded-lg shadow-lg h-32'>
                          <div className='absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent flex items-end'>
                            <div className='p-3 text-white'>
                              <h4 className='text-sm font-bold'>
                                Edición Actual: {currentEdition.title}
                              </h4>
                              <p className='text-xs text-white/80'>
                                {currentEdition.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : currentEdition ? (
                        <div className='mb-4 bg-purple-100 p-3 rounded-lg'>
                          <h4 className='text-sm font-bold text-purple-800'>
                            Edición Actual: {currentEdition.title}
                          </h4>
                          <p className='text-xs text-gray-600'>
                            {currentEdition.description}
                          </p>
                        </div>
                      ) : null}

                      <div className='text-center mb-4'>
                        <h3 className='text-xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900'>
                          Libro Personalizado
                        </h3>
                        <div className='flex items-center justify-center'>
                          <span className='text-4xl font-bold text-purple-700'>
                            99€
                          </span>
                          <span className='text-gray-600 ml-2 text-xs'>
                            IVA incluido
                          </span>
                        </div>
                      </div>

                      <div className='bg-white/70 backdrop-blur-sm rounded-lg p-3 mb-4 border border-purple-100'>
                        <ul className='space-y-2 text-sm'>
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
                              <CheckCircle className='h-4 w-4 text-green-500 mr-2 flex-shrink-0' />
                              <span className='text-gray-700 text-xs'>
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handleCreateBook}
                          disabled={!acceptedTerms}
                          className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white py-5 text-base rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
                          <span className='flex items-center justify-center'>
                            Continuar
                            <ArrowRight className='ml-2 h-4 w-4' />
                          </span>
                        </Button>
                      </motion.div>
                    </div>
                    <div className='mt-4 p-4 flex items-start space-x-2'>
                      <Checkbox
                        id='terms'
                        checked={acceptedTerms}
                        onCheckedChange={(checked) => {
                          setAcceptedTerms(checked === true);
                        }}
                        className='mt-1'
                      />
                      <div className='grid gap-1.5 leading-none'>
                        <label
                          htmlFor='terms'
                          className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                          Acepto la{" "}
                          <Dialog
                            open={termsModalOpen}
                            onOpenChange={setTermsModalOpen}>
                            <DialogTrigger asChild>
                              <button className='text-purple-600 underline hover:text-purple-800'>
                                normativa
                              </button>
                            </DialogTrigger>
                            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
                              <Normativa />
                            </DialogContent>
                          </Dialog>
                        </label>
                        <p className='text-xs text-muted-foreground'>
                          Debes aceptar la normativa para continuar.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {step === "titulo" && (
            <motion.div
              key='titulo'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className='backdrop-blur-sm bg-white/90 p-6 rounded-2xl shadow-lg border border-purple-100 max-w-2xl mx-auto'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='bg-purple-100 p-2 rounded-full'>
                  <Book className='h-5 w-5 text-purple-700' />
                </div>
                <div>
                  <h1 className='text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900'>
                    Nuevo libro
                  </h1>
                  <p className='text-sm text-gray-600'>
                    Introduce el título de tu nuevo libro
                  </p>
                </div>
              </div>

              <div className='bg-white p-4 rounded-xl border border-purple-100 shadow-sm mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Título del libro
                </label>
                <Input
                  placeholder='Introduce el título del nuevo libro'
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className='border-purple-200 focus:border-purple-400 focus:ring-purple-200 text-base py-5'
                />
                <p className='text-xs text-gray-500 mt-2'>
                  El título debe ser descriptivo y representativo del contenido
                  del libro.
                </p>
              </div>

              <div className='flex justify-between gap-4'>
                <Button
                  variant='outline'
                  onClick={() => setStep("normativa")}
                  className='border-purple-200 hover:bg-purple-50 hover:text-purple-700'>
                  <ArrowLeft className='mr-2 h-4 w-4' />
                  Volver
                </Button>

                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleCreateBook}
                    disabled={!titulo.trim()}
                    className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 hover:shadow-lg px-6'>
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
      </main>
    </div>
  );
}
