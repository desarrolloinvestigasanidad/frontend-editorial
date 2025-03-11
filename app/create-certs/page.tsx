"use client";

import React, { useState } from "react";
import { pdf, PDFViewer } from "@react-pdf/renderer"; // pdf() para generar Blob
import { CertificadoPDF, CertificadoData } from "@/components/CertificadoPDF";
import { EditorCertContent } from "@/components/EditorCertContent";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const initialData: CertificadoData = {
  encabezado: { titulo: "Certificado Personalizado", imagenHeader: "" },
  autores: [{ nombre: "Juan Pérez", dni: "12345678Z" }],
  capitulo: {
    numero: 1,
    titulo: "Título del capítulo",
    urlValidacion: "https://libros.cienciasanitaria.es/validar",
  },
  footer: {
    lugar: "Madrid",
    fecha: "12 de junio de 2025",
    imagenFirma: "",
    imagenSello: "",
    imagenFooter: "",
  },
};

export default function CreateCertsPage() {
  const [certData, setCertData] = useState<CertificadoData>(initialData);
  const [editorText, setEditorText] = useState(""); // Texto "plano" proveniente del Editor.js
  const [qrReady, setQrReady] = useState(false);

  // Subir imágenes
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "imagenHeader" | "imagenFirma" | "imagenSello" | "imagenFooter"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setCertData((prev) => ({
        ...prev,
        [field === "imagenHeader" ? "encabezado" : "footer"]: {
          ...prev[field === "imagenHeader" ? "encabezado" : "footer"],
          [field]: base64,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  // Generar QR (botón "Generar QR")
  const handleGenerateQR = async () => {
    try {
      const qrBase64 = await QRCode.toDataURL(certData.capitulo.urlValidacion);
      setCertData((prev) => ({
        ...prev,
        capitulo: { ...prev.capitulo, qrBase64 },
      }));
      alert("QR generado con éxito.");
      setQrReady(true);
    } catch (error) {
      alert("Error generando el QR");
    }
  };

  // Botón "Actualizar vista previa"
  const handleUpdatePreview = () => {
    // Insertamos editorText en certData
    setCertData((prev) => ({
      ...prev,
      capitulo: { ...prev.capitulo, contenidoHtml: editorText },
    }));
  };

  // Generación masiva => produce un .zip con varios PDFs
  const handleMassGenerationZip = async () => {
    // Supongamos que tienes un array de datos (ejemplo)
    const dataList: CertificadoData[] = [
      {
        ...certData,
        autores: [{ nombre: "Carlos G", dni: "9999999Z" }],
        capitulo: { ...certData.capitulo, titulo: "Capítulo para Carlos" },
      },
      {
        ...certData,
        autores: [{ nombre: "María L", dni: "88888888Y" }],
        capitulo: { ...certData.capitulo, titulo: "Capítulo para María" },
      },
    ];

    const zip = new JSZip();

    // Generamos un PDF por cada item y lo agregamos al zip
    for (let i = 0; i < dataList.length; i++) {
      const doc = <CertificadoPDF data={dataList[i]} />;
      // Generar blob con react-pdf
      const blob = await pdf(doc).toBlob();
      // Nombre del archivo
      const fileName = `certificado_${i + 1}.pdf`;
      // Agregarlo al zip
      zip.file(fileName, blob);
    }

    // Generar zip final
    const content = await zip.generateAsync({ type: "blob" });
    // Descargar
    saveAs(content, "certificados.zip");
  };

  return (
    <div className='h-screen grid grid-cols-2'>
      {/* Columna Izquierda: Formulario */}
      <div className='p-4 bg-gray-50 overflow-auto'>
        <h1 className='text-2xl font-bold mb-4'>Crear Certificados (Admin)</h1>

        {/* Subida de imágenes con labels descriptivos */}
        <div className='bg-white rounded shadow p-4 mb-4 space-y-4'>
          <div>
            <label className='block font-semibold mb-1 text-blue-700'>
              Imagen de Encabezado (parte superior)
            </label>
            <input
              type='file'
              accept='image/*'
              className='border p-2 w-full rounded'
              onChange={(e) => handleImageUpload(e, "imagenHeader")}
            />
          </div>
          <div>
            <label className='block font-semibold mb-1 text-blue-700'>
              Firma Manuscrita (parte inferior)
            </label>
            <input
              type='file'
              accept='image/*'
              className='border p-2 w-full rounded'
              onChange={(e) => handleImageUpload(e, "imagenFirma")}
            />
          </div>
          <div>
            <label className='block font-semibold mb-1 text-blue-700'>
              Sello Oficial (parte inferior)
            </label>
            <input
              type='file'
              accept='image/*'
              className='border p-2 w-full rounded'
              onChange={(e) => handleImageUpload(e, "imagenSello")}
            />
          </div>
          <div>
            <label className='block font-semibold mb-1 text-blue-700'>
              Imagen Pie de Página
            </label>
            <input
              type='file'
              accept='image/*'
              className='border p-2 w-full rounded'
              onChange={(e) => handleImageUpload(e, "imagenFooter")}
            />
          </div>
        </div>

        {/* Editor.js para contenido */}
        <div className='bg-white p-4 rounded mb-4 shadow'>
          <p className='font-semibold mb-2 text-blue-700'>
            Contenido principal
          </p>
          <EditorCertContent
            onChange={(plainText) => setEditorText(plainText)}
          />
          <Button className='mt-3' onClick={handleUpdatePreview}>
            Actualizar vista previa
          </Button>
        </div>

        {/* Input para URL de validación + QR */}
        <div className='bg-white p-4 rounded mb-4 shadow'>
          <label className='block text-sm font-semibold mb-1'>
            URL de Validación (QR)
          </label>
          <input
            type='text'
            className='border p-2 w-full rounded mb-2'
            value={certData.capitulo.urlValidacion}
            onChange={(e) =>
              setCertData((prev) => ({
                ...prev,
                capitulo: {
                  ...prev.capitulo,
                  urlValidacion: e.target.value,
                },
              }))
            }
          />

          <Button onClick={handleGenerateQR}>Generar QR</Button>
        </div>

        {/* Si ya generamos el QR, podemos descargar el PDF */}
        {qrReady && (
          <div className='mb-4'>
            <Button
              onClick={() => handleUpdatePreview()}
              className='mr-2'
              variant='outline'>
              Actualizar vista previa
            </Button>
          </div>
        )}

        {/* Botón de Generar ZIP masivo */}
        <div className='mt-6'>
          <Button onClick={handleMassGenerationZip} variant='destructive'>
            Generar en masa (ZIP)
          </Button>
        </div>
      </div>

      {/* Columna Derecha: Vista Previa PDF */}
      <div className='p-4 flex flex-col items-center justify-center bg-white overflow-auto'>
        <PDFViewer style={{ width: "100%", height: "100%" }}>
          <CertificadoPDF data={certData} />
        </PDFViewer>
      </div>
    </div>
  );
}
