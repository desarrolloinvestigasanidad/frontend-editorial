// app/(protected)/layout.tsx
"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  // Si no hay window (SSR) o no hay token, redirige al login
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return null;
    }
  }

  // Si tenemos token, renderizamos la UI protegida
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className='flex-1 p-4 md:p-6 overflow-auto'>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
