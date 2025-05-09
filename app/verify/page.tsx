"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Award,
  CheckCircle,
  Download,
  Share2,
  ArrowRight,
  Calendar,
  FileText,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SuccessPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    // Lanzar confeti al cargar la página
    const launchConfetti = () => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: any = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        // Usar colores de tu tema
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors: ["#5E3B8B", "#F7C429"],
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors: ["#5E3B8B", "#F7C429"],
        });
      }, 250);
    };

    launchConfetti();
  }, []);

  // Animación para los elementos
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
    <div className='relative min-h-screen overflow-hidden py-12 px-4 sm:px-6 lg:px-8'>
      {/* Fondo con gradiente y "blobs" */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>

      <div className='container mx-auto max-w-4xl relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-8'>
          <div className='inline-flex items-center justify-center p-2 bg-green-100 rounded-full mb-4'>
            <CheckCircle className='h-8 w-8 text-green-600' />
          </div>
          <h1 className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900'>
            ¡Certificación Completada!
          </h1>
          <div className='w-24 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto my-4'></div>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Tu publicación ha sido verificada y certificada exitosamente. A
            continuación encontrarás todos los detalles de tu certificado.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-white/50 overflow-hidden'>
          <div className='p-6 md:p-8'>
            <div className='flex flex-col md:flex-row items-start md:items-center gap-6 mb-8'>
              <motion.div variants={itemVariants} className='flex-shrink-0'>
                <div className='relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-lg'>
                  <Award className='w-12 h-12 md:w-16 md:h-16 text-white' />
                  <div className='absolute -bottom-3 -right-3 bg-yellow-400 rounded-full p-2 shadow-md'>
                    <CheckCircle className='w-5 h-5 text-white' />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className='flex-1'>
                <Badge className='mb-2 bg-purple-100 text-purple-800 hover:bg-purple-200 border-none'>
                  Publicación científica validada
                </Badge>
                <h2 className='text-xl md:text-2xl font-bold text-gray-900 mb-2'>
                  Certificado de Autoría
                </h2>
                <p className='text-gray-600 text-sm'>
                  Este certificado verifica que eres autor/a de la publicación
                  científica detallada a continuación.
                </p>
              </motion.div>
            </div>

            <motion.div
              variants={itemVariants}
              className='grid md:grid-cols-2 gap-6 mb-8'>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg flex items-center gap-2'>
                    <FileText className='h-5 w-5 text-purple-600' />
                    Información de la Publicación
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 pt-0'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Título</p>
                    <p className='font-medium'>
                      Avances en Inteligencia Artificial Aplicada a la Educación
                      Superior
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Tipo</p>
                    <p>
                      Estudios de investigación con resultados o revisiones
                      bibliográficas
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>ISBN</p>
                    <p>978-84-19937-71-1</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-lg flex items-center gap-2'>
                    <BookOpen className='h-5 w-5 text-purple-600' />
                    Detalles Adicionales
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-3 pt-0'>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Publicación
                    </p>
                    <p>
                      XXV Lecciones en Educación y Promoción de la Salud
                      Comunitaria y Hospitalaria
                    </p>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>
                      Fecha de Certificación
                    </p>
                    <div className='flex items-center gap-2'>
                      <Calendar className='h-4 w-4 text-purple-600' />
                      <p>
                        {isClient
                          ? new Date().toLocaleDateString()
                          : "Cargando fecha..."}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-500'>Estado</p>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant='outline'
                        className='bg-green-50 text-green-700 border-green-200'>
                        Verificado
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className='bg-gradient-to-r from-purple-50 to-purple-100 border-none'>
                <CardHeader>
                  <CardTitle className='text-lg'>Autores</CardTitle>
                  <CardDescription>
                    Colaboradores certificados en esta publicación
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className='space-y-2'>
                    {[
                      "Ana María Rodríguez López",
                      "Carlos Martínez García",
                      "Elena Sánchez Fernández",
                    ].map((author, index) => (
                      <li
                        key={index}
                        className='flex items-center gap-2 p-2 bg-white rounded-lg shadow-sm'>
                        <div className='w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white font-medium'>
                          {author.split(" ")[0][0]}
                          {author.split(" ")[1][0]}
                        </div>
                        <span className='font-medium'>{author}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className='bg-gradient-to-r from-purple-600 to-purple-800 p-6 md:p-8 text-white'>
            <div className='flex flex-col md:flex-row items-center justify-between gap-4'>
              <div>
                <h3 className='text-xl font-bold mb-2'>¿Qué hacer ahora?</h3>
                <p className='text-purple-100 text-sm'>
                  Puedes descargar tu certificado o compartirlo directamente
                </p>
              </div>
              <div className='flex flex-wrap gap-3'>
                <Button className='bg-white text-purple-800 hover:bg-purple-50'>
                  <Download className='mr-2 h-4 w-4' />
                  Descargar Certificado
                </Button>
                <Button
                  variant='outline'
                  className='bg-transparent border-white text-white hover:bg-white/20'>
                  <Share2 className='mr-2 h-4 w-4' />
                  Compartir
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className='mt-8 text-center text-sm text-gray-500'>
          <p>
            Este certificado ha sido generado digitalmente y está respaldado por
            nuestra plataforma.
            <br />
            Para verificar la autenticidad, utilice el código QR o visite
            nuestro sitio web oficial.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
