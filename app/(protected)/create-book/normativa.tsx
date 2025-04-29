"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function Normativa() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
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
      className='px-4 py-6 max-w-4xl space-y-6'>
      <motion.h1
        variants={itemVariants}
        className='text-3xl font-bold text-purple-800'>
        NORMATIVA DE LIBROS COMPLETOS ANTES DE PAGAR
      </motion.h1>

      {[
        {
          title: "Añadir coautores",
          desc: "El autor principal tendrá la responsabilidad de añadir a todos los coautores que formarán parte del libro. Debe asegurarse de incluir correctamente los nombres y datos de contacto de cada uno. Los coautores podrán participar activamente en la creación y edición del contenido del libro.",
        },
        {
          title: "Responsabilidades del autor principal",
          desc: "El autor principal será quien gestione y coordine todo el proceso de publicación del libro, desde la apertura hasta el cierre del proyecto. Esto incluye asegurarse de que todos los coautores envíen sus capítulos y coordinar cualquier corrección necesaria.",
        },
        {
          title: "Participación de los coautores",
          desc: "Los coautores podrán participar en la edición del libro, enviar sus capítulos, y colaborar en el contenido general del libro. Sin embargo, la responsabilidad final de la organización y el cierre del libro recae en el autor principal.",
        },
        {
          title: "Proceso de creación y publicación",
          desc: "Una vez que el autor principal haya añadido a los coautores y se haya realizado el pago correspondiente, el proceso de creación y revisión del libro comenzará. El autor principal será quien habilite la opción de cierre una vez que todos los capítulos estén listos.",
        },
      ].map((item, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          className='bg-purple-50 p-4 rounded-lg border border-purple-100'>
          <div className='flex items-start gap-2 mb-2'>
            <CheckCircle className='text-purple-600 h-5 w-5 flex-shrink-0' />
            <h2 className='font-semibold text-purple-900'>{item.title}</h2>
          </div>
          <p className='text-sm text-gray-700 pl-7'>{item.desc}</p>
        </motion.div>
      ))}

      <motion.div
        variants={itemVariants}
        className='space-y-2 text-gray-700 text-sm'>
        <p>
          Derechos de autor: Todos los autores deberán ceder los derechos de
          publicación a Investiga Sanidad al momento de enviar su capítulo para
          la publicación y aceptar que cumplen con la Ley de Propiedad
          Intelectual de sus trabajos.
        </p>
        <p>
          Correcciones Post-Publicación: Después de la publicación final, no se
          aceptarán correcciones o modificaciones en los capítulos.
        </p>
      </motion.div>
    </motion.div>
  );
}
