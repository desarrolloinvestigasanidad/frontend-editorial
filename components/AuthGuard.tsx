"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, refreshUser } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsVerifying(true);
      await refreshUser();
      setIsVerifying(false);
    };

    checkAuth();
  }, [pathname]);

  useEffect(() => {
    if (!isVerifying && !user) {
      router.replace("/login");
    }
  }, [isVerifying, user, router]);

  if (isVerifying) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-100 text-center px-4'>
        {/* Logo con animación suave */}
        <img
          src='/is_white_bg.jpg'
          alt='Logo Investiga Sanidad'
          className='w-32 h-auto mb-6 animate-pulse drop-shadow-md'
        />

        {/* Mensaje principal */}
        <h2 className='text-xl sm:text-2xl font-semibold text-purple-700 mb-2 animate-fade-in'>
          Comprobando acceso seguro...
        </h2>

        {/* Spinner personalizado */}
        <div className='w-12 h-12 border-4 border-purple-300 border-t-purple-700 rounded-full animate-spin mb-4'></div>

        {/* Mensaje secundario opcional */}
        <p className='text-sm text-gray-600 max-w-xs animate-fade-in animation-delay-2000'>
          Por favor, espera unos segundos mientras verificamos tu sesión.
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
