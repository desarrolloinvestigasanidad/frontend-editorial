"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  AlertTriangle,
  CreditCard,
  Settings,
  Scale,
  Mail,
} from "lucide-react";

export default function Terminos() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='px-4 py-6 max-w-4xl'>
      <motion.div variants={itemVariants} className='mb-8'>
        <h1 className='text-3xl font-bold mb-4 text-primary'>
          TÉRMINOS Y CONDICIONES
        </h1>
        <div className='h-1 w-24 bg-primary rounded mb-6'></div>
      </motion.div>

      <motion.div variants={itemVariants} className='mb-8'>
        <div className='flex items-start gap-4'>
          <div className='mt-1 bg-primary/10 p-2 rounded-full'>
            <FileText className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h2 className='text-xl font-semibold mb-3 text-primary'>
              1. Objeto
            </h2>
            <div className='bg-muted/30 p-4 rounded-lg'>
              <p className='text-muted-foreground text-sm'>
                El presente documento regula el acceso y uso del sitio web{" "}
                <span className='font-semibold'>www.investigasanidad.es</span>,
                titularidad de{" "}
                <span className='font-semibold'>SANIMARON S.L.</span>, así como
                la contratación de los servicios ofrecidos en la plataforma.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className='mb-8'>
        <div className='flex items-start gap-4'>
          <div className='mt-1 bg-primary/10 p-2 rounded-full'>
            <Shield className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h2 className='text-xl font-semibold mb-3 text-primary'>
              2. Condiciones de Uso
            </h2>
            <p className='mb-3 text-muted-foreground text-sm'>
              El acceso al portal es gratuito, salvo que se especifique lo
              contrario. Los usuarios se comprometen a:
            </p>
            <ul className='space-y-2 pl-0'>
              <li className='flex items-start gap-3 bg-muted/20 p-3 rounded-lg'>
                <div className='h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='h-1.5 w-1.5 rounded-full bg-primary'></span>
                </div>
                <span className='text-muted-foreground text-sm'>
                  Hacer un uso adecuado de los contenidos y servicios del sitio.
                </span>
              </li>
              <li className='flex items-start gap-3 bg-muted/20 p-3 rounded-lg'>
                <div className='h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='h-1.5 w-1.5 rounded-full bg-primary'></span>
                </div>
                <span className='text-muted-foreground text-sm'>
                  No realizar actividades ilícitas, fraudulentas o que puedan
                  dañar el funcionamiento del sitio.
                </span>
              </li>
              <li className='flex items-start gap-3 bg-muted/20 p-3 rounded-lg'>
                <div className='h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='h-1.5 w-1.5 rounded-full bg-primary'></span>
                </div>
                <span className='text-muted-foreground text-sm'>
                  No introducir virus u otros elementos que puedan alterar o
                  dañar sistemas informáticos.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className='mb-8'>
        <div className='flex items-start gap-4'>
          <div className='mt-1 bg-primary/10 p-2 rounded-full'>
            <FileText className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h2 className='text-xl font-semibold mb-3 text-primary'>
              3. Propiedad Intelectual
            </h2>
            <div className='bg-muted/30 p-4 rounded-lg'>
              <p className='text-muted-foreground text-sm'>
                Todos los contenidos de la web (textos, imágenes, logotipos,
                diseños, software, etc.) son propiedad de{" "}
                <span className='font-semibold'>SANIMARON S.L.</span> o de
                terceros licenciantes. Se prohíbe la reproducción, distribución,
                modificación o cualquier otro uso sin autorización expresa.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className='mb-8'>
        <div className='flex items-start gap-4'>
          <div className='mt-1 bg-primary/10 p-2 rounded-full'>
            <AlertTriangle className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h2 className='text-xl font-semibold mb-3 text-primary'>
              4. Exclusión de Responsabilidad
            </h2>
            <div className='space-y-3'>
              <p className='text-muted-foreground text-sm'>
                SANIMARON S.L. no garantiza la disponibilidad continua del sitio
                web y no se hace responsable de fallos técnicos, interrupciones
                del servicio o errores en el contenido, ni de daños o perjuicios
                derivados del uso de la información.
              </p>
              <p className='text-muted-foreground text-sm'>
                Asimismo, no se responsabiliza de enlaces a terceros cuyo
                contenido es ajeno a su control.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className='mb-8'>
        <div className='flex items-start gap-4'>
          <div className='mt-1 bg-primary/10 p-2 rounded-full'>
            <CreditCard className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h2 className='text-xl font-semibold mb-3 text-primary'>
              5. Contratación de Servicios
            </h2>
            <p className='mb-3 text-muted-foreground text-sm'>
              La contratación de servicios a través de la web está sujeta a las
              siguientes condiciones:
            </p>
            <ul className='space-y-2 pl-0'>
              <li className='flex items-start gap-3 bg-muted/20 p-3 rounded-lg'>
                <div className='h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='h-1.5 w-1.5 rounded-full bg-primary'></span>
                </div>
                <span className='text-muted-foreground text-sm'>
                  El usuario debe ser mayor de edad y proporcionar datos
                  veraces.
                </span>
              </li>
              <li className='flex items-start gap-3 bg-muted/20 p-3 rounded-lg'>
                <div className='h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='h-1.5 w-1.5 rounded-full bg-primary'></span>
                </div>
                <span className='text-muted-foreground text-sm'>
                  Los precios y condiciones de los servicios se detallan antes
                  de la contratación.
                </span>
              </li>
              <li className='flex items-start gap-3 bg-muted/20 p-3 rounded-lg'>
                <div className='h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5'>
                  <span className='h-1.5 w-1.5 rounded-full bg-primary'></span>
                </div>
                <span className='text-muted-foreground text-sm'>
                  En ciertos casos se podrá requerir pago previo para la
                  contratación de algunos servicios.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className='mb-8'>
        <div className='flex items-start gap-4'>
          <div className='mt-1 bg-primary/10 p-2 rounded-full'>
            <Settings className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h2 className='text-xl font-semibold mb-3 text-primary'>
              6. Modificación de Condiciones
            </h2>
            <div className='bg-muted/30 p-4 rounded-lg'>
              <p className='text-muted-foreground text-sm'>
                SANIMARON S.L. se reserva el derecho de modificar estos términos
                y condiciones en cualquier momento. La utilización continuada
                del sitio tras dichas modificaciones implica la aceptación de
                los nuevos términos.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className='mb-8'>
        <div className='flex items-start gap-4'>
          <div className='mt-1 bg-primary/10 p-2 rounded-full'>
            <Scale className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h2 className='text-xl font-semibold mb-3 text-primary'>
              7. Legislación Aplicable y Jurisdicción
            </h2>
            <div className='space-y-3'>
              <p className='text-muted-foreground text-sm'>
                Estos términos se rigen por la legislación española. Cualquier
                disputa será resuelta en los tribunales de Murcia.
              </p>
              <div className='flex items-center gap-2 mt-4 bg-primary/5 p-3 rounded-lg'>
                <Mail className='h-4 w-4 text-primary' />
                <p className='text-muted-foreground text-sm'>
                  Para cualquier consulta, puede contactarse a través del
                  correo:{" "}
                  <span className='font-semibold text-primary'>
                    protecciondedatos@totaldata.es
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className='mt-8 border-t pt-6 text-center'>
        <p className='text-sm text-muted-foreground'>
          Última actualización:{" "}
          {new Date().toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </motion.div>
    </motion.div>
  );
}
