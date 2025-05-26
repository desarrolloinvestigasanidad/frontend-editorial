// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { User } from "lucide-react";
import ImpersonationBar from "@/components/ImpersonationBar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Investiga Sanidad - Editorial Científica",
  description:
    "Publica tus trabajos científicos con Investiga Sanidad, una editorial científica en la que podrás publicar un libro completo o un capítulo de libro en diferentes ediciones.",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es'>
      <body className={inter.className}>
        <div className='flex flex-col min-h-screen'>
          <main className='flex-grow'>
            <UserProvider>
              <ImpersonationBar />
              <Toaster />
              {children}
            </UserProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
