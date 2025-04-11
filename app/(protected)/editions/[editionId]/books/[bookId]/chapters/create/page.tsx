"use client";

import React, { useState, useEffect } from "react";
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
import { useAvailableCredits } from "@/hooks/useAvailableCredits";

// Componente auxiliar para el seguimiento del número de palabras
function WordCountProgress({
  text,
  min,
  max,
}: {
  text: string;
  min: number;
  max: number;
}) {
  const count =
    text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(Boolean).length;
  const percentage = Math.min(100, Math.floor((count / min) * 100));
  return (
    <div className='mt-1'>
      <div className='relative h-2 bg-gray-200 rounded'>
        <div
          style={{ width: `${percentage}%` }}
          className={`h-2 rounded transition-all duration-300 ${
            percentage >= 100 ? "bg-green-500" : "bg-blue-500"
          }`}></div>
      </div>
      <p className='text-xs text-gray-500 mt-1'>
        {count} palabra{count !== 1 && "s"}{" "}
        {count < min && `- ¡Añade ${min - count} más para alcanzar el mínimo!`}
        {count >= min && count <= max && " - ¡Buen trabajo!"}
        {count > max && " - Has superado el máximo recomendado"}
      </p>
    </div>
  );
}

export default function CreateChapterPage() {
  const { editionId, bookId } = useParams();
  const router = useRouter();

  // Estados para el formulario
  const [title, setTitle] = useState("");
  const [studyType, setStudyType] = useState("");
  const [methodology, setMethodology] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [objectives, setObjectives] = useState("");
  const [results, setResults] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [bibliography, setBibliography] = useState("");

  // Estados adicionales: perfil, detalles del libro y créditos disponibles
  const [authorId, setAuthorId] = useState("");
  const [bookTitle, setBookTitle] = useState("");
  const { availableCredits, loadingCredits, errorCredits } =
    useAvailableCredits(editionId as string);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Variantes de animación para framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // useEffect para obtener datos: perfil, detalles del libro y créditos disponibles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        let userId = localStorage.getItem("userId");
        // Obtener perfil para confirmar el authorId
        if (token) {
          const profileRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/profile`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!profileRes.ok) {
            throw new Error("Error al obtener el perfil");
          }
          const profileData = await profileRes.json();
          if (profileData && profileData.id) {
            setAuthorId(profileData.id);
            userId = profileData.id;
          }
        }
        // Obtener detalles del libro
        const bookRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`
        );
        if (bookRes.ok) {
          const bookData = await bookRes.json();
          setBookTitle(bookData.title || "Libro seleccionado");
        }
      } catch (err: any) {
        console.error("Error al obtener datos:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [editionId, bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorId) {
      setError("No se pudo obtener el perfil del autor. Intente nuevamente.");
      return;
    }
    setLoading(true);
    setError("");

    try {
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
        content: introduction, // Se usa la introducción como fallback para el contenido
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

  // Vistas de carga, éxito o sin créditos
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <BookOpen className='h-6 w-6 text-purple-500' />
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='text-center p-8 max-w-md bg-white rounded-xl shadow-lg'>
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

  if (loadingCredits || loading) {
    return (
      <div className='flex items-center justify-center min-h-[60vh]'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <BookOpen className='h-6 w-6 text-purple-500' />
          </div>
        </div>
      </div>
    );
  }

  if (availableCredits === null || availableCredits <= 0) {
    return (
      <div className='p-4 text-center'>
        <p className='mb-4'>
          Para enviar un capítulo, primero debes comprar participación.
        </p>
        <Button
          onClick={() =>
            router.push(
              `/editions/${editionId}/books/${bookId}/chapters/purchase`
            )
          }>
          Comprar Participación
        </Button>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo de diseño moderno */}
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
                  {/* Título del capítulo */}
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

                  {/* Tipo de estudio */}
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

                  {/* Metodología */}
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
                    <WordCountProgress text={methodology} min={30} max={100} />
                    <p className='text-xs text-gray-500 mt-1'>
                      Se recomienda entre 30 y 100 palabras.
                    </p>
                  </motion.div>

                  {/* Introducción */}
                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Introducción
                    </Label>
                    <Textarea
                      value={introduction}
                      onChange={(e) => setIntroduction(e.target.value)}
                      rows={4}
                      placeholder='Mínimo 50 palabras / Máximo 150 palabras'
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none'
                    />
                    <WordCountProgress text={introduction} min={50} max={150} />
                  </motion.div>

                  {/* Objetivos */}
                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Objetivos
                    </Label>
                    <Textarea
                      value={objectives}
                      onChange={(e) => setObjectives(e.target.value)}
                      rows={4}
                      placeholder='Mínimo 50 palabras / Máximo 150 palabras'
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none'
                    />
                    <WordCountProgress text={objectives} min={50} max={150} />
                  </motion.div>

                  {/* Resultados */}
                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Resultados
                    </Label>
                    <Textarea
                      value={results}
                      onChange={(e) => setResults(e.target.value)}
                      rows={4}
                      placeholder='Mínimo 50 palabras / Máximo 250 palabras'
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none'
                    />
                    <WordCountProgress text={results} min={50} max={250} />
                  </motion.div>

                  {/* Discusión-Conclusión */}
                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Discusión-Conclusión
                    </Label>
                    <Textarea
                      value={discussion}
                      onChange={(e) => setDiscussion(e.target.value)}
                      rows={4}
                      placeholder='Mínimo 30 palabras / Máximo 150 palabras'
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none'
                    />
                    <WordCountProgress text={discussion} min={30} max={150} />
                  </motion.div>

                  {/* Bibliografía */}
                  <motion.div variants={itemVariants} className='mb-6'>
                    <Label className='text-gray-700 font-medium mb-1 block'>
                      Bibliografía
                    </Label>
                    <Textarea
                      value={bibliography}
                      onChange={(e) => setBibliography(e.target.value)}
                      rows={4}
                      placeholder='Mínimo 30 palabras / Máximo 150 palabras'
                      required
                      className='border-gray-200 focus:border-purple-300 focus:ring-purple-200 resize-none'
                    />
                    <WordCountProgress text={bibliography} min={30} max={150} />
                  </motion.div>

                  {/* Botón de envío */}
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

          {/* Panel lateral con consejos */}
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
                        Sigue un orden lógico en tu exposición.
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <div className='bg-purple-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-purple-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Usa subtítulos para organizar el contenido.
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <div className='bg-purple-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-purple-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Incluye tablas o figuras si es necesario.
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
                        Usa un lenguaje claro y preciso.
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <div className='bg-yellow-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-yellow-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Evita párrafos demasiado extensos.
                      </span>
                    </li>
                    <li className='flex items-start gap-2'>
                      <div className='bg-yellow-100 p-1 rounded-full mt-0.5'>
                        <CheckCircle className='h-3 w-3 text-yellow-700' />
                      </div>
                      <span className='text-sm text-gray-700'>
                        Cita correctamente todas las fuentes.
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
