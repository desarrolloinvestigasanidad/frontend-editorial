import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Capitulos() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Mis Capítulos</h2>
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
            {/* Add more cards for other accepted chapters */}
          </div>
        </TabsContent>
        <TabsContent value="pendientes">{/* Similar structure for pending chapters */}</TabsContent>
        <TabsContent value="rechazados">{/* Similar structure for rejected chapters */}</TabsContent>
      </Tabs>
    </div>
  )
}

