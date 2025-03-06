"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SearchBar } from "@/components/ui/search-bar"
import { useState } from "react"
import Link from "next/link"

export default function MisCapitulos() {
  const [searchTerm, setSearchTerm] = useState("")

  // Función para filtrar capítulos basados en el término de búsqueda
  const filteredChapters = [] // lógica de filtrado

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Mis Capítulos</h2>
        <Link href="/enviar-capitulo">
          <Button>Crear Nuevo Capítulo</Button>
        </Link>
      </div>
      <SearchBar placeholder="Buscar capítulos..." onSearch={setSearchTerm} />
      <Tabs defaultValue="aceptados">
        <TabsList>
          <TabsTrigger value="aceptados">Aceptados</TabsTrigger>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="rechazados">Rechazados</TabsTrigger>
        </TabsList>
        <TabsContent value="aceptados">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Capítulo 1</CardTitle>
                <CardDescription>Autor principal</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Título del libro: Avances en Medicina</p>
                <p>Edición: VIII</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Previsualizar</Button>
                <Button variant="outline">Ver/Agregar coautor</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="pendientes">{/* Contenido similar para capítulos pendientes */}</TabsContent>
        <TabsContent value="rechazados">{/* Contenido similar para capítulos rechazados */}</TabsContent>
      </Tabs>
    </div>
  )
}

