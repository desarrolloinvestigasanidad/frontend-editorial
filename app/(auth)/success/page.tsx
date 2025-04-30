"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import Link from "next/link";

type StripeSession = {
  id: string;
  metadata: {
    editionId?: string;
    // otros campos de metadata si los necesitas...
  };
  // puedes añadir aquí más campos de StripeSession si los vas a usar
};
const API_URL = process.env.NEXT_PUBLIC_BASE_URL;
export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<StripeSession | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("No se encontró información de la sesión");
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/checkout?sessionId=${sessionId}`)
      .then((res) => {
        if (!res.ok) throw new Error("No se pudo recuperar la sesión");
        return res.json();
      })
      .then((data) => {
        setSession(data.session);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Error al recuperar la sesión");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sessionId]);

  // Variants para la animación del check
  const checkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[70vh]'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <BookOpen className='h-6 w-6 text-purple-500' />
          </div>
        </div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[70vh] text-center px-4'>
        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6'>
          <span className='text-red-500 text-2xl'>×</span>
        </div>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          Ha ocurrido un error
        </h1>
        <p className='text-gray-600 mb-6 max-w-md'>
          {error || "Sesión inválida"}
        </p>
        <Button
          onClick={() => router.push("/dashboard")}
          className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
          Volver al panel
        </Button>
      </div>
    );
  }

  // Si editionId existe, es compra de capítulos; si no, libro personalizado
  const { editionId } = session.metadata;

  return (
    <div className='relative overflow-hidden py-12 md:py-20 min-h-screen flex items-center justify-center'>
      {/* fondos degradados y blobs */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white' />
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob' />
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000' />
      </div>

      <div className='container mx-auto px-4 relative z-10 flex items-center justify-center'>
        <div className='max-w-3xl mx-auto text-center'>
          <motion.div
            className='w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6'
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <motion.svg viewBox='0 0 24 24' className='w-16 h-16'>
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
            </motion.svg>
          </motion.div>

          <motion.h1
            className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            ¡Pago realizado con éxito!
          </motion.h1>

          <motion.div
            className='flex flex-col sm:flex-row gap-4 justify-center mt-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}>
            {editionId ? (
              <Link href={`/editions/${editionId}`}>
                <Button
                  variant='outline'
                  className='border-purple-200 hover:bg-purple-50 hover:text-purple-700'>
                  <BookOpen className='mr-2 h-4 w-4' />
                  Ir a la edición
                </Button>
              </Link>
            ) : (
              <Link href='/publications'>
                <Button
                  variant='outline'
                  className='border-purple-200 hover:bg-purple-50 hover:text-purple-700'>
                  <BookOpen className='mr-2 h-4 w-4' />
                  Mis libros personalizados
                </Button>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
