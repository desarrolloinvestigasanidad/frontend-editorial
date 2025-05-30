"use client";

import type { ReactNode } from "react";
import AuthGuard from "@/components/AuthGuard";
import { AppSidebar } from "@/components/app-sidebar";
import { AppHeader } from "@/components/app-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <AppHeader />
          <main className='flex-1 p-4 md:p-6 overflow-auto'>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
