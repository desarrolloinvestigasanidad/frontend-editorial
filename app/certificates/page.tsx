"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Eye } from "lucide-react";

type CertType = "CAPITULO" | "LIBRO";

interface Certificate {
  id: number;
  title: string; // Título del certificado (ej. "Certificado de Autoría")
  type: CertType; // "CAPITULO" o "LIBRO"
  date: string; // Fecha de emisión, p. ej. "2024-10-05"
  editionOrBook: string; // Nombre de la edición o libro (ej. "Edición XXVIII" o "Mi Libro Propio")
  pdfUrl: string; // URL para descargar/mostrar el PDF
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  // Controlamos la tab activa: "capitulos" o "libros"
  const [activeTab, setActiveTab] = useState<"capitulos" | "libros">(
    "capitulos"
  );

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

  // Filtra según el type
  const chapterCerts = certificates.filter((c) => c.type === "CAPITULO");
  const bookCerts = certificates.filter((c) => c.type === "LIBRO");

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
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Mis Certificados</h1>

      {/* Tabs: "capitulos" y "libros" */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as "capitulos" | "libros")}>
        <TabsList className='mb-4 flex gap-4'>
          <TabsTrigger value='capitulos'>Capítulos</TabsTrigger>
          <TabsTrigger value='libros'>Libros</TabsTrigger>
        </TabsList>

        <TabsContent value='capitulos'>
          <CertificateTable
            certificates={chapterCerts}
            onView={handleView}
            onDownload={handleDownload}
          />
        </TabsContent>

        <TabsContent value='libros'>
          <CertificateTable
            certificates={bookCerts}
            onView={handleView}
            onDownload={handleDownload}
          />
        </TabsContent>
      </Tabs>
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
      <p className='text-gray-600'>No hay certificados en esta categoría.</p>
    );
  }

  return (
    <table className='w-full border text-sm mb-4'>
      <thead>
        <tr className='bg-gray-50'>
          <th className='p-2 border'>Título</th>
          <th className='p-2 border'>Edición/Libro</th>
          <th className='p-2 border'>Fecha Emisión</th>
          <th className='p-2 border text-right'>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {certificates.map((cert) => (
          <tr key={cert.id}>
            <td className='p-2 border'>{cert.title}</td>
            <td className='p-2 border'>{cert.editionOrBook}</td>
            <td className='p-2 border'>{cert.date}</td>
            <td className='p-2 border text-right'>
              {/* Ver / previsualizar */}
              <Button
                variant='outline'
                size='sm'
                className='mr-1'
                onClick={() => onView(cert.id)}>
                <Eye className='h-4 w-4 mr-1' />
                Ver
              </Button>
              {/* Descargar */}
              <Button
                variant='outline'
                size='sm'
                onClick={() => onDownload(cert.id)}>
                <Download className='h-4 w-4 mr-1' />
                Descargar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
