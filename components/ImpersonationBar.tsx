"use client";

import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

/** Decodificamos sólo los campos que nos interesan */
type Payload = {
  sub: string;
  impersonating?: boolean;
  act?: { sub: string };
};

export default function ImpersonationBar() {
  if (typeof window === "undefined") return null; // SSR-safe

  const router = useRouter();
  const token = localStorage.getItem("token"); // (o sessionStorage)
  if (!token) return null;

  let payload: Payload;
  try {
    payload = jwtDecode<Payload>(token);
  } catch {
    return null; // token corrupto
  }

  if (!payload.impersonating) return null; // sesión normal

  /** Vuelve al dominio del back-office y restaura la sesión admin */
  const stopImpersonating = () => {
    window.location.href =
      process.env.NEXT_PUBLIC_BACKOFFICE_RESTORE_URL ||
      "https://main.d3p0j4ctv6f9rz.amplifyapp.com/restore";
  };

  return (
    <div
      className='fixed top-0 inset-x-0 z-50 bg-yellow-400 text-black
                    flex items-center justify-center gap-3 py-1 text-sm shadow'>
      👤 Actuando como&nbsp;<strong>{payload.sub}</strong>
      <Button size='sm' variant='outline' onClick={stopImpersonating}>
        Salir
      </Button>
    </div>
  );
}
