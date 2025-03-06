import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gestión del Libro - Investiga Sanidad",
  description: "Panel de gestión para tu libro",
}

export default function LibroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

