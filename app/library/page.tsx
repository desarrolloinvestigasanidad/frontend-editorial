"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  FileBadge,
  Home,
  LibraryIcon,
  User,
} from "lucide-react";

interface Edition {
  id: number;
  title: string;
  color: "orange" | "blue" | "green" | "brown" | "red" | "yellow";
}

interface YearData {
  year: number;
  color: "orange" | "blue" | "green";
}

export default function LibraryPage() {
  // Mock: el usuario sí tiene libros propios
  const hasOwnBooks = true;

  // Mock: Años disponibles en la biblioteca pública
  const publicYears: YearData[] = [
    { year: 2024, color: "orange" },
    { year: 2023, color: "blue" },
    { year: 2022, color: "blue" },
    { year: 2021, color: "green" },
    { year: 2020, color: "orange" },
  ];

  // Mock: Ediciones para el año 2024
  const editions2024: Edition[] = [
    {
      id: 1,
      title: "Edición XVI Libros Electrónicos enero 2024",
      color: "orange",
    },
    {
      id: 2,
      title: "Edición XVII Libros Electrónicos febrero 2024",
      color: "green",
    },
    {
      id: 3,
      title: "Edición XVIII Libros Electrónicos marzo 2024",
      color: "blue",
    },
    {
      id: 4,
      title: "Edición XIX Libros Electrónicos abril 2024",
      color: "brown",
    },
    { id: 5, title: "Edición XX Libros Electrónicos mayo 2024", color: "red" },
    {
      id: 6,
      title: "Edición XXI Libros Electrónicos junio 2024",
      color: "yellow",
    },
    {
      id: 7,
      title: "Edición XXII Libros Electrónicos julio 2024",
      color: "orange",
    },
    {
      id: 8,
      title: "Edición XXIII Libros Electrónicos agosto 2024",
      color: "green",
    },
    {
      id: 9,
      title: "Edición XXIV Libros Electrónicos septiembre 2024",
      color: "blue",
    },
    {
      id: 10,
      title: "Edición XXV Libros Electrónicos octubre 2024",
      color: "brown",
    },
    {
      id: 11,
      title: "Edición XXVI Libros Electrónicos noviembre 2024",
      color: "red",
    },
  ];

  // Mock: Tus libros propios
  const ownBooks = [
    { id: 101, title: "Libro Propio: Emergencias 2024", color: "orange" },
    { id: 102, title: "Libro Propio: Salud Pública", color: "blue" },
  ];

  // Estado de navegación
  const [view, setView] = useState<
    "main" | "publicYears" | "publicEditions" | "ownBooks"
  >("main");
  const [selectedYear, setSelectedYear] = useState<YearData | null>(null);

  // Función para decidir qué clase de color usar en el ícono
  function iconColorClass(color: string) {
    switch (color) {
      case "orange":
        return "text-orange-600";
      case "blue":
        return "text-blue-600";
      case "green":
        return "text-green-600";
      case "brown":
        return "text-yellow-900"; // Asignamos un marrón
      case "red":
        return "text-red-600";
      case "yellow":
        return "text-yellow-500";
      default:
        return "text-gray-600";
    }
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Botón "Volver" y título */}
      <div className='flex items-center gap-4 mb-6'>
        <Link href='/'>
          <Button variant='ghost' className='flex items-center gap-2 px-0'>
            <ArrowLeft className='h-4 w-4' />
            Volver
          </Button>
        </Link>
        <header className='flex flex-col items-center justify-center gap-4 mb-8 md:flex-row md:items-center md:justify-start'>
          {/* Opción: "Inicio" */}
          <Link
            href='/'
            className='flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors mx-2'>
            <Home className='h-8 w-8' />
            <span className='text-sm mt-1'>Inicio</span>
          </Link>

          {/* Opción: "Mi Perfil" */}
          <Link
            href='/profile'
            className='flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors mx-2'>
            <User className='h-8 w-8' />
            <span className='text-sm mt-1'>Mi Perfil</span>
          </Link>

          {/* Opción: "Certificados" (provisionales/definitivos) */}
          <Link
            href='/certificates'
            className='flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors mx-2'>
            <FileBadge className='h-8 w-8' />
            <span className='text-sm mt-1'>Certificados</span>
          </Link>

          {/* Opción: "Mis Publicaciones" */}
          <Link
            href='/publications'
            className='flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors mx-2'>
            <BookOpen className='h-8 w-8' />
            <span className='text-sm mt-1'>Mis Publicaciones</span>
          </Link>

          {/* Opción: "Biblioteca" */}
          <Link
            href='/library'
            className='flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors mx-2'>
            <LibraryIcon className='h-8 w-8' />
            <span className='text-sm mt-1'>Biblioteca</span>
          </Link>
        </header>
        <h1 className='text-xl font-bold'>Biblioteca</h1>
      </div>

      {/* Render condicional según el estado "view" */}
      {view === "main" && renderMainMenu()}
      {view === "publicYears" && renderPublicYears()}
      {view === "publicEditions" && renderPublicEditions()}
      {view === "ownBooks" && renderOwnBooks()}
    </div>
  );

  // Sección principal: 2 tarjetas (Biblioteca pública y propia)
  function renderMainMenu() {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Card: Biblioteca de libros (pública) */}
        <div
          onClick={() => setView("publicYears")}
          className='cursor-pointer bg-orange-100 p-6 rounded-lg flex flex-col items-center justify-center hover:shadow'>
          {/* Ícono con color base (orange) */}
          <BookOpen className='h-16 w-16 text-orange-600 mb-3' />
          <h2 className='text-lg font-bold text-orange-700'>
            Biblioteca de libros
          </h2>
        </div>

        {/* Card: Biblioteca de libros propios (solo si hasOwnBooks = true) */}
        {hasOwnBooks && (
          <div
            onClick={() => setView("ownBooks")}
            className='cursor-pointer bg-blue-100 p-6 rounded-lg flex flex-col items-center justify-center hover:shadow'>
            <BookOpen className='h-16 w-16 text-blue-600 mb-3' />
            <h2 className='text-lg font-bold text-blue-700'>
              Biblioteca de libros propios
            </h2>
          </div>
        )}
      </div>
    );
  }

  // Sección para mostrar los años disponibles (públicos)
  function renderPublicYears() {
    return (
      <div>
        {/* Botón "Volver" para regresar al main */}
        <Button
          variant='ghost'
          className='mb-4'
          onClick={() => setView("main")}>
          <ArrowLeft className='h-4 w-4' />
          Volver
        </Button>

        <h2 className='text-xl font-bold mb-4'>Biblioteca de libros</h2>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {publicYears.map((yearObj) => (
            <div
              key={yearObj.year}
              onClick={() => {
                setSelectedYear(yearObj);
                setView("publicEditions");
              }}
              className={`cursor-pointer p-4 rounded-lg hover:shadow flex flex-col items-center justify-center ${
                yearObj.color === "orange"
                  ? "bg-orange-100"
                  : yearObj.color === "blue"
                  ? "bg-blue-100"
                  : "bg-green-100"
              }`}>
              {/* Ícono con color dinámico */}
              <BookOpen
                className={`h-16 w-16 mb-3 ${iconColorClass(yearObj.color)}`}
              />
              <h3 className='font-semibold'>Ediciones {yearObj.year}</h3>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sección para mostrar las ediciones dentro del año seleccionado
  function renderPublicEditions() {
    if (!selectedYear) return null;

    return (
      <div>
        {/* Botón volver a "publicYears" */}
        <Button
          variant='ghost'
          className='mb-4'
          onClick={() => setView("publicYears")}>
          <ArrowLeft className='h-4 w-4' />
          Volver
        </Button>

        <h2 className='text-xl font-bold mb-4'>
          Ediciones {selectedYear.year}
        </h2>

        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
          {editions2024.map((ed) => (
            <div
              key={ed.id}
              className={`cursor-pointer p-4 rounded-lg hover:shadow flex flex-col items-center justify-center ${
                ed.color === "orange"
                  ? "bg-orange-100"
                  : ed.color === "blue"
                  ? "bg-blue-100"
                  : ed.color === "green"
                  ? "bg-green-100"
                  : ed.color === "brown"
                  ? "bg-yellow-50"
                  : ed.color === "red"
                  ? "bg-red-50"
                  : ed.color === "yellow"
                  ? "bg-yellow-100"
                  : "bg-gray-100"
              }`}>
              <BookOpen
                className={`h-16 w-16 mb-3 ${iconColorClass(ed.color)}`}
              />
              <p className='text-sm text-center font-semibold'>{ed.title}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Sección para mostrar los libros propios
  function renderOwnBooks() {
    return (
      <div>
        <Button
          variant='ghost'
          className='mb-4'
          onClick={() => setView("main")}>
          <ArrowLeft className='h-4 w-4' />
          Volver
        </Button>
        <h2 className='text-xl font-bold mb-4'>Mis Libros Propios</h2>

        {ownBooks.length === 0 ? (
          <p className='text-gray-600'>No tienes libros propios.</p>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {ownBooks.map((book) => (
              <div
                key={book.id}
                className={`cursor-pointer p-4 rounded-lg hover:shadow flex flex-col items-center justify-center ${
                  book.color === "orange"
                    ? "bg-orange-100"
                    : book.color === "blue"
                    ? "bg-blue-100"
                    : book.color === "green"
                    ? "bg-green-100"
                    : "bg-gray-100"
                }`}>
                <BookOpen
                  className={`h-16 w-16 mb-3 ${iconColorClass(book.color)}`}
                />
                <p className='text-sm text-center font-semibold'>
                  {book.title}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
