import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ConfidentialityLawModalProps {
  trigger: React.ReactNode;
}

export function ConfidentialityLawModal({
  trigger,
}: ConfidentialityLawModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-xl text-orange-600'>
            Ley de confidencialidad informática
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4 mt-4 text-sm'>
          <p>
            Los autores de esta obra han contrastado toda la información con
            fuentes fiables para asegurar que esta sea lo más completa posible y
            conforme a los estándares vigentes en el momento de su publicación.
            No obstante, ni los autores, ni la editorial, ni ninguna otra
            persona involucrada en la elaboración de esta obra pueden garantizar
            que el contenido aquí recogido sea absolutamente exacto o esté libre
            de omisiones.
          </p>
          <p>
            El lector deberá extremar la atención en la consulta de datos
            relacionados con medicamentos o situaciones clínicas complejas o en
            controversia. Las opiniones expresadas corresponden exclusivamente a
            los autores, sin que esto reste valor a otras posibles perspectivas.
          </p>

          <h3 className='font-bold text-lg mt-6 mb-2'>
            1. Ley de Propiedad Intelectual. Normas en el uso de referencias a
            cumplir por el autor
          </h3>
          <ul className='list-disc pl-5 space-y-2'>
            <li>
              Citar entre comillas cualquier frase o párrafo reproducido
              literalmente, acreditando su fuente mediante una referencia.
            </li>
            <li>
              Referenciar correctamente el contenido ajeno siguiendo una
              normativa reconocida (Vancouver, Chicago, APA, Harvard, MLA, ISO
              960...).
            </li>
            <li>
              Todo contenido que no sea de autoría propia debe estar claramente
              referenciado.
            </li>
          </ul>

          <h3 className='font-bold text-lg mt-6 mb-2'>2. Cesión de derechos</h3>
          <p>
            El autor acepta ceder de manera libre, voluntaria y sin
            contraprestación económica los derechos de la obra a la editorial.
            Esta cesión abarca los derechos de reproducción, distribución,
            transformación, comunicación pública y comercialización de la obra,
            ya sea en formato digital o físico, en cualquiera de sus modalidades
            actuales.
          </p>
          <p className='mt-2'>
            Con esta cesión, el autor asume las siguientes responsabilidades:
          </p>
          <ul className='list-disc pl-5 space-y-2 mt-2'>
            <li>
              Los autores garantizan que todo el material gráfico utilizado es
              original y que cuentan con las autorizaciones necesarias para su
              uso. Declaran que la obra es de su autoría y que los derechos que
              ceden no se encuentran comprometidos con terceros. Serán
              responsables frente al editor de cualquier reclamación que surja
              por este motivo.
            </li>
            <li>
              Todo el contenido —incluyendo opiniones, estudios, redacción,
              material gráfico y demás aportaciones— se proporciona bajo la
              exclusiva responsabilidad de sus autores, quienes asumen la total
              responsabilidad legal de los mismos. Investiga Sanidad y SOCIDESA
              quedan exentas de cualquier responsabilidad derivada del uso o
              aplicación de dichos contenidos.
            </li>
            <li>
              La editorial se compromete a respetar los derechos morales del
              autor e informarle de cualquier infracción detectada.
            </li>
            <li>
              En conformidad con el Real Decreto Legislativo 1/1996, de 12 de
              abril, y la Ley 23/2006 de modificación del mismo, el editor, como
              cesionario exclusivo de los derechos de explotación, podrá usar el
              símbolo © en todos los ejemplares publicados, indicando lugar y
              fecha de publicación. También podrá introducir modificaciones
              editoriales en el contenido, sin obligación de notificación previa
              al autor.
            </li>
            <li>
              El editor podrá registrar los derechos sobre la obra en los
              organismos públicos que considere pertinentes.
            </li>
            <li>
              Tanto el editor como los autores podrán ejercer acciones legales o
              extrajudiciales frente a infracciones de los derechos cedidos. Los
              autores se comprometen a colaborar en dichas acciones si fueran
              necesarias.
            </li>
            <li>
              La editorial no se responsabiliza de que la publicación cumpla los
              fines curriculares o profesionales que el autor persiga con la
              obra.
            </li>
            <li>
              La editorial aplicará criterios de calidad científica y contará
              con revisión lingüística asistida por tecnologías avanzadas para
              asegurar el rigor del texto.
            </li>
          </ul>

          <h3 className='font-bold text-lg mt-6 mb-2'>3. Glosario</h3>
          <h4 className='font-semibold mt-4'>
            1. ¿Qué es la propiedad intelectual?
          </h4>
          <p>
            La propiedad intelectual protege los derechos de los creadores de
            obras literarias, científicas o artísticas, así como los derechos
            relacionados con la propiedad industrial, como patentes y marcas.
            Está reconocida en el artículo 27 de la Declaración Universal de los
            Derechos Humanos y otorga al autor el derecho moral de identificar
            la obra como suya.
          </p>
          <p>
            En el entorno digital, este derecho también regula cómo puede
            difundirse y compartirse una creación en internet.
          </p>

          <h4 className='font-semibold mt-4'>
            2. Tipos de propiedad intelectual
          </h4>
          <p>
            A nivel internacional, la Organización Mundial de la Propiedad
            Intelectual (OMPI), bajo el amparo de la ONU, regula estas
            cuestiones desde el Tratado de Berna (1886). En España, la normativa
            deriva de la Directiva Europea y se regula principalmente por el
            Real Decreto Legislativo 1/1996, modificado por el Real Decreto-ley
            12/2017.
          </p>
          <p>Se distinguen dos grandes categorías:</p>

          <h4 className='font-semibold mt-4'>
            3. Derechos de propiedad industrial
          </h4>
          <p>
            Engloba creaciones como patentes, marcas y diseños industriales.
          </p>

          <h4 className='font-semibold mt-4'>4. Derechos de autor</h4>
          <p>
            Protege obras literarias y artísticas, defendiendo los derechos de
            un autor sobre sus obras. La ley protege al creador desde el momento
            en que da forma a su obra, sin que sea necesario su registro o
            ningún otro trámite para que surjan sus derechos.
          </p>
          <p>
            Entre los derechos más relevantes se encuentran los derechos
            morales, que permiten al autor:
          </p>
          <ul className='list-disc pl-5 space-y-2'>
            <li>Decidir si desea divulgar o no su obra y de qué manera.</li>
            <li>
              Elegir si quiere aparecer con su nombre, con seudónimo o en
              anonimato.
            </li>
            <li>Reclamar el reconocimiento de su autoría.</li>
            <li>
              Exigir el respeto a la integridad de la obra, impidiendo
              alteraciones que vayan en contra de sus intereses.
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
