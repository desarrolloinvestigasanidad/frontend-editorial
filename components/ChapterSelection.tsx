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
  purchasedChapters: number; // ya comprados
  onSelect: (chaptersToBuy: number, priceToCharge: number) => void;
  disabled?: boolean;
}

export default function ChapterSelection({
  purchasedChapters,
  onSelect,
}: ChapterSelectionProps) {
  const maxChapters = 8;
  const remaining = maxChapters - purchasedChapters;
  const options = Array.from({ length: remaining }, (_, i) => i + 1);

  const calculatePrice = (option: number): number => {
    const totalCount = purchasedChapters + option;
    const cumulativePrice = priceTable[totalCount] ?? 0;
    const previousPrice =
      purchasedChapters > 0 ? priceTable[purchasedChapters] ?? 0 : 0;
    return cumulativePrice - previousPrice;
  };

  const getFeatureText = (option: number): string =>
    option <= 5
      ? "Participación como autor principal o coautor"
      : "Autor principal e ilimitado coautor";

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
            Selecciona cuántas participaciones quieres comprar para esta
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
            const featureText = getFeatureText(option);

            return (
              <motion.div
                key={option}
                variants={cardVariants}
                className='relative bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all border border-transparent hover:border-purple-100'>
                <h3 className='text-lg font-bold text-gray-900 mb-1'>
                  {option} {option === 1 ? "Capítulo" : "Capítulos"}
                </h3>
                <p className='text-3xl font-extrabold text-purple-600 mb-4'>
                  {price} €
                </p>

                <ul className='space-y-2 text-gray-700 text-sm mb-6'>
                  <li className='flex items-center'>
                    <CheckCircle className='mr-2 h-4 w-4 text-green-500' />
                    {featureText}
                  </li>
                </ul>

                <Button
                  onClick={() => onSelect(option, price)}
                  className='w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white'>
                  Pagar {option} {option === 1 ? "Capítulo" : "Capítulos"}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
