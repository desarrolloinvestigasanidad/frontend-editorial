"use client";

import Link from "next/link";
import {
  Home,
  User,
  FileBadge,
  BookOpen,
  Book,
  Library as LibraryIcon,
  Newspaper,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PersonalData from "@/components/profile/personal-data";

export default function UserProfile() {
  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Encabezado / Menú principal */}
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

      <PersonalData />
    </div>
  );
}
