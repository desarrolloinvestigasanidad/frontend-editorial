"use client";

import { useState, useEffect } from "react";
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
    fetchProfile();
  }, []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      {/* Metodología */}
      <div>
        <Label>Metodología</Label>
        <Textarea
          value={methodology}
          onChange={(e) => setMethodology(e.target.value)}
          rows={5}
          placeholder='Describe la metodología utilizada (obligatorio)'
          required
        />
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
