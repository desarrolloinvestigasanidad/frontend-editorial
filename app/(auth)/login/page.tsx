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
  const [formData, setFormData] = useState({ id: "", password: "" });
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        await refreshUser();
        window.location.href = "/dashboard";
      } else {
        setMessage(data.message || "Error al iniciar sesión.");
      }
    } catch {
      setMessage("Error de red o servidor. Inténtalo más tarde.");
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
      <div className='relative min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7ad00] via-white to-[#52338a] overflow-hidden'>
        <div className='w-16 h-16 border-4 border-t-[#f7ad00] border-b-[#f7ad00]/30 border-l-[#f7ad00]/60 border-r-[#f7ad00]/30 rounded-full animate-spin z-10' />
        <div className='absolute inset-0 overflow-hidden -z-10'>
          <div className='absolute w-[500px] h-[500px] bg-[#f7ad00]/20 rounded-full top-0 -left-32 blur-3xl animate-blob' />
          <div className='absolute w-[600px] h-[600px] bg-[#52338a]/20 rounded-full top-1/3 right-0 blur-2xl animate-blob animation-delay-2000' />
        </div>
      </div>
    );
  }

  return (
    <div className='relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#f7ad0040] via-white to-[#52338a40] overflow-hidden'>
      {/* background blobs */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute w-[400px] h-[400px] bg-[#f7ad00]/20 rounded-full top-10 -left-32 blur-3xl animate-blob' />
        <div className='absolute w-[500px] h-[500px] bg-[#52338a]/20 rounded-full top-1/3 right-0 blur-2xl animate-blob animation-delay-2000' />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white/90 backdrop-blur-xl w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row border border-white/30'>
        {/* Izquierda */}
        <div className='relative md:w-1/2 min-h-[350px] bg-[#f7ad00] flex flex-col items-center justify-center p-6 md:p-8 text-center'>
          <div className='absolute inset-0 bg-[#52338a]/90 z-0' />
          <div className='relative z-10 flex flex-col items-center justify-center'>
            <Image
              src='/is_white_bg.jpg'
              alt='Investiga Sanidad Logo'
              width={200}
              height={50}
              priority
              className='w-36 sm:w-40 md:w-44 h-auto mb-6'
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}>
              <h2 className='text-2xl md:text-3xl font-bold text-white mb-3'>
                Bienvenido a Investiga Sanidad
              </h2>
              <p className='text-white/80 mb-6 text-sm sm:text-base max-w-sm mx-auto'>
                Accede a nuestra plataforma para gestionar tus publicaciones
                científicas y participar en nuestras ediciones.
              </p>
              <div className='inline-flex items-center space-x-3 text-white/70 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg shadow-md'>
                <LogIn className='w-5 h-5' />
                <span className='text-sm font-medium'>
                  Portal de acceso seguro
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Derecha */}
        <div className='md:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='text-center mb-8'>
            <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#f7ad00] to-orange-400 mb-2'>
              Iniciar Sesión
            </h1>
            <p className='text-gray-600 text-sm md:text-base'>
              Usa tu identificador para acceder a la plataforma.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className='space-y-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}>
            <div className='space-y-2'>
              <Label htmlFor='id' className='text-gray-700 font-medium'>
                DNI/NIE/Pasaporte
              </Label>
              <div className='relative group'>
                <Input
                  type='text'
                  id='id'
                  name='id'
                  placeholder='Introduce tu identificador'
                  required
                  autoComplete='username'
                  value={formData.id}
                  onChange={handleChange}
                  className='bg-white border-gray-300 focus:border-[#f7ad00] transition-all shadow-sm py-3 px-4'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='password' className='text-gray-700 font-medium'>
                Contraseña
              </Label>
              <div className='relative group'>
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
                    className='bg-white border-gray-300 focus:border-[#f7ad00] transition-all shadow-sm focus:ring-1 focus:ring-[#f7ad00] py-3 px-4 pr-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#f7ad00] p-1 focus:outline-none focus:ring-2 focus:ring-[#f7ad00] rounded-md'
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
              className='w-full bg-gradient-to-r from-[#f7ad00] to-orange-400 hover:from-[#ffa600] hover:to-orange-500 transition-all duration-300 hover:shadow-xl hover:shadow-orange-400/30 group py-3 text-base font-semibold text-white'>
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
                  message.toLowerCase().includes("error")
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
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
                className='text-sm text-[#f7ad00] hover:text-orange-600 hover:underline transition-colors font-medium'>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className='relative my-6'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300' />
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-3 bg-white text-gray-500'>O</span>
              </div>
            </div>
            <p className='text-sm text-center text-gray-600'>
              ¿Nuevo en la plataforma?{" "}
              <Link
                href='/register'
                className='text-[#f7ad00] hover:text-orange-600 font-semibold hover:underline transition-colors'>
                Crear una cuenta
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
