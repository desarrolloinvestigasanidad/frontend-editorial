"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState(
    "Verificando tu correo electrónico..."
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No se ha proporcionado un token de verificación.");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/verify-email?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Verification failed.");
        return res.json();
      })
      .then((data) => {
        if (data.message) {
          setStatus("success");
          setMessage(
            "Tu correo electrónico ha sido verificado correctamente. Serás redirigido al inicio de sesión."
          );
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "La verificación ha fallado.");
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus("error");
        setMessage("Ha ocurrido un error durante la verificación.");
      });
  }, [token, router]);

  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-purple-50'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='bg-white w-full max-w-md shadow-2xl rounded-2xl overflow-hidden p-8'>
        <div className='text-center'>
          <Image
            src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INVESTIGA%20SANIDAD%20SIN%20FONDO-BLQnlRYtFpCHZb4z2Xwzh7LiZbpq1R.png'
            alt='Investiga Sanidad'
            width={200}
            height={50}
            className='mx-auto mb-8'
          />

          {status === "loading" && (
            <div className='flex flex-col items-center justify-center'>
              <Loader2 className='w-16 h-16 text-purple-600 animate-spin mb-4' />
              <h2 className='text-xl font-semibold text-gray-800 mb-2'>
                Verificando
              </h2>
              <p className='text-gray-600'>{message}</p>
            </div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className='flex flex-col items-center'>
              <p className='text-gray-600 mb-6'>{message}</p>
              <p className='text-gray-500 text-sm mb-6'>
                Serás redirigido al inicio de sesión en unos segundos...
              </p>
              <Link href='/login'>
                <Button className='bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'>
                  Ir a iniciar sesión
                </Button>
              </Link>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className='flex flex-col items-center'>
              <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4'>
                <XCircle className='w-12 h-12 text-red-600' />
              </div>
              <h2 className='text-2xl font-bold text-gray-800 mb-2'>
                Error de verificación
              </h2>
              <p className='text-gray-600 mb-6'>{message}</p>
              <Link href='/login'>
                <Button className='bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'>
                  Volver a iniciar sesión
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50'>
          <div className='w-16 h-16 border-4 border-t-purple-500 border-b-purple-500/40 border-l-purple-300 border-r-purple-300/40 rounded-full animate-spin'></div>
        </div>
      }>
      <VerifyEmailContent />
    </Suspense>
  );
}
