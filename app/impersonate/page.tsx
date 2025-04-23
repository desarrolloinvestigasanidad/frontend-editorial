"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function ImpersonateReceiver() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token); // ya queda en este dominio
      router.replace("/dashboard"); // home del cliente
    } else {
      router.replace("/login");
    }
  }, [params, router]);

  return <p>Cargando…</p>;
}
