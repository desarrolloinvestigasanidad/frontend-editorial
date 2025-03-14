"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res: Response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: formData.id,
            password: formData.password,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      } else {
        setMessage(data.message || "Error al iniciar sesión.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al iniciar sesión.");
    }
  };

  return (
    <div className='min-h-[70vh] flex items-center justify-center p-4 bg-gray-50'>
      <div className='bg-white w-full max-w-4xl shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row'>
        {/* Columna izquierda con imagen */}
        <div className='relative md:w-1/2 bg-gray-800'>
          <Image
            src='https://images.pexels.com/photos/8376232/pexels-photo-8376232.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            alt='Registro en congresos médicos'
            fill
            className='object-cover absolute inset-0 opacity-30'
          />
          <div className='absolute inset-0  mix-blend-multiply' />
        </div>

        {/* Columna derecha con formulario */}
        <div className='md:w-1/2 p-8 lg:p-12'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Bienvenido
            </h1>
            <p className='text-gray-600'>
              Accede a la plataforma de congresos médicos
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <Label htmlFor='id' className='text-gray-700 font-medium'>
                DNI/PASAPORTE/NIE
              </Label>
              <Input
                type='text'
                id='id'
                name='id'
                placeholder='Introduce tu identificador'
                required
                value={formData.id}
                onChange={handleChange}
                className='mt-1 focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <div>
              <Label htmlFor='password' className='text-gray-700 font-medium'>
                Contraseña
              </Label>
              <Input
                type='password'
                id='password'
                name='password'
                required
                value={formData.password}
                onChange={handleChange}
                className='mt-1 focus:ring-2 focus:ring-blue-500'
              />
            </div>

            <Button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-700 transition-colors'>
              Acceder
            </Button>

            {message && (
              <p className='mt-4 text-center text-red-600'>{message}</p>
            )}
          </form>

          <div className='mt-6 text-center space-y-3'>
            <Link
              href='/reset-password'
              className='text-sm text-blue-600 hover:text-blue-700 hover:underline'>
              Recuperar contraseña
            </Link>

            <p className='text-sm text-gray-600'>
              ¿Nuevo en la plataforma?{" "}
              <Link
                href='/register'
                className='text-blue-600 hover:text-blue-700 hover:underline'>
                Crear cuenta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
