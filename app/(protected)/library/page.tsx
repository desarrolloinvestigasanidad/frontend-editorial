"use client";

import { useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  const [searchTerm, setSearchTerm] = useState("");

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

  // Función para decidir qué clase de color usar en el fondo
  function bgColorClass(color: string) {
    switch (color) {
      case "orange":
        return "bg-orange-50";
      case "blue":
        return "bg-blue-50";
      case "green":
        return "bg-green-50";
      case "brown":
        return "bg-yellow-50/70";
      case "red":
        return "bg-red-50";
      case "yellow":
        return "bg-yellow-50";
      default:
        return "bg-gray-50";
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Breadcrumb />
      </div>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-xl font-bold'>Biblioteca</CardTitle>
          <BookOpen className='h-5 w-5 text-purple-600' />
        </CardHeader>
        <CardContent>
          {view !== "main" && (
            <Button
              variant='ghost'
              className='mb-4'
              onClick={() => {
                if (view === "publicEditions") {
                  setView("publicYears");
                } else {
                  setView("main");
                }
              }}>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Volver
            </Button>
          )}

          {view === "publicYears" ||
          view === "publicEditions" ||
          view === "ownBooks" ? (
            <div className='relative w-full md:w-64 mb-6'>
              <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
              <Input
                type='search'
                placeholder='Buscar libros...'
                className='pl-8'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          ) : null}

          {/* Render condicional según el estado "view" */}
          {view === "main" && renderMainMenu()}
          {view === "publicYears" && renderPublicYears()}
          {view === "publicEditions" && renderPublicEditions()}
          {view === "ownBooks" && renderOwnBooks()}
        </CardContent>
      </Card>
    </div>
  );

  // Sección principal: 2 tarjetas (Biblioteca pública y propia)
  function renderMainMenu() {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Card: Biblioteca de libros (pública) */}
        <Card
          onClick={() => setView("publicYears")}
          className='cursor-pointer bg-gradient-to-br from-orange-50 to-white hover:shadow-md transition-shadow'>
          <CardContent className='p-6 flex flex-col items-center justify-center'>
            {/* Ícono con color base (orange) */}
            <BookOpen className='h-16 w-16 text-orange-600 mb-3' />
            <h2 className='text-lg font-bold text-orange-700'>
              Biblioteca de libros
            </h2>
          </CardContent>
        </Card>

        {/* Card: Biblioteca de libros propios (solo si hasOwnBooks = true) */}
        {hasOwnBooks && (
          <Card
            onClick={() => setView("ownBooks")}
            className='cursor-pointer bg-gradient-to-br from-blue-50 to-white hover:shadow-md transition-shadow'>
            <CardContent className='p-6 flex flex-col items-center justify-center'>
              <BookOpen className='h-16 w-16 text-blue-600 mb-3' />
              <h2 className='text-lg font-bold text-blue-700'>
                Biblioteca de libros propios
              </h2>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Sección para mostrar los años disponibles (públicos)
  function renderPublicYears() {
    const filteredYears = publicYears.filter((year) =>
      year.year.toString().includes(searchTerm)
    );

    return (
      <div>
        <h2 className='text-xl font-bold mb-4'>Biblioteca de libros</h2>

        {filteredYears.length === 0 ? (
          <div className='p-8 text-center bg-muted/30 rounded-md'>
            <BookOpen className='h-8 w-8 mx-auto text-muted-foreground mb-2' />
            <p className='text-muted-foreground'>
              No se encontraron resultados para "{searchTerm}"
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
            {filteredYears.map((yearObj) => (
              <Card
                key={yearObj.year}
                onClick={() => {
                  setSelectedYear(yearObj);
                  setView("publicEditions");
                }}
                className={`cursor-pointer hover:shadow-md transition-shadow ${bgColorClass(
                  yearObj.color
                )}`}>
                <CardContent className='p-4 flex flex-col items-center justify-center'>
                  {/* Ícono con color dinámico */}
                  <BookOpen
                    className={`h-16 w-16 mb-3 ${iconColorClass(
                      yearObj.color
                    )}`}
                  />
                  <h3 className='font-semibold'>Ediciones {yearObj.year}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Sección para mostrar las ediciones dentro del año seleccionado
  function renderPublicEditions() {
    if (!selectedYear) return null;

    const filteredEditions = editions2024.filter((edition) =>
      edition.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div>
        <h2 className='text-xl font-bold mb-4'>
          Ediciones {selectedYear.year}
        </h2>

        {filteredEditions.length === 0 ? (
          <div className='p-8 text-center bg-muted/30 rounded-md'>
            <BookOpen className='h-8 w-8 mx-auto text-muted-foreground mb-2' />
            <p className='text-muted-foreground'>
              No se encontraron resultados para "{searchTerm}"
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {filteredEditions.map((ed) => (
              <Card
                key={ed.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${bgColorClass(
                  ed.color
                )}`}>
                <CardContent className='p-4 flex flex-col items-center justify-center'>
                  <BookOpen
                    className={`h-12 w-12 mb-3 ${iconColorClass(ed.color)}`}
                  />
                  <p className='text-sm text-center font-semibold'>
                    {ed.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Sección para mostrar los libros propios
  function renderOwnBooks() {
    const filteredBooks = ownBooks.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div>
        <h2 className='text-xl font-bold mb-4'>Mis Libros Propios</h2>

        {filteredBooks.length === 0 ? (
          <div className='p-8 text-center bg-muted/30 rounded-md'>
            <BookOpen className='h-8 w-8 mx-auto text-muted-foreground mb-2' />
            <p className='text-muted-foreground'>
              {searchTerm
                ? `No se encontraron resultados para "${searchTerm}"`
                : "No tienes libros propios."}
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {filteredBooks.map((book) => (
              <Card
                key={book.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${bgColorClass(
                  book.color
                )}`}>
                <CardContent className='p-4 flex flex-col items-center justify-center'>
                  <BookOpen
                    className={`h-12 w-12 mb-3 ${iconColorClass(book.color)}`}
                  />
                  <p className='text-sm text-center font-semibold'>
                    {book.title}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }
}
