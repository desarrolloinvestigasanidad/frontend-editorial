"use client";

import { useEffect, useState } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Eye, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type CertType = "CAPITULO" | "LIBRO";

interface Certificate {
  id: number;
  title: string;
  type: CertType;
  date: string;
  editionOrBook: string;
  pdfUrl: string;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [activeTab, setActiveTab] = useState<"capitulos" | "libros">(
    "capitulos"
  );
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Aquí harías tu fetch real a la API
    // GET /api/certificates (o /api/certificates/user/:userId)
    // setCertificates(data);

    // DEMO:
    setCertificates([
      {
        id: 1,
        title: "Certificado de Autoría de Capítulo",
        type: "CAPITULO",
        date: "2024-05-29",
        editionOrBook: "Edición XXVIII Libros Electrónicos",
        pdfUrl: "#",
      },
      {
        id: 2,
        title: "Certificado de Coautoría en Edición",
        type: "CAPITULO",
        date: "2024-06-10",
        editionOrBook: "Edición XXIX Salud Pública",
        pdfUrl: "#",
      },
      {
        id: 3,
        title: "Certificado de Libro Propio",
        type: "LIBRO",
        date: "2024-07-01",
        editionOrBook: "Libro Propio: Emergencias 2024",
        pdfUrl: "#",
      },
    ]);
  }, []);

  // Filtra según el type y el término de búsqueda
  const filteredCerts = certificates.filter(
    (cert) =>
      (activeTab === "capitulos"
        ? cert.type === "CAPITULO"
        : cert.type === "LIBRO") &&
      (cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.editionOrBook.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Acciones
  const handleView = (certId: number) => {
    // Podrías abrir un modal de previsualización o redirigir a /certificates/[id]/preview
    alert(`Ver (previsualizar) Certificado ID: ${certId} (demo)`);
  };

  const handleDownload = (certId: number) => {
    const cert = certificates.find((c) => c.id === certId);
    if (!cert) return;
    // O bien window.open(cert.pdfUrl, "_blank");
    alert(`Descargar PDF del certificado ID: ${certId} (demo).`);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Breadcrumb />
      </div>

      <Card>
        <CardHeader className='flex flex-row items-center justify-between pb-2'>
          <CardTitle className='text-xl font-bold'>Mis Certificados</CardTitle>
          <FileText className='h-5 w-5 text-purple-600' />
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "capitulos" | "libros")}
            className='w-full md:w-auto'>
            <TabsList>
              <TabsTrigger value='capitulos'>Capítulos</TabsTrigger>
              <TabsTrigger value='libros'>Libros</TabsTrigger>
            </TabsList>

            <TabsContent value='capitulos' className='mt-0'>
              <CertificateTable
                certificates={filteredCerts}
                onView={handleView}
                onDownload={handleDownload}
              />
            </TabsContent>

            <TabsContent value='libros' className='mt-0'>
              <CertificateTable
                certificates={filteredCerts}
                onView={handleView}
                onDownload={handleDownload}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Tabla de certificados con columna de acciones (ver, descargar).
 */
function CertificateTable({
  certificates,
  onView,
  onDownload,
}: {
  certificates: Certificate[];
  onView: (id: number) => void;
  onDownload: (id: number) => void;
}) {
  if (certificates.length === 0) {
    return (
      <div className='p-8 text-center bg-muted/30 rounded-md'>
        <FileText className='h-8 w-8 mx-auto text-muted-foreground mb-2' />
        <p className='text-muted-foreground'>
          No hay certificados en esta categoría.
        </p>
      </div>
    );
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>
        <thead>
          <tr className='border-b'>
            <th className='text-left py-3 px-2 font-medium'>Título</th>
            <th className='text-left py-3 px-2 font-medium'>Edición/Libro</th>
            <th className='text-left py-3 px-2 font-medium'>Fecha Emisión</th>
            <th className='text-right py-3 px-2 font-medium'>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert) => (
            <tr key={cert.id} className='border-b hover:bg-muted/30'>
              <td className='py-3 px-2'>{cert.title}</td>
              <td className='py-3 px-2'>{cert.editionOrBook}</td>
              <td className='py-3 px-2'>{cert.date}</td>
              <td className='py-3 px-2 text-right'>
                {/* Ver / previsualizar */}
                <Button
                  variant='ghost'
                  size='sm'
                  className='mr-1 text-purple-700 hover:text-purple-900 hover:bg-purple-50'
                  onClick={() => onView(cert.id)}>
                  <Eye className='h-4 w-4 mr-1' />
                  Ver
                </Button>
                {/* Descargar */}
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-purple-700 hover:text-purple-900 hover:bg-purple-50'
                  onClick={() => onDownload(cert.id)}>
                  <Download className='h-4 w-4 mr-1' />
                  Descargar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
