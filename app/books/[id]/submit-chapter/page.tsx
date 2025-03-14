"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Tipos de estudio que se mostrarán en el select
const STUDY_TYPES = [
  "Revisión bibliográfica",
  "Caso clínico",
  "Protocolo",
  "Otros trabajos de investigación",
];

interface SubmitChapterProps {
  params: { bookId: string };
}

export default function SubmitChapterPage({ params }: SubmitChapterProps) {
  const { bookId } = params;

  // Estados locales para cada campo
  const [title, setTitle] = useState("");
  const [studyType, setStudyType] = useState(STUDY_TYPES[0]);
  const [introduction, setIntroduction] = useState("");
  const [objectives, setObjectives] = useState("");
  const [results, setResults] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [bibliography, setBibliography] = useState("");
  const [acceptConfidentiality, setAcceptConfidentiality] = useState(false);

  // Manejo de validaciones de longitud
  // (puedes extraerlo a un helper si quieres)
  const MIN_INTRO = 200;
  const MAX_INTRO = 1100;
  const MIN_OBJ = 200;
  const MAX_OBJ = 1100;
  const MIN_RES = 200;
  const MAX_RES = 2500;
  const MIN_DISC = 100;
  const MAX_DISC = 1100;
  const MIN_BIB = 100;
  const MAX_BIB = 1100;

  // Para manejar errores simples
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reseteamos errores
    const currentErrors: string[] = [];

    // Validaciones simples (mínimos y máximos)
    if (introduction.length < MIN_INTRO || introduction.length > MAX_INTRO) {
      currentErrors.push(
        `La Introducción debe tener entre ${MIN_INTRO} y ${MAX_INTRO} caracteres`
      );
    }
    if (objectives.length < MIN_OBJ || objectives.length > MAX_OBJ) {
      currentErrors.push(
        `Los Objetivos deben tener entre ${MIN_OBJ} y ${MAX_OBJ} caracteres`
      );
    }
    if (results.length < MIN_RES || results.length > MAX_RES) {
      currentErrors.push(
        `Los Resultados deben tener entre ${MIN_RES} y ${MAX_RES} caracteres`
      );
    }
    if (discussion.length < MIN_DISC || discussion.length > MAX_DISC) {
      currentErrors.push(
        `La Discusión-Conclusión debe tener entre ${MIN_DISC} y ${MAX_DISC} caracteres`
      );
    }
    if (bibliography.length < MIN_BIB || bibliography.length > MAX_BIB) {
      currentErrors.push(
        `La Bibliografía debe tener entre ${MIN_BIB} y ${MAX_BIB} caracteres`
      );
    }
    if (!acceptConfidentiality) {
      currentErrors.push(
        "Debes aceptar la Ley de confidencialidad informática para continuar."
      );
    }

    setErrors(currentErrors);

    // Si hay errores, no seguimos
    if (currentErrors.length > 0) return;

    // Aquí haces tu POST a la API real
    // Ejemplo:
    // const response = await fetch("/api/chapters", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     bookId,
    //     title,
    //     studyType,
    //     introduction,
    //     objectives,
    //     results,
    //     discussion,
    //     bibliography,
    //   }),
    // });

    // Manejar la respuesta (redireccionar, mostrar mensaje, etc.)
    alert("Capítulo enviado con éxito (mock)!");
  };

  return (
    <div className='max-w-3xl mx-auto py-8 px-4'>
      {/* Botón Volver */}
      <div className='mb-4'>
        <Link href={`/books/${bookId}`}>
          <button className='flex items-center gap-2 text-sm text-gray-600 hover:text-black'>
            <ArrowLeft className='h-4 w-4' />
            Volver atrás
          </button>
        </Link>
      </div>

      {/* Encabezado principal */}
      <header className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-orange-600'>
          Envía tu capítulo
        </h1>
        <Button
          variant='outline'
          className='border border-orange-300 text-orange-600 hover:bg-orange-50'>
          Añadir coautor
        </Button>
      </header>

      <div className='bg-white rounded shadow p-6'>
        {/* Título del capítulo */}
        <label className='block text-gray-600 font-semibold mb-1'>Título</label>
        <input
          type='text'
          className='w-full border border-orange-200 rounded p-2 mb-4'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Ej: Introducción a la gestión hospitalaria...'
        />

        <h2 className='text-lg font-semibold text-orange-600 mb-3'>
          Información del capítulo
        </h2>

        {/* Tipo de estudio */}
        <label className='block text-gray-600 font-semibold mb-1'>
          Tipo de estudio
        </label>
        <select
          className='block w-full border border-orange-200 rounded p-2 mb-4'
          value={studyType}
          onChange={(e) => setStudyType(e.target.value)}>
          {STUDY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Introducción */}
        <label className='block text-gray-600 font-semibold mb-1'>
          Introducción
        </label>
        <textarea
          className='w-full border border-orange-200 rounded p-2 mb-2'
          rows={5}
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          placeholder={`Mínimo ${MIN_INTRO} caracteres / Máximo ${MAX_INTRO} caracteres`}
        />
        <p className='text-xs text-gray-500 mb-4'>
          {`Mínimo ${MIN_INTRO} caracteres | Máximo ${MAX_INTRO} caracteres`}
        </p>

        {/* Objetivos */}
        <label className='block text-gray-600 font-semibold mb-1'>
          Objetivos
        </label>
        <textarea
          className='w-full border border-orange-200 rounded p-2 mb-2'
          rows={5}
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          placeholder={`Mínimo ${MIN_OBJ} caracteres / Máximo ${MAX_OBJ} caracteres`}
        />
        <p className='text-xs text-gray-500 mb-4'>
          {`Mínimo ${MIN_OBJ} caracteres | Máximo ${MAX_OBJ} caracteres`}
        </p>

        {/* Resultados */}
        <label className='block text-gray-600 font-semibold mb-1'>
          Resultados
        </label>
        <textarea
          className='w-full border border-orange-200 rounded p-2 mb-2'
          rows={6}
          value={results}
          onChange={(e) => setResults(e.target.value)}
          placeholder={`Mínimo ${MIN_RES} caracteres / Máximo ${MAX_RES} caracteres`}
        />
        <p className='text-xs text-gray-500 mb-4'>
          {`Mínimo ${MIN_RES} caracteres | Máximo ${MAX_RES} caracteres`}
        </p>

        {/* Discusión-Conclusión */}
        <label className='block text-gray-600 font-semibold mb-1'>
          Discusión-Conclusión
        </label>
        <textarea
          className='w-full border border-orange-200 rounded p-2 mb-2'
          rows={5}
          value={discussion}
          onChange={(e) => setDiscussion(e.target.value)}
          placeholder={`Mínimo ${MIN_DISC} caracteres / Máximo ${MAX_DISC} caracteres`}
        />
        <p className='text-xs text-gray-500 mb-4'>
          {`Mínimo ${MIN_DISC} caracteres | Máximo ${MAX_DISC} caracteres`}
        </p>

        {/* Bibliografía */}
        <label className='block text-gray-600 font-semibold mb-1'>
          Bibliografía
        </label>
        <textarea
          className='w-full border border-orange-200 rounded p-2 mb-2'
          rows={5}
          value={bibliography}
          onChange={(e) => setBibliography(e.target.value)}
          placeholder={`Mínimo ${MIN_BIB} caracteres / Máximo ${MAX_BIB} caracteres`}
        />
        <p className='text-xs text-gray-500 mb-4'>
          {`Mínimo ${MIN_BIB} caracteres | Máximo ${MAX_BIB} caracteres`}
        </p>

        {/* Check de confidencialidad */}
        <div className='flex items-center mb-4'>
          <input
            type='checkbox'
            id='confidentiality'
            checked={acceptConfidentiality}
            onChange={(e) => setAcceptConfidentiality(e.target.checked)}
            className='mr-2'
          />
          <label htmlFor='confidentiality' className='text-sm text-gray-600'>
            Al pulsar enviar, confirmo que revisé y cumplo la
            <span className='text-orange-600 ml-1 cursor-pointer underline'>
              Ley de confidencialidad informática
            </span>
          </label>
        </div>

        {/* Mostrar errores de validación */}
        {errors.length > 0 && (
          <div className='bg-red-50 border border-red-200 text-red-600 p-3 rounded mb-4'>
            <ul className='list-disc ml-5 space-y-1'>
              {errors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Botón de enviar */}
        <Button
          onClick={handleSubmit}
          className='bg-orange-500 hover:bg-orange-600 text-white w-full'>
          Revisar
        </Button>
      </div>
    </div>
  );
}
