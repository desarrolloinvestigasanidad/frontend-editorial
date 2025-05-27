// frontend-editorial/components/RegulationsModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogOverlay,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Info,
  Loader2,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface RegulationsModalProps {
  isAccepted: boolean;
  onAcceptChange: (accepted: boolean) => void;
  editionId?: string | number | string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Edition {
  id: string;
  title: string;
  description?: string;
  openDate?: string;
  deadlineChapters?: string;
  publishDate?: string;
  normativa: string | null;
  updatedAt?: string;
}

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function RegulationsModal({
  isAccepted,
  onAcceptChange,
  editionId: rawEditionId,
  open,
  onOpenChange,
}: RegulationsModalProps) {
  const [edition, setEdition] = useState<Edition | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentEditionId = Array.isArray(rawEditionId)
    ? rawEditionId[0]
    : rawEditionId;

  useEffect(() => {
    if (!open) {
      return;
    }

    setLoading(true);
    setError(null);
    setEdition(null);

    if (!BASE_API_URL) {
      const msg =
        "Error de configuración: La URL base de la API no está definida.";
      console.error("RegulationsModal:", msg);
      setError(msg);
      setLoading(false);
      return;
    }

    if (!currentEditionId && currentEditionId !== 0) {
      // 0 podría ser un ID válido
      const msg =
        "No se ha proporcionado un ID de edición para cargar la normativa.";
      console.warn("RegulationsModal:", msg, { currentEditionId });
      setError(msg);
      setLoading(false);
      return;
    }

    // Construir el endpoint usando /editions/:id
    const endpoint = `${BASE_API_URL}/editions/${currentEditionId}`;
    // console.log(`RegulationsModal: Fetching from ${endpoint}`);

    (async () => {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) {
          let errorData = {
            message: `Error ${res.status} al obtener la edición.`,
          };
          try {
            errorData = await res.json();
          } catch (e) {
            /* Mantener errorData por defecto */
          }
          throw new Error(errorData.message || `Error HTTP ${res.status}`);
        }
        const data: Edition = await res.json();
        setEdition({
          ...data,
          normativa: data.normativa === null ? "" : data.normativa, // Asegurar que normativa sea string
        });
      } catch (err: any) {
        console.error("Error en fetch de RegulationsModal:", err);
        const errMsg =
          err.message || "No se pudo cargar la normativa. Inténtalo de nuevo.";
        setError(errMsg);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentEditionId, open]);

  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "Fecha no disponible";
    try {
      return new Date(dateStr).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch (e) {
      return "Fecha inválida";
    }
  };

  const processNormativa = (text: string | null | undefined): string[] => {
    if (typeof text !== "string" || !text.trim()) {
      return [
        "La normativa para esta edición no está disponible o no ha sido definida.",
      ];
    }
    if (!edition) {
      return text
        .split(/\n\n+/g)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
    }

    const title = edition.title || "esta edición";
    const deadline = formatDate(edition.deadlineChapters);
    const publish = formatDate(edition.publishDate);

    try {
      const filled = text
        .replace(/\[Nombre de la Edición\/Libro\]/g, title)
        .replace(/\[Fecha límite\]/g, deadline)
        .replace(/\[Fecha de publicación\]/g, publish)
        .replace(/\[FECHA\]/g, publish);
      return filled
        .split(/\n\n+/g)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
    } catch (e) {
      console.error("Error al procesar placeholders en normativa:", e, {
        text,
        edition,
      });
      return text
        .split(/\n\n+/g)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
    }
  };

  const importantDates = edition
    ? [
        {
          label: "Apertura de la Edición",
          date: edition.openDate,
          Icon: Calendar,
          colorClasses: "bg-purple-50 border-purple-300 text-purple-700",
        },
        {
          label: "Límite Envío Capítulos",
          date: edition.deadlineChapters,
          Icon: Clock,
          colorClasses: "bg-yellow-50 border-yellow-300 text-yellow-700",
        },
        {
          label: "Publicación Estimada",
          date: edition.publishDate,
          Icon: CheckCircle,
          colorClasses: "bg-green-50 border-green-300 text-green-700",
        },
      ].filter((d) => d.date)
    : [];

  const cardBgs = ["bg-slate-100/70", "bg-stone-100/70"];

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className='fixed inset-0 bg-black/60 backdrop-blur-sm z-40' />{" "}
      {/* Ajustado overlay */}
      <DialogContent className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-0 m-0 bg-transparent border-none shadow-none z-50 w-full max-w-2xl'>
        <div className='bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]'>
          <Card className='border-0 shadow-none rounded-xl flex flex-col flex-grow overflow-hidden'>
            <CardHeader className='px-6 py-4 border-b sticky top-0 bg-white z-10 rounded-t-xl'>
              <CardTitle className='text-xl md:text-2xl font-semibold text-purple-800'>
                {loading
                  ? "Cargando Normativa..."
                  : edition?.title
                  ? `Normativa: ${edition.title}`
                  : "Normativa de Publicación"}
              </CardTitle>
            </CardHeader>

            <div className='flex-grow overflow-y-auto bg-gray-50'>
              {" "}
              {/* Contenedor del contenido con scroll */}
              {loading && (
                <div className='flex flex-col justify-center items-center p-10 min-h-[400px]'>
                  <Loader2 className='h-12 w-12 animate-spin text-purple-600 mb-4' />
                  <p className='text-gray-600 font-medium'>
                    Cargando información de la edición...
                  </p>
                </div>
              )}
              {error && !loading && (
                <div className='p-6'>
                  <Alert variant='destructive' className='shadow-md'>
                    <AlertTriangle className='h-5 w-5' />
                    <AlertTitle className='font-semibold'>
                      Error al Cargar Normativa
                    </AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}
              {!loading && !error && edition && (
                <div className='p-5 sm:p-6 space-y-6'>
                  <Alert className='bg-purple-50 border-purple-200 text-purple-800 text-sm shadow'>
                    <Info className='h-5 w-5 mr-2 ' />
                    <AlertDescription>
                      {edition.description ||
                        `A continuación, se detalla la normativa y fechas importantes para la edición: "${
                          edition.title
                        }". Actualizada el ${formatDate(edition.updatedAt)}.`}
                    </AlertDescription>
                  </Alert>

                  {importantDates.length > 0 && (
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                      {importantDates.map((d) => (
                        <div
                          key={d.label}
                          className={`flex items-center gap-3 p-3.5 rounded-lg border shadow-sm hover:shadow-md transition-shadow ${d.colorClasses.replace(
                            "bg-",
                            "border-"
                          )}`}>
                          <d.Icon
                            className={`h-5 w-5 shrink-0 ${d.colorClasses
                              .replace("bg-", "text-")
                              .replace("-50", "-700")}`}
                          />
                          <div>
                            <div className='text-xs font-semibold text-gray-700'>
                              {d.label}
                            </div>
                            <div className='text-sm font-bold text-gray-900'>
                              {formatDate(d.date)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className='prose prose-sm max-w-none bg-white p-4 sm:p-6 rounded-lg shadow border border-gray-200'>
                    <h3 className='text-lg font-semibold text-gray-700 mb-3 border-b pb-2'>
                      Detalles de la Normativa
                    </h3>
                    {/* Asegurar que edition.normativa exista antes de llamar a processNormativa */}
                    {edition.normativa ? (
                      processNormativa(edition.normativa).map(
                        (paragraph, idx) => (
                          <p key={idx} className='mb-3 last:mb-0'>
                            {paragraph}
                          </p>
                        )
                      )
                    ) : (
                      <p className='text-gray-500 italic'>
                        La normativa detallada no está disponible.
                      </p>
                    )}
                  </div>
                </div>
              )}
              {!loading && !error && !edition && (
                <div className='p-10 text-center text-gray-500 min-h-[400px] flex flex-col justify-center items-center'>
                  <AlertTriangle className='h-12 w-12 mb-4 text-yellow-500' />
                  <p className='font-semibold text-lg'>
                    Información no Disponible
                  </p>
                  <p className='text-sm'>
                    No se pudo cargar la normativa para la edición solicitada o
                    no se especificó una edición.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className='px-6 py-4 border-t bg-gray-100 rounded-b-xl flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 sticky bottom-0 z-10'>
              {" "}
              {/* Eliminado bg-white para que el fondo del footer sea distinto */}
              <div className='flex items-center space-x-2.5'>
                <Checkbox
                  id={`accept-regulations-modal-${
                    currentEditionId || "default"
                  }`}
                  checked={isAccepted}
                  onCheckedChange={(checkedStatus) => {
                    onAcceptChange(checkedStatus === true);
                  }}
                  disabled={
                    loading ||
                    !!error ||
                    !edition ||
                    typeof edition.normativa !== "string" ||
                    !edition.normativa.trim()
                  }
                />
                <Label
                  htmlFor={`accept-regulations-modal-${
                    currentEditionId || "default"
                  }`}
                  className='text-sm font-medium text-gray-800 cursor-pointer'>
                  He leído y acepto la normativa
                </Label>
              </div>
              <Button
                variant='outline'
                onClick={() => onOpenChange(false)}
                size='sm'>
                Cerrar
              </Button>
            </DialogFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
