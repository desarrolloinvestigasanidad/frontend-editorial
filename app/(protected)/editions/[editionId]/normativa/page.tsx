"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  Info,
  Calendar,
  BookOpen,
  FileText,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function NormativaPage() {
  const { editionId } = useParams();
  const router = useRouter();
  const [edition, setEdition] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}`)
      .then((res) => res.json())
      .then((data) => {
        setEdition(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching edition:", err);
        setLoading(false);
      });
  }, [editionId]);

  // Formatear fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no disponible";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-600 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <FileText className='h-6 w-6 text-purple-600' />
          </div>
        </div>
      </div>
    );
  }

  if (!edition) return <div>Edición no encontrada.</div>;

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
          className='mb-8'>
          <Button
            variant='ghost'
            className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50 mb-6'
            onClick={() => router.back()}>
            <ChevronLeft className='mr-1 h-4 w-4' />
            Volver
          </Button>

          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-purple-800'>
                Normativa de Publicación
              </h1>
              <p className='text-gray-600 mt-1'>{edition.name}</p>
            </div>

            {edition.deadlineChapters && (
              <Badge
                variant='outline'
                className='bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1.5 py-1.5'>
                <Calendar className='h-3.5 w-3.5' />
                Fecha límite: {formatDate(edition.deadlineChapters)}
              </Badge>
            )}
          </div>

          <Alert className='bg-purple-50 border-purple-200 mb-8'>
            <Info className='h-4 w-4 text-purple-600' />
            <AlertTitle className='text-purple-700'>
              Información importante
            </AlertTitle>
            <AlertDescription className='text-purple-600'>
              Esta normativa establece los requisitos y procedimientos para la
              publicación de capítulos en la edición{" "}
              <strong>{edition.name}</strong>. Por favor, léela detenidamente
              antes de enviar tu trabajo.
            </AlertDescription>
          </Alert>
        </motion.div>

        <Tabs defaultValue='general' className='mb-8'>
          <TabsList className='bg-white/80 backdrop-blur-sm border border-gray-100 p-1 mb-6'>
            <TabsTrigger value='general'>Normativa General</TabsTrigger>
            <TabsTrigger value='formato'>Formato de Capítulos</TabsTrigger>
            <TabsTrigger value='proceso'>Proceso Editorial</TabsTrigger>
            <TabsTrigger value='certificados'>Certificados</TabsTrigger>
          </TabsList>

          <TabsContent value='general'>
            <Card className='bg-white/80 backdrop-blur-sm border-white/50'>
              <CardHeader>
                <CardTitle className='text-2xl text-purple-800'>
                  Normativa General
                </CardTitle>
                <CardDescription>
                  Requisitos y condiciones generales para la participación en la
                  edición {edition.name}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Plazos y Fechas Importantes
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-purple-50 p-4 rounded-lg border border-purple-100'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Calendar className='h-5 w-5 text-purple-600' />
                        <h4 className='font-medium text-purple-800'>
                          Envío de Capítulos
                        </h4>
                      </div>
                      <p className='text-sm text-gray-700'>
                        Fecha límite:{" "}
                        <strong>{formatDate(edition.deadlineChapters)}</strong>
                      </p>
                      <p className='text-sm text-gray-600 mt-1'>
                        Los capítulos recibidos después de esta fecha no serán
                        considerados para esta edición.
                      </p>
                    </div>

                    <div className='bg-green-50 p-4 rounded-lg border border-green-100'>
                      <div className='flex items-center gap-2 mb-2'>
                        <Calendar className='h-5 w-5 text-green-600' />
                        <h4 className='font-medium text-green-800'>
                          Publicación
                        </h4>
                      </div>
                      <p className='text-sm text-gray-700'>
                        Fecha estimada:{" "}
                        <strong>{formatDate(edition.publishDate)}</strong>
                      </p>
                      <p className='text-sm text-gray-600 mt-1'>
                        Fecha en la que los libros estarán disponibles para su
                        descarga.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Requisitos de Participación
                  </h3>
                  <ul className='space-y-3'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='text-gray-800 font-medium'>
                          Autoría Original
                        </p>
                        <p className='text-sm text-gray-600'>
                          Los capítulos deben ser originales y no haber sido
                          publicados previamente en otras ediciones o
                          publicaciones.
                        </p>
                      </div>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='text-gray-800 font-medium'>Créditos</p>
                        <p className='text-sm text-gray-600'>
                          Es necesario disponer de créditos para enviar
                          capítulos. Cada capítulo consume un crédito.
                        </p>
                      </div>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='text-gray-800 font-medium'>Temática</p>
                        <p className='text-sm text-gray-600'>
                          Los capítulos deben estar relacionados con la temática
                          del libro al que se envían.
                        </p>
                      </div>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='text-gray-800 font-medium'>Coautores</p>
                        <p className='text-sm text-gray-600'>
                          Se permite un máximo de 6 coautores por capítulo,
                          además del autor principal.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Restricciones
                  </h3>
                  <ul className='space-y-3'>
                    <li className='flex items-start gap-2'>
                      <AlertCircle className='h-5 w-5 text-red-500 mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='text-gray-800 font-medium'>Plagio</p>
                        <p className='text-sm text-gray-600'>
                          No se aceptarán capítulos que contengan plagio o
                          contenido no original. Todos los capítulos serán
                          sometidos a verificación.
                        </p>
                      </div>
                    </li>
                    <li className='flex items-start gap-2'>
                      <AlertCircle className='h-5 w-5 text-red-500 mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='text-gray-800 font-medium'>
                          Contenido Inapropiado
                        </p>
                        <p className='text-sm text-gray-600'>
                          No se aceptará contenido que promueva discriminación,
                          violencia o cualquier actividad ilegal.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='formato'>
            <Card className='bg-white/80 backdrop-blur-sm border-white/50'>
              <CardHeader>
                <CardTitle className='text-2xl text-purple-800'>
                  Formato de Capítulos
                </CardTitle>
                <CardDescription>
                  Requisitos de formato y estructura para los capítulos
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Estructura del Capítulo
                  </h3>
                  <div className='bg-blue-50 p-5 rounded-lg border border-blue-100'>
                    <ul className='space-y-3'>
                      <li className='flex items-start gap-2'>
                        <div className='bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5'>
                          1
                        </div>
                        <div>
                          <p className='text-gray-800 font-medium'>
                            Introducción
                          </p>
                          <p className='text-sm text-gray-600'>
                            Contexto y antecedentes del tema. Entre 50-150
                            palabras.
                          </p>
                        </div>
                      </li>
                      <li className='flex items-start gap-2'>
                        <div className='bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5'>
                          2
                        </div>
                        <div>
                          <p className='text-gray-800 font-medium'>Objetivos</p>
                          <p className='text-sm text-gray-600'>
                            Definición clara de los objetivos del trabajo. Entre
                            50-150 palabras.
                          </p>
                        </div>
                      </li>
                      <li className='flex items-start gap-2'>
                        <div className='bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5'>
                          3
                        </div>
                        <div>
                          <p className='text-gray-800 font-medium'>
                            Metodología
                          </p>
                          <p className='text-sm text-gray-600'>
                            Descripción del método y técnicas utilizadas. Entre
                            30-100 palabras.
                          </p>
                        </div>
                      </li>
                      <li className='flex items-start gap-2'>
                        <div className='bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5'>
                          4
                        </div>
                        <div>
                          <p className='text-gray-800 font-medium'>
                            Resultados
                          </p>
                          <p className='text-sm text-gray-600'>
                            Presentación de los resultados obtenidos. Entre
                            50-250 palabras.
                          </p>
                        </div>
                      </li>
                      <li className='flex items-start gap-2'>
                        <div className='bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5'>
                          5
                        </div>
                        <div>
                          <p className='text-gray-800 font-medium'>
                            Discusión-Conclusión
                          </p>
                          <p className='text-sm text-gray-600'>
                            Interpretación de los resultados y conclusiones.
                            Entre 30-150 palabras.
                          </p>
                        </div>
                      </li>
                      <li className='flex items-start gap-2'>
                        <div className='bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5'>
                          6
                        </div>
                        <div>
                          <p className='text-gray-800 font-medium'>
                            Bibliografía
                          </p>
                          <p className='text-sm text-gray-600'>
                            Referencias bibliográficas utilizadas. Entre 30-150
                            palabras.
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Tipos de Estudio
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='bg-white p-4 rounded-lg border border-gray-200'>
                      <h4 className='font-medium text-purple-800 mb-2'>
                        Revisión bibliográfica
                      </h4>
                      <p className='text-sm text-gray-600'>
                        Análisis crítico de la literatura existente sobre un
                        tema específico.
                      </p>
                    </div>
                    <div className='bg-white p-4 rounded-lg border border-gray-200'>
                      <h4 className='font-medium text-purple-800 mb-2'>
                        Caso clínico
                      </h4>
                      <p className='text-sm text-gray-600'>
                        Descripción detallada de un caso médico particular, su
                        diagnóstico y tratamiento.
                      </p>
                    </div>
                    <div className='bg-white p-4 rounded-lg border border-gray-200'>
                      <h4 className='font-medium text-purple-800 mb-2'>
                        Protocolo
                      </h4>
                      <p className='text-sm text-gray-600'>
                        Descripción de un procedimiento estandarizado para una
                        intervención o tratamiento.
                      </p>
                    </div>
                    <div className='bg-white p-4 rounded-lg border border-gray-200'>
                      <h4 className='font-medium text-purple-800 mb-2'>
                        Otros trabajos de investigación
                      </h4>
                      <p className='text-sm text-gray-600'>
                        Estudios originales que no se ajustan a las categorías
                        anteriores.
                      </p>
                    </div>
                  </div>
                </div>

                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Requisitos de Formato
                  </h3>
                  <ul className='space-y-3'>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='text-gray-800 font-medium'>Extensión</p>
                        <p className='text-sm text-gray-600'>
                          El capítulo completo debe tener entre 300 y 1000
                          palabras en total.
                        </p>
                      </div>
                    </li>
                    <li className='flex items-start gap-2'>
                      <CheckCircle className='h-5 w-5 text-green-500 mt-0.5 flex-shrink-0' />
                      <div>
                        <p className='text-gray-800 font-medium'>Referencias</p>
                        <p className='text-sm text-gray-600'>
                          Las referencias bibliográficas deben seguir el formato
                          APA o Vancouver.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='proceso'>
            <Card className='bg-white/80 backdrop-blur-sm border-white/50'>
              <CardHeader>
                <CardTitle className='text-2xl text-purple-800'>
                  Proceso Editorial
                </CardTitle>
                <CardDescription>
                  Etapas del proceso de revisión y publicación
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Etapas del Proceso
                  </h3>
                  <div className='relative'>
                    <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-purple-200'></div>
                    <div className='space-y-8 relative'>
                      <div className='relative pl-12'>
                        <div className='absolute left-0 w-8 h-8 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center'>
                          <span className='text-purple-700 font-bold'>1</span>
                        </div>
                        <h4 className='text-lg font-medium text-purple-800'>
                          Envío del Capítulo
                        </h4>
                        <p className='text-gray-600 mt-1'>
                          El autor envía su capítulo a través de la plataforma,
                          seleccionando el libro al que desea contribuir.
                        </p>
                      </div>

                      <div className='relative pl-12'>
                        <div className='absolute left-0 w-8 h-8 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center'>
                          <span className='text-purple-700 font-bold'>2</span>
                        </div>
                        <h4 className='text-lg font-medium text-purple-800'>
                          Revisión Inicial
                        </h4>
                        <p className='text-gray-600 mt-1'>
                          El equipo editorial realiza una primera revisión para
                          verificar que el capítulo cumple con los requisitos
                          básicos de formato y contenido.
                        </p>
                      </div>

                      <div className='relative pl-12'>
                        <div className='absolute left-0 w-8 h-8 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center'>
                          <span className='text-purple-700 font-bold'>3</span>
                        </div>
                        <h4 className='text-lg font-medium text-purple-800'>
                          Decisión Editorial
                        </h4>
                        <p className='text-gray-600 mt-1'>
                          Basándose en las revisiones, el equipo editorial toma
                          una decisión: aceptación, solicitud de modificaciones
                          o rechazo.
                        </p>
                      </div>

                      <div className='relative pl-12'>
                        <div className='absolute left-0 w-8 h-8 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center'>
                          <span className='text-purple-700 font-bold'>4</span>
                        </div>
                        <h4 className='text-lg font-medium text-purple-800'>
                          Correcciones (si aplica)
                        </h4>
                        <p className='text-gray-600 mt-1'>
                          Si se solicitan modificaciones, el autor debe
                          realizarlas y volver a enviar el capítulo para una
                          nueva revisión.
                        </p>
                      </div>

                      <div className='relative pl-12'>
                        <div className='absolute left-0 w-8 h-8 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center'>
                          <span className='text-purple-700 font-bold'>5</span>
                        </div>
                        <h4 className='text-lg font-medium text-purple-800'>
                          Maquetación
                        </h4>
                        <p className='text-gray-600 mt-1'>
                          Los capítulos aceptados pasan a la fase de maquetación
                          para su inclusión en el libro.
                        </p>
                      </div>

                      <div className='relative pl-12'>
                        <div className='absolute left-0 w-8 h-8 rounded-full bg-purple-100 border-2 border-purple-300 flex items-center justify-center'>
                          <span className='text-purple-700 font-bold'>6</span>
                        </div>
                        <h4 className='text-lg font-medium text-purple-800'>
                          Publicación
                        </h4>
                        <p className='text-gray-600 mt-1'>
                          El libro completo se publica en la fecha establecida y
                          se pone a disposición de los autores y lectores.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value='certificados'>
            <Card className='bg-white/80 backdrop-blur-sm border-white/50'>
              <CardHeader>
                <CardTitle className='text-2xl text-purple-800'>
                  Certificados
                </CardTitle>
                <CardDescription>
                  Información sobre los certificados de participación
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-6'>
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Tipos de Certificados
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                      <div className='flex items-center gap-3 mb-3'>
                        <div className='bg-purple-100 p-2 rounded-full'>
                          <BookOpen className='h-5 w-5 text-purple-600' />
                        </div>
                        <h4 className='text-lg font-medium text-purple-800'>
                          Certificado de Autoría
                        </h4>
                      </div>
                      <p className='text-gray-600 mb-4'>
                        Certifica que el autor ha participado en la edición con
                        uno o más capítulos. Incluye el título del capítulo, el
                        libro y el ISBN.
                      </p>
                      <ul className='space-y-2'>
                        <li className='flex items-center gap-2'>
                          <CheckCircle className='h-4 w-4 text-green-500' />
                          <span className='text-sm text-gray-700'>
                            Reconocimiento oficial de autoría
                          </span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <CheckCircle className='h-4 w-4 text-green-500' />
                          <span className='text-sm text-gray-700'>
                            Incluye ISBN del libro
                          </span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <CheckCircle className='h-4 w-4 text-green-500' />
                          <span className='text-sm text-gray-700'>
                            Formato digital descargable
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className='bg-white p-6 rounded-lg border border-gray-200 shadow-sm'>
                      <div className='flex items-center gap-3 mb-3'>
                        <div className='bg-blue-100 p-2 rounded-full'>
                          <FileText className='h-5 w-5 text-blue-600' />
                        </div>
                        <h4 className='text-lg font-medium text-blue-800'>
                          Certificado de Coautoría
                        </h4>
                      </div>
                      <p className='text-gray-600 mb-4'>
                        Certifica la participación como coautor en un capítulo.
                        Incluye el título del capítulo, el libro y el ISBN.
                      </p>
                      <ul className='space-y-2'>
                        <li className='flex items-center gap-2'>
                          <CheckCircle className='h-4 w-4 text-green-500' />
                          <span className='text-sm text-gray-700'>
                            Reconocimiento oficial de coautoría
                          </span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <CheckCircle className='h-4 w-4 text-green-500' />
                          <span className='text-sm text-gray-700'>
                            Incluye ISBN del libro
                          </span>
                        </li>
                        <li className='flex items-center gap-2'>
                          <CheckCircle className='h-4 w-4 text-green-500' />
                          <span className='text-sm text-gray-700'>
                            Formato digital descargable
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className='space-y-4 mt-6'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Descarga de Certificados
                  </h3>
                  <div className='bg-yellow-50 p-5 rounded-lg border border-yellow-200'>
                    <div className='flex items-start gap-3'>
                      <Info className='h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0' />
                      <div>
                        <h4 className='font-medium text-yellow-800 mb-1'>
                          Disponibilidad
                        </h4>
                        <p className='text-sm text-gray-700'>
                          Los certificados estarán disponibles para su descarga
                          a partir de la fecha de publicación del libro:{" "}
                          <strong>{formatDate(edition.publishDate)}</strong>.
                        </p>
                        <p className='text-sm text-gray-600 mt-2'>
                          Para descargar los certificados, deberás acceder a tu
                          perfil en la plataforma y dirigirte a la sección "Mis
                          Certificados".
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='space-y-4 mt-6'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    Validez y Reconocimiento
                  </h3>
                  <p className='text-gray-700'>
                    Los certificados emitidos por Investiga Sanidad cuentan con
                    validez académica y profesional, respaldados por el ISBN
                    oficial de la publicación. Pueden ser utilizados para:
                  </p>
                  <ul className='grid grid-cols-1 md:grid-cols-2 gap-3 mt-3'>
                    <li className='flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200'>
                      <CheckCircle className='h-4 w-4 text-green-500' />
                      <span className='text-sm text-gray-700'>
                        Currículum académico y profesional
                      </span>
                    </li>
                    <li className='flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200'>
                      <CheckCircle className='h-4 w-4 text-green-500' />
                      <span className='text-sm text-gray-700'>
                        Méritos en oposiciones y concursos
                      </span>
                    </li>
                    <li className='flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200'>
                      <CheckCircle className='h-4 w-4 text-green-500' />
                      <span className='text-sm text-gray-700'>
                        Acreditación de actividad investigadora
                      </span>
                    </li>
                    <li className='flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200'>
                      <CheckCircle className='h-4 w-4 text-green-500' />
                      <span className='text-sm text-gray-700'>
                        Desarrollo profesional continuo
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className='flex justify-center mt-8'>
          <Button
            className='bg-purple-600 hover:bg-purple-700'
            onClick={() => router.push(`/editions/${editionId}`)}>
            Volver a la Edición
          </Button>
        </div>
      </div>
    </div>
  );
}
