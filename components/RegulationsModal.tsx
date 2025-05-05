"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Calendar, Clock, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RegulationsModalProps {
  isAccepted: boolean;
  onAcceptChange: (accepted: boolean) => void;
  editionId?: string | number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Edition {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  year: number;
  cover: string;
  openDate: string;
  deadlineChapters: string;
  publishDate: string;
  normativa: string;
  createdAt: string;
  updatedAt: string;
}

export default function RegulationsModal({
  isAccepted,
  onAcceptChange,
  editionId,
  open,
  onOpenChange,
}: RegulationsModalProps) {
  const [edition, setEdition] = useState<Edition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEdition = async () => {
      if (!editionId && !open) return;

      setLoading(true);
      setError(null);

      try {
        const endpoint = editionId
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/editions/current`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("No se pudo cargar la información de la edición");
        }

        const data = await response.json();
        setEdition(data);
      } catch (err) {
        console.error("Error al cargar la información de la edición:", err);
        setError(
          "No se pudo cargar la normativa. Por favor, inténtalo de nuevo."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEdition();
  }, [editionId, open]);

  // Función para reemplazar placeholders en la normativa con datos reales
  const processNormativa = (normativa: string, edition: Edition): string => {
    if (!normativa) return "";

    // Reemplazar placeholders con datos reales de la edición
    return normativa
      .replace(/\[Nombre de la Edición\/Libro\]/g, edition.title)
      .replace(
        /\[Fecha límite\]/g,
        new Date(edition.deadlineChapters).toLocaleDateString()
      )
      .replace(
        /\[Fecha de publicación\]/g,
        new Date(edition.publishDate).toLocaleDateString()
      )
      .replace(
        /\[FECHA\]/g,
        new Date(edition.publishDate).toLocaleDateString()
      );
  };

  const RegulationsContent = () => {
    if (loading) {
      return (
        <div className='flex flex-col items-center justify-center py-12'>
          <Loader2 className='h-8 w-8 text-primary animate-spin mb-4' />
          <p className='text-sm text-muted-foreground'>Cargando normativa...</p>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant='destructive' className='my-4'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (!edition) {
      return (
        <Alert className='my-4'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>
            No hay normativa disponible para esta edición.
          </AlertDescription>
        </Alert>
      );
    }

    // Fechas importantes de la edición
    const importantDates = [
      { label: "Apertura", date: edition.openDate },
      { label: "Fecha límite para capítulos", date: edition.deadlineChapters },
      { label: "Fecha de publicación", date: edition.publishDate },
    ];

    return (
      <>
        <div className='mb-4'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-2 mb-4'>
            {importantDates.map((date, index) => (
              <div
                key={index}
                className='flex items-center gap-2 text-sm border rounded-md p-2 bg-muted/30'>
                <Calendar className='h-4 w-4 text-primary' />
                <span className='font-medium'>{date.label}:</span>
                <span>{new Date(date.date).toLocaleDateString()}</span>
              </div>
            ))}
          </div>

          <div className='text-xs text-muted-foreground flex items-center gap-1 mb-4'>
            <Clock className='h-3 w-3' />
            Última actualización:{" "}
            {new Date(edition.updatedAt).toLocaleDateString()}
          </div>
        </div>

        <ScrollArea className='h-[400px] pr-4'>
          <div
            className='prose prose-sm max-w-none'
            dangerouslySetInnerHTML={{
              __html: processNormativa(edition.normativa, edition),
            }}
          />
        </ScrollArea>
      </>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[700px]'>
        <DialogHeader>
          <DialogTitle>
            {edition?.title || "Normativa de Publicación"}
          </DialogTitle>
          <DialogDescription>
            {edition?.description ||
              "Por favor, lee atentamente la normativa antes de continuar con la compra de capítulos."}
          </DialogDescription>
        </DialogHeader>
        <RegulationsContent />
        <DialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-0'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='accept-regulations-modal'
              checked={isAccepted}
              onCheckedChange={(checked) => {
                onAcceptChange(checked === true);
              }}
            />
            <Label htmlFor='accept-regulations-modal'>
              He leído y acepto la normativa de publicación
            </Label>
          </div>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
