"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RegulationsModalProps {
  isAccepted: boolean;
  onAcceptChange: (accepted: boolean) => void;
}

export default function RegulationsModal({
  isAccepted,
  onAcceptChange,
}: RegulationsModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Leer Normativa de Publicación</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            Normativa de Publicación - Edición de Libros de Investiga Sanidad
          </DialogTitle>
          <DialogDescription>
            Por favor, lee atentamente la normativa antes de continuar con la
            compra de capítulos.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-[400px] pr-4'>
          <div className='space-y-4 text-sm'>
            <p>Estimado/a autor/a,</p>
            <p>
              Te damos la bienvenida a la [Nombre de la Edición/Libro] de
              Investiga Sanidad. A continuación, te detallamos las normativas y
              fechas importantes para el envío de tus capítulos, la publicación
              de la edición y la descarga de los libros y certificados:
            </p>

            <h3 className='text-base font-medium'>1. Envío de Capítulos</h3>
            <p>
              El plazo para el envío de capítulos es [Fecha límite]. Recuerda
              que cada capítulo debe ajustarse a las siguientes especificaciones
              para poder ser considerado para la publicación:
            </p>
            <ul className='list-disc pl-5 space-y-1'>
              <li>
                Cada capítulo debe tener una extensión mínima y máxima en cada
                uno de los apartados.
              </li>
              <li>
                Si tu capítulo no cumple con las especificaciones o con la
                calidad de contenido establecido por el comité científico de la
                editorial, será rechazado y lo devolveremos para su corrección
                antes de su publicación, siempre y cuando esté dentro de plazo.
              </li>
            </ul>

            <h3 className='text-base font-medium'>2. Revisión y Publicación</h3>
            <ul className='list-disc pl-5 space-y-1'>
              <li>
                Los capítulos serán evaluados por nuestro equipo editorial, y
                los autores recibirán notificaciones sobre la aceptación o
                correcciones necesarias.
              </li>
              <li>
                La fecha de publicación oficial de la edición es el [Fecha de
                publicación]. A partir de esta fecha, la edición estará
                disponible para su descarga.
              </li>
            </ul>

            <h3 className='text-base font-medium'>
              3. Descarga de Libros y Certificados
            </h3>
            <p>
              Después de la publicación, los autores y coautores podrán
              descargar los siguientes recursos:
            </p>
            <ul className='list-disc pl-5 space-y-1'>
              <li>
                Libro Completo: Una vez publicado el libro, estará disponible
                para su descarga completa en [Fecha de publicación].
              </li>
              <li>
                Certificados de Participación: Los certificados estarán
                disponibles para descarga desde [Fecha de publicación] y hasta
                [Fecha límite de descarga].
              </li>
            </ul>

            <h3 className='text-base font-medium'>
              4. Términos y Condiciones Adicionales
            </h3>
            <ul className='list-disc pl-5 space-y-1'>
              <li>
                Derechos de autor: Todos los autores deberán ceder los derechos
                de publicación a Investiga Sanidad al momento de enviar su
                capítulo para la publicación y aceptar que cumplen con la Ley de
                Propiedad Intelectual de sus trabajos.
              </li>
              <li>
                Correcciones Post-Publicación: Después de la publicación final,
                no se aceptarán correcciones o modificaciones en los capítulos.
              </li>
            </ul>

            <h3 className='text-base font-medium'>Fechas importantes:</h3>
            <ul className='list-disc pl-5 space-y-1'>
              <li>Envío de capítulos: [FECHA]</li>
              <li>Revisión y corrección de trabajos: [FECHA]</li>
              <li>
                Publicación de la edición y descarga de certificados: [FECHA]
              </li>
            </ul>

            <p className='font-medium'>El equipo de Investiga Sanidad</p>
          </div>
        </ScrollArea>
        <DialogFooter className='flex flex-col sm:flex-row gap-2 sm:gap-0'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='accept-regulations'
              checked={isAccepted}
              onCheckedChange={(checked) => {
                onAcceptChange(checked === true);
              }}
            />
            <Label htmlFor='accept-regulations'>
              He leído y acepto la normativa de publicación
            </Label>
          </div>
          <Button onClick={() => setOpen(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
