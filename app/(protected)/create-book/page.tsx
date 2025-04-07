"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, ArrowRight, ArrowLeft, Book } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function CrearLibroPage() {
  const { user } = useUser();
  const userId = user?.id;
  const [step, setStep] = useState<"normativa" | "titulo">("normativa");
  const [titulo, setTitulo] = useState("");

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
              <div className='grid md:grid-cols-2 gap-8'>
                {/* Columna Izquierda: Normativa */}
                <div className='space-y-8'>
                  <motion.div
                    className='bg-white p-8 rounded-xl shadow-xl border border-gray-200'
                    initial='hidden'
                    animate='visible'
                    variants={itemVariants}>
                    <h2 className='text-3xl font-bold mb-4 text-purple-800'>
                      Normativa de Publicación - Edición de Libros de Investiga
                      Sanidad
                    </h2>
                    <p className='text-gray-700 mb-4'>
                      Estimado/a autor/a, te damos la bienvenida a la{" "}
                      <strong>[Nombre de la Edición/Libro]</strong> de Investiga
                      Sanidad. A continuación, te detallamos las normativas y
                      fechas importantes para el envío de tus capítulos, la
                      publicación de la edición y la descarga de los libros y
                      certificados:
                    </p>
                    <ol className='list-decimal ml-5 space-y-2 text-gray-700'>
                      <li>
                        <strong>Envío de Capítulos:</strong> El plazo para el
                        envío es <strong>[Fecha límite]</strong>. Cada capítulo
                        debe ajustarse a las especificaciones requeridas; de lo
                        contrario, se devolverá para corrección.
                      </li>
                      <li>
                        <strong>Revisión y Publicación:</strong> Los capítulos
                        serán evaluados por nuestro equipo editorial y se
                        notificará a los autores sobre aceptación o
                        correcciones. La publicación oficial será el{" "}
                        <strong>[Fecha de publicación]</strong>.
                      </li>
                      <li>
                        <strong>Descarga de Libros y Certificados:</strong>
                        <br />
                        <em>Libro Completo:</em> Disponible en{" "}
                        <strong>[Fecha de publicación]</strong>.
                        <br />
                        <em>Certificados de Participación:</em> Disponibles
                        desde <strong>[Fecha de publicación]</strong> hasta{" "}
                        <strong>[Fecha límite de descarga]</strong>.
                      </li>
                      <li>
                        <strong>Términos y Condiciones:</strong> Al enviar tu
                        capítulo, cedes los derechos de publicación y aceptas la
                        Ley de Propiedad Intelectual. No se aceptarán
                        correcciones post-publicación.
                      </li>
                    </ol>
                    <p className='text-gray-700 mt-4'>
                      Envío de capítulos: <strong>[FECHA]</strong>
                      <br />
                      Revisión y corrección: <strong>[FECHA]</strong>
                      <br />
                      Publicación y descarga: <strong>[FECHA]</strong>
                    </p>
                    <p className='text-gray-700 mt-4'>
                      El equipo de Investiga Sanidad
                    </p>
                  </motion.div>

                  <motion.div
                    className='bg-white p-8 rounded-xl shadow-xl border border-gray-200'
                    initial='hidden'
                    animate='visible'
                    variants={itemVariants}
                    transition={{ delay: 0.3 }}>
                    <h2 className='text-3xl font-bold mb-4 text-purple-800'>
                      Normativa de Libros Completos Antes de Pagar
                    </h2>
                    <p className='text-gray-700 mb-4'>
                      Revisa la siguiente información antes de proceder al pago:
                    </p>
                    <ul className='list-disc ml-5 space-y-2 text-gray-700'>
                      <li>
                        <strong>Añadir coautores:</strong> El autor principal
                        debe incluir a todos los coautores con sus datos de
                        contacto.
                      </li>
                      <li>
                        <strong>Responsabilidades:</strong> Gestionar y
                        coordinar el proceso de publicación, asegurando el envío
                        de capítulos y correcciones.
                      </li>
                      <li>
                        <strong>Participación:</strong> Los coautores colaboran
                        en la edición, pero la responsabilidad final es del
                        autor principal.
                      </li>
                      <li>
                        <strong>Proceso:</strong> Tras añadir coautores y
                        realizar el pago, iniciará la creación y revisión del
                        libro.
                      </li>
                    </ul>
                    <p className='text-gray-700 mt-4'>
                      Recuerda que el cumplimiento de estas normativas es
                      fundamental para una correcta publicación.
                    </p>
                    <p className='text-gray-700 mt-4'>
                      Derechos de autor y correcciones post-publicación aplican
                      según la Ley.
                    </p>
                  </motion.div>
                </div>

                {/* Columna Derecha: Tarjeta de Precio con Información de Edición */}
                <div>
                  {loadingEdition ? (
                    <div>Cargando edición...</div>
                  ) : (
                    <motion.div
                      className='backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-500 relative'
                      initial='hidden'
                      animate='visible'
                      variants={itemVariants}>
                      <div className='absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-sm font-semibold rounded-bl-lg'>
                        Recomendado
                      </div>
                      <div className='p-8'>
                        {currentEdition && (
                          <div className='mb-4'>
                            <h4 className='text-xl font-bold text-purple-800'>
                              Edición Actual: {currentEdition.name}
                            </h4>
                            <p className='text-gray-600'>
                              {currentEdition.description}
                            </p>
                          </div>
                        )}
                        <h3 className='text-2xl font-bold text-center mb-2'>
                          Libro personalizado
                        </h3>
                        <div className='text-center mb-8'>
                          <span className='text-5xl font-bold text-purple-700'>
                            99€
                          </span>
                          <span className='text-gray-600 ml-2'>
                            IVA incluido
                          </span>
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
                            className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white py-6 text-lg rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'>
                            <span className='flex items-center justify-center'>
                              Aceptar Normativa y Continuar
                              <ArrowRight className='ml-2 h-5 w-5' />
                            </span>
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </div>
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
