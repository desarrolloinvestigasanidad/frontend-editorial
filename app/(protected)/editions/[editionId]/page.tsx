"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  CreditCard,
  Send,
  BookMarked,
  ChevronRight,
  Info,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { useAvailableCredits } from "@/hooks/useAvailableCredits";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function EditionDetailPage() {
  const { editionId } = useParams();
  const router = useRouter();
  const [edition, setEdition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userChapters, setUserChapters] = useState<any[]>([]);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [books, setBooks] = useState<any[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(true);

  const { availableCredits, loadingCredits } = useAvailableCredits(
    editionId as string
  );

  // Obtener datos de la edición
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

  // Obtener libros de la edición
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books`)
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoadingBooks(false);
      })
      .catch((err) => {
        console.error("Error fetching books:", err);
        setLoadingBooks(false);
      });
  }, [editionId]);

  // Obtener capítulos del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      setLoadingChapters(false);
      return;
    }

    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/users/${userId}/chapters?editionId=${editionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUserChapters(data);
        setLoadingChapters(false);
      })
      .catch((err) => {
        console.error("Error fetching user chapters:", err);
        setLoadingChapters(false);
      });
  }, [editionId]);

  // Variantes de animación
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
      transition: { duration: 0.4 },
    },
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-600 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <BookOpen className='h-6 w-6 text-purple-600' />
          </div>
        </div>
      </div>
    );
  }

  if (!edition) return <div>Edición no encontrada.</div>;

  // Formatear fechas
  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no disponible";
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
          className='mb-8'>
          <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6'>
            <div>
              <h1 className='text-3xl font-bold text-purple-800'>
                {edition.name}
              </h1>
              <p className='text-gray-600 mt-1'>{edition.description}</p>
            </div>

            <div className='flex flex-wrap gap-3'>
              {edition.deadlineChapters && (
                <Badge
                  variant='outline'
                  className='bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1.5 py-1.5'>
                  <Calendar className='h-3.5 w-3.5' />
                  Fecha límite: {formatDate(edition.deadlineChapters)}
                </Badge>
              )}

              {!loadingCredits && (
                <Badge
                  variant='outline'
                  className='bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1.5 py-1.5'>
                  <BookMarked className='h-3.5 w-3.5' />
                  {availableCredits} participaciones disponibles
                </Badge>
              )}
            </div>
          </div>

          {/* Alerta informativa */}
          <Alert className='bg-purple-50 border-purple-200 mb-8'>
            <Info className='h-4 w-4 text-purple-600' />
            <AlertTitle className='text-purple-700'>
              Información importante
            </AlertTitle>
            <AlertDescription className='text-purple-600'>
              Participa en esta edición enviando tus capítulos antes del{" "}
              {formatDate(edition.deadlineChapters)}. Recuerda revisar la
              normativa y asegurarte de tener créditos disponibles.
            </AlertDescription>
          </Alert>
        </motion.div>

        <Tabs defaultValue='opciones' className='mb-8'>
          <TabsList className='bg-white/80 backdrop-blur-sm border border-gray-100 p-1 mb-6 min-h-[80px]'>
            <TabsTrigger value='opciones' className='h-full '>
              Opciones de participación
            </TabsTrigger>
            <TabsTrigger value='mis-capitulos' className='h-full'>
              Mis capítulos enviados
            </TabsTrigger>
          </TabsList>

          <TabsContent value='opciones'>
            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {/* Tarjeta de Normativa */}
              <motion.div variants={itemVariants}>
                <Card className='h-full flex flex-col justify-between bg-white/80 backdrop-blur-sm border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
                  <CardHeader className='pb-2'>
                    <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2'>
                      <FileText className='h-6 w-6 text-purple-600' />
                    </div>
                    <CardTitle className='text-xl text-purple-800'>
                      Normativa
                    </CardTitle>
                    <CardDescription>
                      Consulta las reglas y requisitos para participar
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='text-sm text-gray-600 flex-grow'>
                    <p>
                      Revisa la normativa completa para conocer los requisitos
                      de formato, plazos y proceso de revisión de los capítulos.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant='outline'
                      className='w-full border-purple-200 text-purple-700 hover:bg-purple-50'
                      onClick={() =>
                        router.push(`/editions/${editionId}/normativa`)
                      }>
                      Ver normativa
                      <ChevronRight className='ml-2 h-4 w-4' />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Tarjeta de Pago de Tasas */}
              <motion.div variants={itemVariants}>
                <Card className='h-full flex flex-col justify-between bg-white/80 backdrop-blur-sm border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
                  <CardHeader className='pb-2'>
                    <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2'>
                      <CreditCard className='h-6 w-6 text-green-600' />
                    </div>
                    <CardTitle className='text-xl text-green-700'>
                      Pago de Tasas
                    </CardTitle>
                    <CardDescription>
                      Adquiere créditos para enviar capítulos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='text-sm text-gray-600 flex-grow'>
                    <p>
                      Compra créditos para poder enviar tus capítulos. Cada
                      crédito te permite enviar un capítulo a cualquier libro de
                      esta edición.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant='outline'
                      className='w-full border-green-200 text-green-700 hover:bg-green-50'
                      onClick={() => {
                        if (books.length > 0) {
                          router.push(
                            `/editions/${editionId}/books/${books[0].id}/chapters/purchase`
                          );
                        } else {
                          alert(
                            "No hay libros disponibles para comprar créditos"
                          );
                        }
                      }}>
                      Abonar la tasa
                      <ChevronRight className='ml-2 h-4 w-4' />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>

              {/* Tarjeta de Enviar Capítulos */}
              <motion.div variants={itemVariants}>
                <Card className='h-full flex flex-col justify-between bg-white/80 backdrop-blur-sm border-white/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1'>
                  <CardHeader className='pb-2'>
                    <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2'>
                      <Send className='h-6 w-6 text-blue-600' />
                    </div>
                    <CardTitle className='text-xl text-blue-700'>
                      Enviar Capítulos
                    </CardTitle>
                    <CardDescription>
                      Crea y envía tus capítulos para revisión
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='text-sm text-gray-600 flex-grow'>
                    <p>
                      Selecciona un libro y envía tu capítulo para que sea
                      revisado y publicado en la edición actual.
                    </p>
                    {availableCredits === 0 && !loadingCredits && (
                      <Alert variant='destructive' className='mt-2 py-2'>
                        <AlertCircle className='h-4 w-4' />
                        <AlertTitle className='text-xs'>
                          Sin participaciones disponibles
                        </AlertTitle>
                        <AlertDescription className='text-xs'>
                          Necesitas comprar participaciones para enviar
                          capítulos.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant='outline'
                      className='w-full border-blue-200 text-blue-700 hover:bg-blue-50'
                      onClick={() =>
                        router.push(`/editions/${editionId}/books`)
                      }
                      disabled={availableCredits === 0 && !loadingCredits}>
                      Seleccionar libro
                      <ChevronRight className='ml-2 h-4 w-4' />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value='mis-capitulos'>
            <div className='bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 p-6'>
              <h2 className='text-xl font-bold text-purple-800 mb-4'>
                Mis Capítulos
              </h2>

              {loadingChapters ? (
                <div className='flex justify-center py-8'>
                  <div className='relative'>
                    <div className='h-10 w-10 rounded-full border-t-2 border-b-2 border-purple-600 animate-spin'></div>
                  </div>
                </div>
              ) : userChapters.length > 0 ? (
                <div className='space-y-4'>
                  {userChapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className='bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <h3 className='font-medium text-gray-800'>
                            {chapter.title}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            Libro: {chapter.bookTitle || "Sin especificar"}
                          </p>
                          <div className='flex items-center mt-2'>
                            <Badge
                              className={
                                chapter.status === "approved"
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : chapter.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                  : chapter.status === "rejected"
                                  ? "bg-red-100 text-red-800 border-red-200"
                                  : "bg-gray-100 text-gray-800 border-gray-200"
                              }>
                              {chapter.status === "approved"
                                ? "Aprobado"
                                : chapter.status === "pending"
                                ? "Pendiente"
                                : chapter.status === "rejected"
                                ? "Rechazado"
                                : "Desconocido"}
                            </Badge>
                            <span className='text-xs text-gray-500 ml-3'>
                              Enviado: {formatDate(chapter.createdAt)}
                            </span>
                          </div>
                        </div>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-purple-600 border-purple-200 hover:bg-purple-50'
                          onClick={() =>
                            router.push(
                              `/editions/${editionId}/books/${chapter.bookId}/chapters/${chapter.id}`
                            )
                          }>
                          Ver detalles
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-8'>
                  <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                    <BookMarked className='h-8 w-8 text-gray-400' />
                  </div>
                  <h3 className='text-lg font-medium text-gray-700 mb-2'>
                    No tienes capítulos
                  </h3>
                  <p className='text-gray-500 mb-6'>
                    Aún no has enviado ningún capítulo para esta edición.
                  </p>
                  <Button
                    onClick={() => router.push(`/editions/${editionId}/books`)}
                    className='bg-purple-600 hover:bg-purple-700'>
                    Enviar mi primer capítulo
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
