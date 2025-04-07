"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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
  // Callback que se invoca al confirmar la compra, enviando la cantidad de capítulos a comprar y el precio a cobrar
  onSelect: (chaptersToBuy: number, priceToCharge: number) => void;
}

export default function ChapterSelection({
  purchasedChapters,
  onSelect,
}: ChapterSelectionProps) {
  const maxChapters = 8;
  const remaining = maxChapters - purchasedChapters;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);

  // Opciones disponibles: de 1 hasta "remaining"
  const options = Array.from({ length: remaining }, (_, i) => i + 1);

  // Calcula el precio a cobrar para una opción:
  // Precio acumulado para (purchasedChapters + option) menos el precio ya pagado (para purchasedChapters)
  const calculatePrice = (option: number): number => {
    const cumulative = purchasedChapters + option;
    const cumulativePrice = priceTable[cumulative];
    const previousPrice =
      purchasedChapters > 0 ? priceTable[purchasedChapters] : 0;
    return cumulativePrice - previousPrice;
  };

  // Calcula el ahorro si se compran en pack versus comprar individualmente
  const calculateSavings = (option: number): number => {
    if (option <= 1) return 0;
    const price = calculatePrice(option);
    const individualPrice = option * calculatePrice(1);
    return individualPrice - price;
  };

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
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

        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
          {options.map((option) => {
            const price = calculatePrice(option);
            const savings = calculateSavings(option);
            const isSelected = selectedOption === option;
            const isHovered = hoveredOption === option;

            return (
              <motion.div
                key={option}
                variants={cardVariants}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`relative backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-md border transition-all duration-300 ${
                  isSelected
                    ? "border-purple-400 shadow-lg ring-2 ring-purple-200"
                    : "border-white/50 hover:border-purple-200 hover:shadow-lg"
                }`}
                onMouseEnter={() => setHoveredOption(option)}
                onMouseLeave={() => setHoveredOption(null)}
                onClick={() => setSelectedOption(option)}
                style={{ cursor: "pointer" }}>
                {option > 1 && savings > 0 && (
                  <div className='absolute -top-3 -right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full'>
                    ¡Ahorra {savings}€
                  </div>
                )}
                <div className='flex flex-col items-center text-center'>
                  <div
                    className={`p-3 rounded-full mb-4 transition-all duration-300 ${
                      isSelected || isHovered
                        ? "bg-purple-200 scale-110"
                        : "bg-purple-100"
                    }`}>
                    <Package className='h-6 w-6 text-purple-700' />
                  </div>
                  <h3 className='text-xl font-bold text-gray-900 mb-1'>
                    {option} {option === 1 ? "Capítulo" : "Capítulos"}
                  </h3>
                  <div className='flex items-center justify-center gap-2 mb-4'>
                    <span className='text-2xl font-bold text-purple-700'>
                      {price}€
                    </span>
                    {option > 1 && (
                      <span className='text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full'>
                        {(price / option).toFixed(2)}€/capítulo
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {selectedOption !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mt-8 text-center'>
            <p className='text-lg font-semibold text-gray-800 mb-4'>
              Has seleccionado {selectedOption}{" "}
              {selectedOption === 1 ? "capítulo" : "capítulos"} por un total de{" "}
              <span className='font-bold text-purple-700'>
                {calculatePrice(selectedOption)}€
              </span>
              {calculateSavings(selectedOption) > 0 && (
                <span className='text-green-600 ml-2'>
                  (Ahorras {calculateSavings(selectedOption)}€)
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
