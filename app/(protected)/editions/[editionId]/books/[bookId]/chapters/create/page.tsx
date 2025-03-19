"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
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

export default function CreateChapterPage() {
  const { editionId, bookId } = useParams();
  const router = useRouter();

  // Campos para el capítulo
  const [title, setTitle] = useState("");
  const [studyType, setStudyType] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [objectives, setObjectives] = useState("");
  const [results, setResults] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [bibliography, setBibliography] = useState("");

  // Autor: en un entorno real, obtendrás el authorId del usuario autenticado
  const [authorId] = useState("id_del_usuario");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Incluimos "content" para evitar el error en la base de datos.
      // En este ejemplo usamos la introducción como fallback; podrías concatenar otros campos si lo prefieres.
      const body = {
        title,
        studyType,
        introduction,
        objectives,
        results,
        discussion,
        bibliography,
        authorId,
        content: introduction, // Valor de fallback para "content"
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

      // Redirige a la lista de capítulos del libro
      router.push(`/editions/${editionId}/books/${bookId}/chapters`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6 p-4'>
      <h1 className='text-xl font-bold mb-4'>Crear Capítulo</h1>
      {error && <p className='text-red-600'>{error}</p>}
      <div>
        <Label>Título del capítulo</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Ej: Estudio de caso: Manejo de diabetes'
          required
        />
      </div>
      {/* Tipo de estudio */}
      <div>
        <Label className='mb-1'>Tipo de estudio</Label>
        <Select onValueChange={(val) => setStudyType(val)}>
          <SelectTrigger>
            <SelectValue placeholder='Selecciona un tipo de estudio' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='revisión bibliográfica'>
              Revisión bibliográfica
            </SelectItem>
            <SelectItem value='caso clínico'>Caso clínico</SelectItem>
            <SelectItem value='protocolo'>Protocolo</SelectItem>
            <SelectItem value='otros'>
              Otros trabajos de investigación
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Introducción */}
      <div>
        <Label>Introducción</Label>
        <Textarea
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          rows={5}
          placeholder='Mínimo 200 caracteres / Máximo 1100 caracteres'
          required
        />
      </div>

      {/* Objetivos */}
      <div>
        <Label>Objetivos</Label>
        <Textarea
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          rows={5}
          placeholder='Mínimo 200 caracteres / Máximo 1100 caracteres'
          required
        />
      </div>

      {/* Resultados */}
      <div>
        <Label>Resultados</Label>
        <Textarea
          value={results}
          onChange={(e) => setResults(e.target.value)}
          rows={5}
          placeholder='Mínimo 200 caracteres / Máximo 2500 caracteres'
          required
        />
      </div>

      {/* Discusión-Conclusión */}
      <div>
        <Label>Discusión-Conclusión</Label>
        <Textarea
          value={discussion}
          onChange={(e) => setDiscussion(e.target.value)}
          rows={5}
          placeholder='Mínimo 100 caracteres / Máximo 1100 caracteres'
          required
        />
      </div>

      {/* Bibliografía */}
      <div>
        <Label>Bibliografía</Label>
        <Textarea
          value={bibliography}
          onChange={(e) => setBibliography(e.target.value)}
          rows={5}
          placeholder='Mínimo 100 caracteres / Máximo 1100 caracteres'
          required
        />
      </div>

      <Button type='submit' disabled={loading}>
        {loading ? "Creando..." : "Enviar Capítulo"}
      </Button>
    </form>
  );
}
