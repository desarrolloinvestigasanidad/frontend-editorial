"use client";

import { useState, useEffect, useCallback } from "react";
import ChapterSelection from "@/components/ChapterSelection";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // AlertTitle para el mensaje de límite
import {
  AlertCircle,
  BookOpen,
  ArrowLeft,
  Info,
  Loader2,
  CheckCircle,
} from "lucide-react"; // Info para el mensaje de límite
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // Asumiendo que usas sonner
import Link from "next/link";

const MAX_CHAPTERS_ALLOWED = 8; // Límite máximo de capítulos

export default function PurchaseChaptersPage() {
  const { user, loading: userLoading } = useUser();
  const { editionId: rawEditionId, bookId: rawBookId } = useParams(); // Renombrar para procesar
  const router = useRouter();

  // Asegurar que los IDs sean strings
  const editionId = Array.isArray(rawEditionId)
    ? rawEditionId[0]
    : rawEditionId;
  const bookId = Array.isArray(rawBookId) ? rawBookId[0] : rawBookId;

  const [hasUser, setHasUser] = useState(false);
  const [totalPurchased, setTotalPurchased] = useState(0);
  const [loadingInitialData, setLoadingInitialData] = useState(true); // Para controlar la carga de todos los datos iniciales
  const [bookTitle, setBookTitle] = useState("");
  const [editionName, setEditionName] = useState("");
  const [regulationsAccepted, setRegulationsAccepted] = useState(false);

  useEffect(() => {
    setHasUser(!!user?.id);
  }, [user]);

  const fetchPurchasedChapters = useCallback(async () => {
    if (!user?.id || !editionId) return; // Asegurar que editionId también exista
    try {
      // ESTE ENDPOINT DEBE DEVOLVER EL NÚMERO TOTAL DE CAPÍTULOS YA PAGADOS PARA ESTA EDICIÓN
      // Anteriormente discutimos cambiarlo a '/chapter-credits' o asegurar que '/available-chapter-credits' devuelva el total pagado.
      // Asumiré que devuelve el total pagado correctamente para la lógica de `totalPurchased`.
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/chapters/users/${user.id}/editions/${editionId}/available-chapter-credits` // O el endpoint correcto para total pagado
      );
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.message || "Error al obtener los capítulos comprados"
        );
      }
      const data = await res.json();
      // Si data.available es el número de créditos que aún puede usar (pagados - usados)
      // Y lo que necesitamos es el total pagado, este fetch podría necesitar ajustarse
      // o necesitar otro endpoint. Por ahora, asumimos que 'data.available' ES el total pagado,
      // o que el problema de precios anterior ya se resolvió ajustando este fetch/endpoint.
      setTotalPurchased(data.available || 0);
    } catch (err: any) {
      console.error("Error fetching purchased chapters:", err);
      toast.error(`Error al cargar capítulos comprados: ${err.message}`);
      setTotalPurchased(0); // Fallback a 0 en caso de error
    }
  }, [user?.id, editionId]);

  const fetchBookAndEditionDetails = useCallback(async () => {
    if (!editionId || !bookId) return;
    try {
      const [bookRes, editionRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}/books/${bookId}`
        ),
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}`),
      ]);

      if (!bookRes.ok) {
        const errorData = await bookRes.json().catch(() => null);
        throw new Error(
          errorData?.message || "Error al obtener detalles del libro"
        );
      }
      const bookData = await bookRes.json();
      setBookTitle(bookData.title);

      if (!editionRes.ok) {
        const errorData = await editionRes.json().catch(() => null);
        throw new Error(
          errorData?.message || "Error al obtener detalles de la edición"
        );
      }
      const editionData = await editionRes.json();
      setEditionName(editionData.name);
    } catch (err: any) {
      console.error("Error fetching book/edition details:", err);
      toast.error(`Error al cargar detalles: ${err.message}`);
    }
  }, [editionId, bookId]);

  useEffect(() => {
    const loadData = async () => {
      setLoadingInitialData(true);
      if (hasUser && editionId && bookId) {
        await Promise.all([
          fetchPurchasedChapters(),
          fetchBookAndEditionDetails(),
        ]);
      } else if (!userLoading && !hasUser) {
        // Si ya sabemos que no hay usuario
        // No hacer nada más, el render se encargará
      }
      setLoadingInitialData(false);
    };

    if (!userLoading) {
      // Solo ejecutar si la carga del usuario ha terminado
      loadData();
    }
  }, [
    hasUser,
    userLoading,
    editionId,
    bookId,
    fetchPurchasedChapters,
    fetchBookAndEditionDetails,
  ]);

  const handleSelect = (chaptersToBuy: number, priceToCharge: number) => {
    if (!regulationsAccepted) {
      // Este alert es redundante si el botón en ChapterSelection está deshabilitado o maneja el modal.
      // Considera usar toast si se mantiene.
      toast.warning(
        "Debes aceptar la normativa de la edición antes de continuar."
      );
      return;
    }
    if (!user?.id) {
      console.error("User ID missing");
      toast.error("Error de usuario. Por favor, recarga la página.");
      return;
    }
    if (!process.env.NEXT_PUBLIC_BASE_URL) {
      console.error("NEXT_PUBLIC_BASE_URL is not defined");
      toast.error("Error de configuración del sistema de pagos.");
      return;
    }

    const currentEditionId = Array.isArray(editionId)
      ? editionId[0]
      : editionId;
    if (!currentEditionId) {
      toast.error("Error: ID de edición no encontrado.");
      return;
    }

    const payload = {
      userId: user.id,
      bookTitle: bookTitle || "Libro de Edición",
      amount: (priceToCharge * 100).toString(),
      metadata: {
        userId: user.id,
        editionId: currentEditionId,
        chapterCount: chaptersToBuy.toString(),
        bookTitle: bookTitle || "Libro de Edición", // Enviar un título de fallback si no está cargado
      },
    };

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((r) => {
        if (!r.ok) {
          return r.json().then((errData) => {
            throw new Error(
              errData.message || `Error ${r.status} en el checkout`
            );
          });
        }
        return r.json();
      })
      .then((d) => {
        if (d.url) {
          router.push(d.url);
        } else {
          throw new Error("Respuesta de checkout inválida: URL no encontrada.");
        }
      })
      .catch((err) => {
        console.error("Error en el proceso de checkout:", err);
        toast.error(`Error al procesar el pago: ${err.message}`);
      });
  };

  if (userLoading || loadingInitialData) {
    return (
      <div className='flex flex-col justify-center items-center min-h-[calc(100vh-200px)] p-4'>
        {" "}
        {/* Ajustado para mejor centrado */}
        <Loader2 className='h-12 w-12 animate-spin text-purple-600 mb-4' />
        <p className='text-gray-600 font-medium'>
          Cargando información de compra...
        </p>
      </div>
    );
  }

  if (!hasUser) {
    return (
      <Alert variant='destructive' className='max-w-lg mx-auto mt-12 shadow-md'>
        <AlertCircle className='h-5 w-5' />
        <AlertTitle className='font-semibold'>Acceso Denegado</AlertTitle>
        <AlertDescription>
          No se encontró información del usuario. Por favor,{" "}
          <Link href='/login' className='underline hover:text-blue-700'>
            inicia sesión
          </Link>{" "}
          para continuar.
        </AlertDescription>
      </Alert>
    );
  }

  const reachedMaxChapters = totalPurchased >= MAX_CHAPTERS_ALLOWED;

  return (
    <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6'>
      <Card className='w-full shadow-xl overflow-hidden'>
        <CardHeader className='bg-gray-50 p-5 border-b'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.back()}
              className='flex items-center gap-1.5 self-start sm:self-center'>
              <ArrowLeft className='h-4 w-4' /> Volver
            </Button>
            <div className='flex items-center gap-3'>
              <BookOpen className='h-7 w-7 text-purple-600 shrink-0' />
              <div>
                <CardTitle className='text-xl md:text-2xl text-gray-800'>
                  Compra de Participaciones
                </CardTitle>
                <CardDescription className='text-sm text-gray-500 mt-1'>
                  {bookTitle
                    ? `Libro: ${bookTitle}`
                    : "Cargando detalles del libro..."}
                  {editionName ? ` - Edición: ${editionName}` : ""}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className='p-5 sm:p-6'>
          {reachedMaxChapters ? (
            <Alert
              variant='default'
              className='bg-green-50 border-green-200 text-green-800 shadow'>
              <CheckCircle className='h-5 w-5 text-green-600' />
              <AlertTitle className='font-semibold'>
                Límite Alcanzado
              </AlertTitle>
              <AlertDescription>
                Ya has adquirido el número máximo de ({MAX_CHAPTERS_ALLOWED})
                participaciones para esta edición. ¡Gracias por tu completa
                participación! No puedes comprar más capítulos.
              </AlertDescription>
            </Alert>
          ) : (
            <ChapterSelection
              purchasedChapters={totalPurchased}
              onSelect={handleSelect}
              // disabled general ya no se usa aquí, el hijo maneja su estado de botones
              editionId={editionId}
              isRegulationsAccepted={regulationsAccepted}
              onRegulationsAcceptChange={setRegulationsAccepted}
              maxChaptersAllowed={MAX_CHAPTERS_ALLOWED} // Pasar el máximo al componente hijo
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
