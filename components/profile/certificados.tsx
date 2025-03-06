import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Certificados() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Certificados Oficiales</h2>
      <Tabs defaultValue="capitulos">
        <TabsList>
          <TabsTrigger value="capitulos">Capítulos de libro de edición</TabsTrigger>
          <TabsTrigger value="libros">Crea tu propio libro</TabsTrigger>
        </TabsList>
        <TabsContent value="capitulos">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Certificado de Autoría</CardTitle>
                <CardDescription>Capítulo en libro de edición</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Título del capítulo: Avances en Cardiología</p>
                <p>Libro: Medicina Interna 2025</p>
              </CardContent>
              <CardFooter>
                <Button>Descargar Certificado</Button>
              </CardFooter>
            </Card>
            {/* Add more cards for other certificates */}
          </div>
        </TabsContent>
        <TabsContent value="libros">{/* Similar structure for "crea tu propio libro" certificates */}</TabsContent>
      </Tabs>
    </div>
  )
}

