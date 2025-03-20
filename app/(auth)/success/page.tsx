"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Home,
  Calendar,
  ShieldCheck,
  Award,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("No se encontró información de la sesión");
      setLoading(false);
      return;
    }

    // Simulamos la obtención de información del pago
    // En un caso real, harías una llamada a tu API para verificar el pago con Stripe
    setTimeout(() => {
      setPaymentInfo({
        id: sessionId,
        amount: "99,00 €",
        date: new Date().toLocaleDateString(),
        product: "Libro personalizado",
        email: "usuario@ejemplo.com",
      });
      setLoading(false);
    }, 1500);
  }, [sessionId]);

  // Animación para el check mark
  const checkVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
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
      <div className='flex items-center justify-center min-h-[70vh]'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <BookOpen className='h-6 w-6 text-purple-500' />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[70vh] text-center px-4'>
        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6'>
          <span className='text-red-500 text-2xl'>×</span>
        </div>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          Ha ocurrido un error
        </h1>
        <p className='text-gray-600 mb-6 max-w-md'>{error}</p>
        <Button
          onClick={() => router.push("/dashboard")}
          className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
          Volver al panel
        </Button>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-12 md:py-20'>
      {/* Background with gradient and blobs */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10'>
        <div className='max-w-3xl mx-auto'>
          <div className='text-center mb-12'>
            <motion.div
              className='w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}>
              <motion.div className='w-16 h-16'>
                <svg viewBox='0 0 24 24' className='w-full h-full'>
                  <motion.path
                    d='M5 13l4 4L19 7'
                    fill='transparent'
                    stroke='#22c55e'
                    strokeWidth={3}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    variants={checkVariants}
                    initial='hidden'
                    animate='visible'
                  />
                </svg>
              </motion.div>
            </motion.div>

            <motion.h1
              className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              ¡Pago completado con éxito!
            </motion.h1>

            <motion.p
              className='text-gray-600 max-w-lg mx-auto'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}>
              Tu libro personalizado ha sido creado correctamente. Ahora puedes
              comenzar a añadir capítulos y colaboradores.
            </motion.p>
          </div>

          <motion.div
            className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 mb-10'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            <h2 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
              <Sparkles className='mr-2 h-5 w-5 text-purple-600' />
              Detalles de la transacción
            </h2>

            <div className='grid md:grid-cols-2 gap-6'>
              <div className='flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-gray-100 shadow-sm'>
                <div className='bg-purple-100 p-2 rounded-full'>
                  <BookOpen className='h-5 w-5 text-purple-700' />
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Producto</p>
                  <p className='font-medium'>{paymentInfo.product}</p>
                </div>
              </div>

              <div className='flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-gray-100 shadow-sm'>
                <div className='bg-green-100 p-2 rounded-full'>
                  <Award className='h-5 w-5 text-green-700' />
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Importe</p>
                  <p className='font-medium'>{paymentInfo.amount}</p>
                </div>
              </div>

              <div className='flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-gray-100 shadow-sm'>
                <div className='bg-blue-100 p-2 rounded-full'>
                  <Calendar className='h-5 w-5 text-blue-700' />
                </div>
                <div>
                  <p className='text-xs text-gray-500'>Fecha</p>
                  <p className='font-medium'>{paymentInfo.date}</p>
                </div>
              </div>

              <div className='flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-gray-100 shadow-sm'>
                <div className='bg-yellow-100 p-2 rounded-full'>
                  <ShieldCheck className='h-5 w-5 text-yellow-700' />
                </div>
                <div>
                  <p className='text-xs text-gray-500'>ID de transacción</p>
                  <p className='font-medium text-sm truncate max-w-[200px]'>
                    {paymentInfo.id}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial='hidden'
            animate='visible'
            className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 mb-10'>
            <motion.h2
              variants={itemVariants}
              className='text-xl font-bold text-gray-900 mb-6'>
              Próximos pasos
            </motion.h2>

            <div className='space-y-4'>
              <motion.div
                variants={itemVariants}
                className='flex items-start gap-4 bg-white/60 p-4 rounded-lg border border-gray-100 shadow-sm'>
                <div className='bg-purple-100 p-2 rounded-full mt-1'>
                  <span className='flex items-center justify-center w-5 h-5 text-purple-700 font-bold'>
                    1
                  </span>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    Personaliza tu libro
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Añade una descripción y configura los detalles de tu libro.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className='flex items-start gap-4 bg-white/60 p-4 rounded-lg border border-gray-100 shadow-sm'>
                <div className='bg-purple-100 p-2 rounded-full mt-1'>
                  <span className='flex items-center justify-center w-5 h-5 text-purple-700 font-bold'>
                    2
                  </span>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    Invita colaboradores
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Puedes invitar hasta 6 colaboradores adicionales para tu
                    libro.
                  </p>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className='flex items-start gap-4 bg-white/60 p-4 rounded-lg border border-gray-100 shadow-sm'>
                <div className='bg-purple-100 p-2 rounded-full mt-1'>
                  <span className='flex items-center justify-center w-5 h-5 text-purple-700 font-bold'>
                    3
                  </span>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    Crea tu primer capítulo
                  </h3>
                  <p className='text-gray-600 text-sm'>
                    Comienza a escribir el contenido de tu libro añadiendo
                    capítulos.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className='flex flex-col sm:flex-row gap-4 justify-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}>
            <Link href='/dashboard'>
              <Button
                variant='outline'
                className='w-full sm:w-auto border-purple-200 hover:bg-purple-50 hover:text-purple-700'>
                <Home className='mr-2 h-4 w-4' />
                Ir al panel
              </Button>
            </Link>

            <Link href='/publications'>
              <Button className='w-full sm:w-auto bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
                <BookOpen className='mr-2 h-4 w-4' />
                Ver mis publicaciones
                <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
