"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

// Tabla de precios (en euros) para la compra de capítulos
const priceTable: { [key: number]: number } = {
  1: 25,
  2: 35,
  3: 49,
  4: 64,
  5: 69,
  6: 72,
  7: 89,
  8: 106,
};

interface ChapterSelectionProps {
  // Cantidad de capítulos ya comprados (o total comprados)
  purchasedChapters: number;
  // Callback que se invoca al confirmar la compra,
  // enviando la cantidad de capítulos a comprar y el precio a cobrar
  onSelect: (chaptersToBuy: number, priceToCharge: number) => void;
}

export default function ChapterSelection({
  purchasedChapters,
  onSelect,
}: ChapterSelectionProps) {
  const maxChapters = 8;
  const remaining = maxChapters - purchasedChapters;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Opciones disponibles: de 1 hasta el número "remaining"
  const options = Array.from({ length: remaining }, (_, i) => i + 1);

  // Calcula el precio a cobrar para una opción:
  // Precio acumulado de (purchasedChapters + option)
  // menos el precio ya pagado para purchasedChapters
  const calculatePrice = (option: number): number => {
    const totalCount = purchasedChapters + option;
    const cumulativePrice = priceTable[totalCount] ?? 0;
    const previousPrice =
      purchasedChapters > 0 ? priceTable[purchasedChapters] ?? 0 : 0;
    return cumulativePrice - previousPrice;
  };

  // Calcula el ahorro si se compra un pack vs capítulos sueltos
  const calculateSavings = (option: number): number => {
    if (option <= 1) return 0;
    const price = calculatePrice(option);
    // Suponiendo que comprar 1 capítulo adicional siempre vale
    // `priceTable[purchasedChapters + 1] - priceTable[purchasedChapters]`
    const singleChapterPrice = calculatePrice(1);
    const individualPrice = singleChapterPrice * option;
    return individualPrice - price;
  };

  // Animaciones de framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className='relative overflow-hidden py-8 px-4 md:px-6'>
      {/* Fondo decorativo */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>

      <div className='relative z-10 max-w-5xl mx-auto'>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Compra de Capítulos
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mb-4'></div>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Selecciona cuántos capítulos deseas comprar para tu libro de
            edición.
          </p>
        </motion.div>

        {/* Contenedor de tarjetas */}
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
          {options.map((option) => {
            const price = calculatePrice(option);
            const savings = calculateSavings(option);
            const isSelected = selectedOption === option;

            return (
              <motion.div
                key={option}
                variants={cardVariants}
                className={`relative bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all border ${
                  isSelected
                    ? "border-purple-600"
                    : "border-transparent hover:border-purple-100"
                }`}>
                {/* Ahorro (si existe) */}
                {savings > 0 && (
                  <div className='absolute top-3 right-3 text-xs font-bold bg-green-500 text-white py-1 px-2 rounded-full'>
                    Ahorra {savings}€
                  </div>
                )}

                {/* Título + Precio */}
                <h3 className='text-lg font-bold text-gray-900 mb-1'>
                  {option} {option === 1 ? "Capítulo" : "Capítulos"}
                </h3>
                <p className='text-3xl font-extrabold text-purple-600 mb-4'>
                  {price} €
                </p>

                {/* Lista de características */}
                <ul className='space-y-2 text-gray-700 text-sm mb-6'>
                  <li className='flex items-center'>
                    <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                    Participación como autor/coautor
                  </li>
                  <li className='flex items-center'>
                    <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                    Revisión por expertos
                  </li>
                  <li className='flex items-center'>
                    <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                    Certificado oficial
                  </li>
                  <li className='flex items-center'>
                    <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                    ISBN individual
                  </li>
                </ul>

                {/* Botón de selección */}
                <Button
                  onClick={() => setSelectedOption(option)}
                  className='w-full bg-purple-600 hover:bg-purple-700'>
                  Seleccionar
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Resumen de la selección y botón final */}
        {selectedOption !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mt-8 text-center'>
            <p className='text-lg font-semibold text-gray-800 mb-4'>
              Has seleccionado{" "}
              <span className='font-bold'>{selectedOption}</span>{" "}
              {selectedOption === 1 ? "capítulo" : "capítulos"} por un total de{" "}
              <span className='font-bold text-purple-700'>
                {calculatePrice(selectedOption)}€
              </span>
              {calculateSavings(selectedOption) > 0 && (
                <span className='text-green-600 ml-2'>
                  (Ahorro: {calculateSavings(selectedOption)}€)
                </span>
              )}
            </p>

            <Button
              onClick={() =>
                onSelect(selectedOption, calculatePrice(selectedOption))
              }
              className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300'>
              Completar Compra
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
