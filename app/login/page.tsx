"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Maneja el onChange de los campos de texto
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Maneja el submit del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res: Response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: formData.id,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Guardar token y redirigir
        localStorage.setItem("token", data.token);
        window.location.href = "/profile";
      } else {
        setMessage(data.message || "Error al iniciar sesión.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al iniciar sesión.");
    }
  };

  return (
    <div className='container mx-auto px-4 py-8 max-w-md'>
      <h1 className='text-3xl font-bold text-center mb-8'>Iniciar Sesión</h1>

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <Label htmlFor='id'>DNI/PASAPORTE/NIE</Label>
          <Input
            type='text'
            id='id'
            name='id'
            placeholder='Introduce tu identificador'
            required
            value={formData.id}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor='password'>Contraseña</Label>
          <Input
            type='password'
            id='password'
            name='password'
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <Button type='submit' className='w-full'>
          Iniciar Sesión
        </Button>

        {message && <p className='mt-2 text-center text-red-500'>{message}</p>}
      </form>

      <div className='mt-4 text-center'>
        <Link href='/reset-password' className='text-primary hover:underline'>
          He olvidado mi contraseña
        </Link>
      </div>

      <p className='mt-4 text-center'>
        ¿No tienes una cuenta?{" "}
        <Link href='/register' className='text-primary hover:underline'>
          Regístrate
        </Link>
      </p>
    </div>
  );
}
