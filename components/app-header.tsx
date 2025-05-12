"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Search, Settings } from "lucide-react";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className='flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      {/* Botón de sidebar para móvil y escritorio */}
      <SidebarTrigger className='h-10 w-10' />

      {/* Búsqueda (oculta en mobile) */}
      <div className='flex-1 md:flex max-w-md hidden'>
        <form className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-2.5 h-5 w-5 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Buscar...'
              className='pl-9 bg-muted/50 text-base'
            />
          </div>
        </form>
      </div>
    </header>
  );
}
