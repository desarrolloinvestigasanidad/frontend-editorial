"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  // Agrega los campos que necesites
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Llamamos a /api/profile para obtener la información del usuario
      fetch("http://localhost:5000/api/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("No se pudo obtener el usuario");
          return res.json();
        })
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          console.error(err);
          // Si hay error, podría ser token inválido. Opcional: remover token
          localStorage.removeItem("token");
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);

    window.location.href = "/login";
  };

  return (
    <header className='bg-white border-b'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='flex items-center'>
            <Image
              src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INVESTIGA%20SANIDAD%20SIN%20FONDO-BLQnlRYtFpCHZb4z2Xwzh7LiZbpq1R.png'
              alt='Investiga Sanidad'
              width={280}
              height={70}
              className='h-16 w-auto'
              priority
            />
          </Link>

          <nav className='hidden md:flex items-center space-x-6'>
            <Link href='/' className='text-gray-600 hover:text-primary'>
              Inicio
            </Link>
            <Link href='/contacto' className='text-gray-600 hover:text-primary'>
              Contacto
            </Link>
            <Link href='/profile' className='text-gray-600 hover:text-primary'>
              Mi perfil
            </Link>

            {/* Si el usuario está autenticado, mostramos su nombre y botón de Logout */}
            {user ? (
              <div className='flex items-center space-x-4'>
                <span className='text-gray-600'>
                  Hola, {user.firstName || user.id}
                </span>
                <Button variant='outline' onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              // Si no está autenticado, mostramos el botón de acceso
              <Link href='/login'>
                <Button variant='outline'>Acceso</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
