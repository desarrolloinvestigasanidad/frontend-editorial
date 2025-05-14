"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Info, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  description: string;
  openDate: string;
  deadlineChapters: string;
  publishDate: string;
  normativa: string;
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
    if (!open) return;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const endpoint = editionId
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/editions/current`;
        const res = await fetch(endpoint);
        if (!res.ok) throw new Error("Error fetching edition");
        setEdition(await res.json());
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la normativa. Inténtalo de nuevo.");
      } finally {
        setLoading(false);
      }
    })();
  }, [editionId, open]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  if (!open) return null;

  const importantDates = edition
    ? [
        {
          label: "Apertura",
          date: edition.openDate,
          color: "bg-purple-50 border-purple-200",
        },
        {
          label: "Envío capítulos",
          date: edition.deadlineChapters,
          color: "bg-yellow-50 border-yellow-200",
        },
        {
          label: "Publicación",
          date: edition.publishDate,
          color: "bg-green-50 border-green-200",
        },
      ]
    : [];

  // Procesar texto plano con saltos\  y placeholders
  const processNormativa = (text: string) => {
    const filled = edition
      ? text
          .replace(/\[Nombre de la Edición\/Libro\]/g, edition.title)
          .replace(/\[Fecha límite\]/g, formatDate(edition.deadlineChapters))
          .replace(/\[Fecha de publicación\]/g, formatDate(edition.publishDate))
          .replace(/\[FECHA\]/g, formatDate(edition.publishDate))
      : text;
    return filled.split(/\n\n+/g);
  };

  // Colores cíclicos para tarjetas
  const cardBgs = ["bg-purple-50", "bg-yellow-50", "bg-green-50"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className='fixed inset-0 bg-black/30' />
      <DialogContent className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 m-0 bg-transparent border-none shadow-none'>
        <div className='w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-auto'>
          <Card>
            <CardHeader>
              <CardTitle>
                {edition?.title || "Normativa de Publicación"}
              </CardTitle>
              <Alert className='mt-2 bg-blue-50 border-blue-200'>
                <Info className='mr-2 h-4 w-4 text-blue-600' />
                <AlertDescription>
                  {edition
                    ? `Bienvenido a la edición ${edition.title}. Revisa las fechas y normas.`
                    : "Cargando información..."}
                </AlertDescription>
              </Alert>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className='flex justify-center py-8'>
                  <Loader2 className='h-8 w-8 animate-spin text-gray-500' />
                </div>
              )}
              {error && (
                <Alert variant='destructive'>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {!loading && edition && (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 my-4'>
                    {importantDates.map((d) => (
                      <div
                        key={d.label}
                        className={`flex items-center gap-2 p-3 rounded-lg border ${d.color}`}>
                        <Calendar className='h-5 w-5 text-gray-700' />
                        <div>
                          <div className='text-sm font-medium text-gray-800'>
                            {d.label}
                          </div>
                          <div className='text-sm text-gray-600'>
                            {formatDate(d.date)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='text-xs text-gray-500 flex items-center mb-4'>
                    <Clock className='mr-1 h-4 w-4' />
                    Última actualización: {formatDate(edition.updatedAt)}
                  </div>
                  <ScrollArea className='h-[400px] p-4'>
                    {processNormativa(edition.normativa).map((block, idx) => (
                      <Card
                        key={idx}
                        className={`mb-4 p-4 ${cardBgs[idx % cardBgs.length]}`}>
                        {block.split(/\n/).map((line, j) => {
                          const dateMatch = line.match(
                            /(\d{1,2}\/\d{1,2}\/\d{4})/
                          );
                          return (
                            <p key={j} className='text-sm mb-2'>
                              {dateMatch ? (
                                <>
                                  <Badge className='mr-2'>{dateMatch[0]}</Badge>
                                  {line.replace(dateMatch[0], "")}
                                </>
                              ) : (
                                line
                              )}
                            </p>
                          );
                        })}
                      </Card>
                    ))}
                  </ScrollArea>
                </>
              )}
            </CardContent>
            <DialogFooter className='flex flex-col sm:flex-row justify-between p-4'>
              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='accept-regulations'
                  checked={isAccepted}
                  onCheckedChange={(c) => onAcceptChange(c === true)}
                />
                <Label htmlFor='accept-regulations'>
                  He leído y acepto la normativa
                </Label>
              </div>
              <Button variant='outline' onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
            </DialogFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
