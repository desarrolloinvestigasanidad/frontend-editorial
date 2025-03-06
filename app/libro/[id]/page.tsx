import Link from "next/link"
import { ChevronLeft, BookOpen, Wallet, BookCopy, FileText, Library } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function LibroPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/perfil" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
          <ChevronLeft className="h-5 w-5 mr-1" />
          Volver
        </Link>
        <div className="bg-gray-800 text-white p-6 rounded-lg">
          <h1 className="text-xl md:text-2xl font-semibold">
            Auxiliar Administrativo de Centros Hospitalarios: Optimización de Recursos y Gestión Eficaz
          </h1>
        </div>
      </div>

      {/* Grid de opciones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Edición, fecha y normativa */}
        <Link href={`/libro/1/edicion`}>
          <Card className="bg-blue-100 hover:bg-blue-200 transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <BookOpen className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="font-medium">Edición, fecha y normativa</h3>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Pago */}
        <Link href={`/libro/1/pago`}>
          <Card className="bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Wallet className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="font-medium">Pago</h3>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Coordinar libro */}
        <Link href={`/libro/1/coordinar`}>
          <Card className="bg-blue-100 hover:bg-blue-200 transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <BookCopy className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="font-medium">Coordinar libro</h3>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Envío de capítulo */}
        <Link href={`/libro/1/enviar-capitulo`}>
          <Card className="bg-blue-100 hover:bg-blue-200 transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <FileText className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="font-medium">Envío de capítulo</h3>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Mis capítulos */}
        <Link href={`/libro/1/capitulos`}>
          <Card className="bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer h-full">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Library className="h-12 w-12 mb-4 text-blue-600" />
                <h3 className="font-medium">Mis capítulos</h3>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}

