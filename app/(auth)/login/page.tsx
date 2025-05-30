"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn, ArrowRight, Loader2 } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const { refreshUser } = useUser();
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [formData, setFormData] = useState({
    id: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/dashboard");
    } else {
      setIsVerifying(false);
    }
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (message) setMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    localStorage.removeItem("token");

    try {
      const res: Response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: formData.id,
            password: formData.password,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        await refreshUser();
        window.location.href = "/dashboard";
      } else {
        setMessage(
          data.message || "Error al iniciar sesión. Verifica tus credenciales."
        );
      }
    } catch (error) {
      console.error("Error en la petición de login:", error);
      setMessage(
        "Se produjo un error de red o en el servidor. Inténtalo de nuevo más tarde."
      );
    } finally {
      if (
        typeof window !== "undefined" &&
        window.location.pathname.includes("/login")
      ) {
        setIsLoading(false);
      }
    }
  };

  if (isVerifying) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50'>
        <div className='w-16 h-16 border-4 border-t-purple-600 border-b-purple-600/30 border-l-purple-400 border-r-purple-400/30 rounded-full animate-spin'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-purple-50'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row'>
        {/* Columna izquierda: Imagen y overlay - Reestructurada con Flexbox */}
        <div className='relative md:w-1/2 min-h-[350px] md:min-h-0 bg-gradient-to-br from-purple-900 to-purple-700 flex flex-col items-center justify-center p-6 md:p-8 text-center overflow-hidden'>
          {/* Overlay absoluto para el fondo */}
          <div className='absolute inset-0 bg-gradient-to-br from-purple-900/80 to-purple-700/80 z-0'></div>

          {/* Contenido (Logo y Texto) con z-index por encima del overlay */}
          <div className='relative z-10 flex flex-col items-center justify-center'>
            {" "}
            {/* Contenedor para el contenido flex */}
            <Image
              src='/is_white_bg.jpg' // Asegúrate que esta ruta es correcta (desde la carpeta public)
              alt='Investiga Sanidad Logo'
              width={200} // Ancho base, se ajustará con clases si es necesario
              height={50} // Alto base, para mantener aspect ratio
              priority
              className='w-36 sm:w-40 md:w-44 h-auto mb-6 md:mb-8' // Tamaño responsivo y margen inferior
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }} // Animación desde abajo
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }} // Delay ligeramente ajustado
            >
              <h2 className='text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 md:mb-4'>
                Bienvenido a Investiga Sanidad
              </h2>
              <p className='text-white/80 mb-6 md:mb-8 text-sm sm:text-base max-w-xs sm:max-w-sm mx-auto'>
                Accede a nuestra plataforma para gestionar tus publicaciones
                científicas y participar en nuestras ediciones.
              </p>
              <div className='inline-flex items-center space-x-3 text-white/70 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-md'>
                <LogIn className='w-5 h-5' />
                <span className='text-xs sm:text-sm font-medium'>
                  Portal de acceso seguro
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Columna derecha con formulario */}
        <div className='md:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='text-center mb-6 md:mb-8'>
            <h1 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-600 mb-2'>
              Iniciar Sesión
            </h1>
            <p className='text-gray-600 text-sm md:text-base'>
              Usa tu identificador para acceder a la plataforma.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onSubmit={handleSubmit}
            className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='id' className='text-gray-700 font-medium'>
                DNI/NIE/Pasaporte
              </Label>
              <div className='relative group'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg opacity-0 group-focus-within:opacity-70 blur transition duration-300 animate-pulse-slow'></div>
                <div className='relative'>
                  <Input
                    type='text'
                    id='id'
                    name='id'
                    placeholder='Introduce tu identificador'
                    required
                    autoComplete='username'
                    value={formData.id}
                    onChange={handleChange}
                    className='bg-white border-gray-300 focus:border-purple-500 transition-all shadow-sm focus:ring-1 focus:ring-purple-500 py-3 px-4'
                  />
                </div>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password' className='text-gray-700 font-medium'>
                Contraseña
              </Label>
              <div className='relative group'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg opacity-0 group-focus-within:opacity-70 blur transition duration-300 animate-pulse-slow'></div>
                <div className='relative'>
                  <Input
                    type={showPassword ? "text" : "password"}
                    id='password'
                    name='password'
                    placeholder='Tu contraseña'
                    required
                    autoComplete='current-password'
                    value={formData.password}
                    onChange={handleChange}
                    className='bg-white border-gray-300 focus:border-purple-500 transition-all shadow-sm focus:ring-1 focus:ring-purple-500 py-3 px-4 pr-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-600 p-1 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-md'
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }>
                    {showPassword ? (
                      <EyeOff className='w-5 h-5' />
                    ) : (
                      <Eye className='w-5 h-5' />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type='submit'
              disabled={isLoading}
              className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/30 group py-3 text-base font-semibold'>
              <span className='flex items-center justify-center'>
                {isLoading ? (
                  <>
                    <Loader2 className='animate-spin -ml-1 mr-3 h-5 w-5 text-white' />
                    Accediendo...
                  </>
                ) : (
                  "Acceder"
                )}
                {!isLoading && (
                  <ArrowRight className='ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1' />
                )}
              </span>
            </Button>

            {message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-4 text-center p-3 rounded-md text-sm ${
                  message.includes("Error") ||
                  message.includes("Verifica") ||
                  message.includes("error")
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200" // Para otros tipos de mensajes si los hubiera
                }`}>
                {message}
              </motion.p>
            )}
          </motion.form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className='mt-8 space-y-4'>
            <div className='text-center'>
              <Link
                href='/reset-password'
                className='text-sm text-purple-600 hover:text-purple-800 hover:underline transition-colors font-medium'>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-3 bg-white text-gray-500'>O</span>
              </div>
            </div>

            <p className='text-sm text-center text-gray-600'>
              ¿Nuevo en la plataforma?{" "}
              <Link
                href='/register'
                className='text-purple-600 hover:text-purple-800 font-semibold hover:underline transition-colors'>
                Crear una cuenta
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
