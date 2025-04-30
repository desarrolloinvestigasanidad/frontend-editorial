import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Home,
  User,
  FileBadge,
  FileText,
  Library,
  Plus,
  LogOut,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Dos estados independientes
  const [hasBookPayments, setHasBookPayments] = useState(false);
  const [hasChapterPurchases, setHasChapterPurchases] = useState(false);

  // Lista base de menú
  const menuItems = [
    { title: "Inicio", icon: Home, href: "/dashboard" },
    { title: "Participar en Edición", icon: BookOpen, href: "/editions" },
    { title: "Crear Libro", icon: Plus, href: "/create-book" },
    { title: "Mi Perfil", icon: User, href: "/profile" },
    { title: "Certificados", icon: FileBadge, href: "/certificates" },
    {
      title: "Mis Libros Personalizados",
      icon: BookOpen,
      href: "/publications",
    },
    { title: "Mis Capítulos", icon: FileText, href: "/publications/chapters" },
    { title: "Biblioteca", icon: Library, href: "/library" },
  ];

  // Filtrado según cada estado
  const filteredMenuItems = menuItems.filter((item) => {
    if (item.href === "/publications" && !hasBookPayments) return false;
    if (item.href === "/publications/chapters" && !hasChapterPurchases)
      return false;
    return true;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let payload: any;
    try {
      payload = JSON.parse(atob(token.split(".")[1]));
    } catch {
      return;
    }
    const userId = payload.sub || payload.id;
    const base = process.env.NEXT_PUBLIC_BASE_URL;

    // 1) Pagos generales (libros personalizados)
    fetch(`${base}/payments`)
      .then((res) => res.json())
      .then((data) => {
        const payments = Array.isArray(data.payments) ? data.payments : data;
        setHasBookPayments(
          (payments as { userId: string }[]).some((p) => p.userId === userId)
        );
      })
      .catch(() => setHasBookPayments(false));

    // 2) Compras de capítulos
    fetch(`${base}/chapter_purchases?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        const purchases = Array.isArray(data.chapter_purchases)
          ? data.chapter_purchases
          : data;
        setHasChapterPurchases(
          (purchases as { chapterCount: number }[]).some(
            (p) => p.chapterCount > 0
          )
        );
      })
      .catch(() => setHasChapterPurchases(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Sidebar collapsible='icon' className='border-r border-border'>
      <SidebarHeader className='border-b border-border'>
        <div className='flex items-center justify-center px-4 py-4'>
          <Link href='/dashboard' className='flex items-center justify-center'>
            {/* Logo principal (visible en sidebar abierto) */}
            <Image
              src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INVESTIGA%20SANIDAD%20SIN%20FONDO-BLQnlRYtFpCHZb4z2Xwzh7LiZbpq1R.png'
              alt='Investiga Sanidad'
              width={360}
              height={100}
              className='h-50 w-auto group-data-[collapsible=icon]:hidden'
            />
            {/* Logo pequeño (sidebar colapsado) */}
            <div className='hidden group-data-[collapsible=icon]:block'>
              <Image
                src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/INVESTIGA%20SANIDAD%20SIN%20FONDO-BLQnlRYtFpCHZb4z2Xwzh7LiZbpq1R.png'
                alt='IS'
                width={40}
                height={40}
                className='h-8 w-auto'
              />
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className='px-2 py-4'>
        <SidebarMenu>
          {filteredMenuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
                size='lg'
                className={`h-14 text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                    : "hover:bg-purple-50 hover:text-purple-700"
                }`}>
                <Link href={item.href} className='flex items-center gap-3'>
                  <item.icon
                    className={`h-6 w-6 ${
                      pathname === item.href ? "text-purple-600" : ""
                    }`}
                  />
                  <span className='group-data-[collapsible=icon]:hidden'>
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className='mt-auto border-t border-border p-4'>
        <Button
          variant='ghost'
          className='w-full justify-start text-base font-medium h-14 text-red-600 hover:text-red-700 hover:bg-red-50'
          onClick={handleLogout}>
          <LogOut className='mr-3 h-6 w-6' />
          <span className='group-data-[collapsible=icon]:hidden'>
            Cerrar sesión
          </span>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
