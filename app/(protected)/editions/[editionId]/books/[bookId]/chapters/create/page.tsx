"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  ChevronLeft,
  FileText,
  Send,
  AlertCircle,
  CheckCircle,
  Info,
  BookMarked,
  Lightbulb,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CreateChapterPage() {
  const { editionId, bookId } = useParams();
  const router = useRouter();

  // Estados para los campos del capítulo
  const [title, setTitle] = useState("");
  const [studyType, setStudyType] = useState("");
  const [methodology, setMethodology] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [objectives, setObjectives] = useState("");
  const [results, setResults] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [bibliography, setBibliography] = useState("");

  // Estado para authorId obtenido desde GET /profile
  const [authorId, setAuthorId] = useState("");
  const [bookTitle, setBookTitle] = useState("");

  // Obtener perfil y extraer authorId
  useEffect(() => {
    const fetchProfile = async () => {
      console.log("Llamando a fetchProfile...");
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!res.ok) {
            throw new Error("Error al obtener el perfil");
          }
          const data = await res.json();
          console.log("Perfil obtenido:", data);
          if (data && data.id) {
            setAuthorId(data.id);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        console.warn("Token no encontrado en sessionStorage.");
      }
    };

    const fetchBookDetails = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`
        );
        if (res.ok) {
          const data = await res.json();
          setBookTitle(data.title || "Libro seleccionado");
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      }
    };

    fetchProfile();
    fetchBookDetails();
  }, [editionId, bookId]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Verificamos que se haya obtenido el authorId
    if (!authorId) {
      setError("No se pudo obtener el perfil del autor. Intente nuevamente.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Se envía el campo "content" usando la introducción como fallback.
      const body = {
        title,
        studyType,
        methodology,
        introduction,
        objectives,
        results,
        discussion,
        bibliography,
        authorId,
        content: introduction,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}/chapters`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear el capítulo");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/editions/${editionId}/books/${bookId}/chapters`);
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Animación para los elementos del formulario
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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

  if (success) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='text-center p-8 max-w-md'>
          <div className='mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4'>
            <CheckCircle className='h-8 w-8 text-green-600' />
          </div>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>
            ¡Capítulo enviado con éxito!
          </h2>
          <p className='text-gray-600 mb-6'>
            Tu capítulo ha sido enviado correctamente y está pendiente de
            revisión.
          </p>
          <Button
            className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
            onClick={() =>
              router.push(`/editions/${editionId}/books/${bookId}/chapters`)
            }>
            Ver todos los capítulos
          </Button>
        </motion.div>
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

      <div className='container mx-auto px-4 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between mb-8'>
          <Button
            variant='ghost'
            className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50'
            onClick={() => router.back()}>
            <ChevronLeft className='mr-1 h-4 w-4' />
            Volver
          </Button>

          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Nuevo Capítulo
          </div>
        </motion.div>

        <div className='grid md:grid-cols-3 gap-8'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='md:col-span-2'>
            <div className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50'>
              <div className='flex items-center gap-4 mb-6'>
                <div className='bg-purple-100 p-4 rounded-full'>
                  <FileText className='h-6 w-6 text-purple-700' />
                </div>
                <div>
                  <h1 className='text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900'>
                    Crear Nuevo Capítulo
                  </h1>
                  <p className='text-gray-600'>
                    Para el libro:{" "}
                    <span className='font-medium'>{bookTitle}</span>
                  </p>
                </div>
              </div>

              {error && (
                <Alert variant='destructive' className='mb-6'>
                  <AlertCircle className='h-4 w-4' />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className='space-y-6'>
                <motion.div
                  initial='hidden'
                  animate='visible'
                  variants={containerVariants}>
                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Título del capítulo
                    </Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder='Ej: Estudio de caso: Manejo de diabetes'
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                    />
                  </motion.div>

                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Tipo de estudio
                    </Label>
                    <Select onValueChange={(val) => setStudyType(val)} required>
                      <SelectTrigger className='border-gray-200 focus:border-purple-300 focus:ring-purple-200'>
                        <SelectValue placeholder='Selecciona un tipo de estudio' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='revisión bibliográfica'>
                          Revisión bibliográfica
                        </SelectItem>
                        <SelectItem value='caso clínico'>
                          Caso clínico
                        </SelectItem>
                        <SelectItem value='protocolo'>Protocolo</SelectItem>
                        <SelectItem value='otros'>
                          Otros trabajos de investigación
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Metodología
                    </Label>
                    <Textarea
                      value={methodology}
                      onChange={(e) => setMethodology(e.target.value)}
                      rows={4}
                      placeholder='Describe la metodología utilizada (obligatorio)'
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none'
                    />
                    <p className='text-xs text-gray-500 mt-1'>
                      Describe detalladamente la metodología utilizada en tu
                      investigación.
                    </p>
                  </motion.div>

                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Introducción
                    </Label>
                    <Textarea
                      value={introduction}
                      onChange={(e) => setIntroduction(e.target.value)}
                      rows={4}
                      placeholder='Mínimo 200 caracteres / Máximo 1100 caracteres'
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none'
                    />
                    <div className='flex justify-between text-xs text-gray-500 mt-1'>
                      <span>Mínimo 200 caracteres</span>
                      <span>{introduction.length}/1100 caracteres</span>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Objetivos
                    </Label>
                    <Textarea
                      value={objectives}
                      onChange={(e) => setObjectives(e.target.value)}
                      rows={4}
                      placeholder='Mínimo 200 caracteres / Máximo 1100 caracteres'
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none'
                    />
                    <div className='flex justify-between text-xs text-gray-500 mt-1'>
                      <span>Mínimo 200 caracteres</span>
                      <span>{objectives.length}/1100 caracteres</span>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Resultados
                    </Label>
                    <Textarea
                      value={results}
                      onChange={(e) => setResults(e.target.value)}
                      rows={4}
                      placeholder='Mínimo 200 caracteres / Máximo 2500 caracteres'
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none'
                    />
                    <div className='flex justify-between text-xs text-gray-500 mt-1'>
                      <span>Mínimo 200 caracteres</span>
                      <span>{results.length}/2500 caracteres</span>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Discusión-Conclusión
                    </Label>
                    <Textarea
                      value={discussion}
                      onChange={(e) => setDiscussion(e.target.value)}
                      rows={4}
                      placeholder='Mínimo 100 caracteres / Máximo 1100 caracteres'
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none'
                    />
                    <div className='flex justify-between text-xs text-gray-500 mt-1'>
                      <span>Mínimo 100 caracteres</span>
                      <span>{discussion.length}/1100 caracteres</span>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Bibliografía
                    </Label>
                    <Textarea
                      value={bibliography}
                      onChange={(e) => setBibliography(e.target.value)}
                      rows={4}
                      placeholder='Mínimo 100 caracteres / Máximo 1100 caracteres'
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none'
                    />
                    <div className='flex justify-between text-xs text-gray-500 mt-1'>
                      <span>Mínimo 100 caracteres</span>
                      <span>{bibliography.length}/1100 caracteres</span>
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className='pt-4'>
                    <Button
                      type='submit'
                      disabled={loading}
                      className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 hover:shadow-lg'>
                      {loading ? (
                        <span className='flex items-center'>
                          <div className='h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2'></div>
                          Enviando...
                        </span>
                      ) : (
                        <span className='flex items-center'>
                          <Send className='mr-2 h-4 w-4' />
                          Enviar Capítulo
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Columna lateral con información y consejos */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}>
            <div className='backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-lg border border-white/50 sticky top-4'>
              <h2 className='text-lg font-semibold text-gray-900 mb-4 flex items-center'>
                <Info className='h-4 w-4 mr-2 text-purple-600' />
                Consejos para tu capítulo
              </h2>

              <div className='space-y-6'>
                <div className='bg-purple-50/70 p-4 rounded-lg'>
                  <h3 className='text-sm font-medium text-purple-800 mb-2 flex items-center'>
                    <BookOpen className='h-4 w-4 mr-1' />
                    Estructura recomendada
                  </h3>
                  <ul className='space-y-2'>
                    <li className='flex items-start gap-2'>
                      <div className='bg-purple-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-purple-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Sigue un orden lógico en tu exposición
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <div className='bg-purple-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-purple-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Usa subtítulos para organizar el contenido
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <div className='bg-purple-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-purple-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Incluye tablas o figuras si es necesario
                      </span>
                    </li>
                  </ul>
                </div>

                <div className='bg-yellow-50/70 p-4 rounded-lg'>
                  <h3 className='text-sm font-medium text-yellow-800 mb-2 flex items-center'>
                    <Lightbulb className='h-4 w-4 mr-1' />
                    Consejos de redacción
                  </h3>
                  <ul className='space-y-2'>
                    <li className='flex items-start gap-2'>
                      <div className='bg-yellow-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-yellow-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Usa un lenguaje claro y preciso
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <div className='bg-yellow-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-yellow-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Evita párrafos demasiado extensos
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <div className='bg-yellow-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-yellow-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Cita correctamente todas las fuentes
                      </span>
                    </li>
                  </ul>
                </div>

                <div className='bg-green-50/70 p-4 rounded-lg'>
                  <h3 className='text-sm font-medium text-green-800 mb-2 flex items-center'>
                    <BookMarked className='h-4 w-4 mr-1' />
                    Proceso de revisión
                  </h3>
                  <p className='text-sm text-gray-700'>
                    Tu capítulo será revisado por nuestro comité editorial.
                    Recibirás comentarios y, si es necesario, se te pedirán
                    modificaciones antes de la publicación final.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
