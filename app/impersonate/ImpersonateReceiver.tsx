// app/impersonate/ImpersonateReceiver.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ImpersonateReceiver({ token }: { token?: string }) {
  const router = useRouter();

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [token, router]);

  return <p>Cargando…</p>;
}
