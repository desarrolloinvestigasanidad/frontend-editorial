// frontend-editorial/components/app-header.tsx
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { LogOut, Search, BookOpen, FileText, LayoutGrid } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

type Suggestion = {
  id: string;
  type: "edition" | "book" | "chapter";
  title: string;
  subtitle?: string;
  editionId?: string | null;
  bookId?: string | null;
};

export function AppHeader() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";

  // Fetch suggestions
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (searchTerm.length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${base}/search?query=${encodeURIComponent(searchTerm)}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
      } catch {
        setSuggestions([]);
        setOpen(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchTerm, base]);

  // Mantener el foco en el input cuando cambian sugerencias o se abre/cierra
  useEffect(() => {
    inputRef.current?.focus();
  }, [suggestions, open]);

  function navigateTo(item: Suggestion) {
    if (item.type === "edition") {
      router.push(`/editions/${item.id}`);
    } else if (item.type === "book") {
      if (item.editionId) {
        router.push(`/editions/${item.editionId}/books/${item.id}`);
      } else {
        router.push(`/books/${item.id}`);
      }
    } else if (item.type === "chapter") {
      if (item.editionId && item.bookId) {
        router.push(
          `/editions/${item.editionId}/books/${item.bookId}/chapters/${item.id}`
        );
      } else if (item.bookId) {
        router.push(`/books/${item.bookId}/my-chapters/${item.id}`);
      }
    }
    setOpen(false);
    setSearchTerm("");
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className='flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <SidebarTrigger className='h-10 w-10' />

      <div className='flex-1 md:flex max-w-md hidden'>
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <div className='relative w-full'>
            <Search className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground' />
            <DropdownMenuTrigger asChild>
              <Input
                ref={inputRef}
                type='search'
                placeholder='Buscar ediciones, libros, capítulos…'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => suggestions.length > 0 && setOpen(true)}
                className='w-full pl-10 bg-muted/50 text-base'
              />
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent className='w-full max-w-md mt-1'>
            {suggestions.length === 0 ? (
              <DropdownMenuLabel>No hay resultados</DropdownMenuLabel>
            ) : (
              suggestions.map((item) => (
                <DropdownMenuItem
                  key={`${item.type}-${item.id}`}
                  onSelect={() => navigateTo(item)}
                  onMouseDown={(e) => e.preventDefault()}
                  className='flex items-center gap-2'>
                  {item.type === "edition" && (
                    <LayoutGrid className='h-4 w-4' />
                  )}
                  {item.type === "book" && <BookOpen className='h-4 w-4' />}
                  {item.type === "chapter" && <FileText className='h-4 w-4' />}

                  <div className='flex-1 truncate'>
                    {item.title}
                    {item.subtitle && (
                      <span className='ml-1 text-xs text-muted-foreground'>
                        – {item.subtitle}
                      </span>
                    )}
                  </div>

                  <Badge
                    variant='outline'
                    className='uppercase text-[10px] tracking-widest'>
                    {item.type === "edition"
                      ? "Edición"
                      : item.type === "book"
                      ? "Libro"
                      : "Capítulo"}
                  </Badge>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
