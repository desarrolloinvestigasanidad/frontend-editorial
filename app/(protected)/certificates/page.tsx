"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/breadcrumb"; // Asumiendo que tienes este componente
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Download,
  Eye,
  FileText,
  Search,
  Award,
  Calendar,
  BookOpen,
  Filter,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext"; // <--- IMPORTAR useUser

// Tipo para el certificado tal como viene del backend
interface BackendCertificate {
  id: string; // Es un UUID en el backend
  userId: string;
  type: "chapter_author" | "book_author" | string; // Ajustar si hay más tipos
  content: string; // JSON string: {"bookId":"...", "chapterId":"...", "issueDate":"..."} o {"bookId":"...", "issueDate":"..."}
  status: string;
  createdAt: string; // Fecha de creación del certificado
  updatedAt: string;
  documentUrl: string;
  // bookTitle y chapterTitle podrían venir pre-calculados del backend o necesitaríamos cargarlos
  bookTitle?: string; // Título del libro asociado
  chapterTitle?: string; // Título del capítulo asociado (si aplica)
}

// Tipo para el certificado como lo usaremos en el frontend para mostrar
interface DisplayCertificate {
  id: string; // Usar el ID del backend
  title: string; // Será el título del capítulo o del libro
  type: "CAPITULO" | "LIBRO"; // Para las tabs
  date: string; // Fecha de emisión del certificado (del content o createdAt)
  editionOrBook: string; // Nombre del libro o edición al que pertenece
  pdfUrl: string; // URL directa al PDF
}

export default function CertificatesPage() {
  const { user } = useUser(); // <--- OBTENER USUARIO ACTUAL
  const [certificates, setCertificates] = useState<DisplayCertificate[]>([]);
  const [activeTab, setActiveTab] = useState<"capitulos" | "libros">(
    "capitulos"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false); // Si no hay usuario, no cargar nada
      return;
    }

    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token"); // O localStorage, según dónde lo guardes
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/certificates/user/${user.id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (!response.ok) {
          throw new Error("Error al cargar los certificados");
        }
        const backendCerts: BackendCertificate[] = await response.json();
        console.log(backendCerts);
        // Mapear los certificados del backend al formato de visualización
        // Esta parte es crucial y puede necesitar más lógica para obtener bookTitle/chapterTitle
        // si no vienen directamente con el certificado.
        // Por ahora, asumiremos que podrías tenerlos o usar placeholder.
        const displayCertsPromises = backendCerts.map(async (bc) => {
          let contentData: {
            bookId: string;
            chapterId?: string;
            issueDate: string;
          } = { bookId: "", issueDate: "" };
          try {
            contentData = JSON.parse(bc.content);
          } catch (e) {
            console.error("Error parsing certificate content:", bc.content, e);
          }

          let itemTitle = "Título no disponible";
          let bookOrEditionTitle = "Libro/Edición no disponible";

          // NECESITARÁS OBTENER LOS TÍTULOS DE LIBROS/CAPÍTULOS AQUÍ
          // Esto puede requerir llamadas adicionales a la API si bc no incluye bookTitle/chapterTitle
          // Ejemplo simplificado:
          if (bc.bookTitle) {
            bookOrEditionTitle = bc.bookTitle;
          } else {
            // Intenta obtener el bookTitle basado en contentData.bookId (requiere fetch)
            // const bookRes = await fetch(`/api/books/${contentData.bookId}`);
            // if (bookRes.ok) bookOrEditionTitle = (await bookRes.json()).title;
          }

          if (bc.type === "chapter_author") {
            itemTitle = bc.chapterTitle || `Capítulo de ${bookOrEditionTitle}`;
            if (bc.chapterTitle === undefined && contentData.chapterId) {
              // Intenta obtener el chapterTitle (requiere fetch)
              // const chapterRes = await fetch(`/api/chapters/${contentData.chapterId}`);
              // if (chapterRes.ok) itemTitle = (await chapterRes.json()).title;
            }
          } else if (bc.type === "book_author") {
            itemTitle = bookOrEditionTitle; // Para certificados de libro, el título principal es el del libro.
          }

          return {
            id: bc.id,
            title: itemTitle,
            type:
              bc.type === "chapter_author"
                ? "CAPITULO"
                : bc.type === "book_author"
                ? "LIBRO"
                : ("CAPITULO" as "CAPITULO" | "LIBRO"),
            date: contentData.issueDate || bc.createdAt, // Usar issueDate del content o createdAt
            editionOrBook: bookOrEditionTitle,
            pdfUrl: bc.documentUrl,
          };
        });

        const resolvedDisplayCerts = await Promise.all(displayCertsPromises);
        setCertificates(resolvedDisplayCerts);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setCertificates([]); // Limpiar en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]); // Depender del objeto user

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

  const filteredCerts = certificates.filter(
    (cert) =>
      (activeTab === "capitulos"
        ? cert.type === "CAPITULO"
        : cert.type === "LIBRO") &&
      (cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cert.editionOrBook.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleView = (pdfUrl: string) => {
    // Cambiado para aceptar URL directamente
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (pdfUrl: string) => {
    // Cambiado para aceptar URL directamente
    // Para una descarga "forzada", necesitarías configurar el backend con Content-Disposition: attachment
    // o usar un blob si el PDF está en el mismo origen (poco probable con S3).
    // La forma más simple es abrirlo en una nueva pestaña y el usuario usa las opciones del navegador.
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
    // toast.info("La descarga comenzará en breve o se abrirá en una nueva pestaña.");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return "Fecha inválida";
    }
  };

  // ... (variantes de animación y JSX de loading sin cambios) ...
  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        {" "}
        {/* Ajustado para ocupar más pantalla */}
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <FileText className='h-8 w-8 text-purple-500' />{" "}
            {/* Icono más grande */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8 min-h-screen'>
      {" "}
      {/* Asegurar altura mínima */}
      {/* Background con degradado y blobs */}
      <div className='absolute inset-0 z-0 pointer-events-none'>
        {" "}
        {/* Evitar que interfiera con clics */}
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50'></div>{" "}
        {/* Gradiente más suave */}
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
        <div className='absolute top-1/3 right-1/3 w-56 h-56 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>{" "}
        {/* Blob adicional */}
      </div>
      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          {/* Mejorar Breadcrumb */}
          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Mis Certificados
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h1 className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 mb-3'>
            {" "}
            {/* h1 para título principal */}
            Certificados de Autoría
          </h1>
          <div className='w-24 h-1.5 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mb-6'></div>{" "}
          {/* Subrayado más grueso */}
          <p className='text-gray-700 max-w-2xl mx-auto text-base'>
            {" "}
            {/* Texto mejorado */}
            Aquí puedes visualizar y descargar todos tus certificados de
            autoría, tanto de capítulos individuales como de libros completos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='backdrop-blur-sm bg-white/80 p-6 md:p-8 rounded-2xl shadow-xl border border-white/50'>
          {" "}
          {/* Estilo mejorado */}
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
            <div className='relative w-full md:flex-grow md:max-w-sm'>
              {" "}
              {/* Ajuste de ancho */}
              <Search className='absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
              <Input
                type='search'
                placeholder='Buscar por título, libro o edición...'
                className='pl-10 py-2.5 border-gray-300 focus:border-purple-500 focus:ring-purple-500 focus:ring-1 rounded-lg w-full' // Estilo mejorado
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='flex items-center gap-2 flex-shrink-0'>
              {" "}
              {/* Evitar que se encoja */}
              <Filter className='h-4 w-4 text-gray-500' />
              <span className='text-sm text-gray-600 mr-1'>Filtrar:</span>{" "}
              {/* Margen ajustado */}
              <Tabs
                value={activeTab}
                onValueChange={(val) =>
                  setActiveTab(val as "capitulos" | "libros")
                }
                className='w-auto'>
                {" "}
                {/* Ajuste de ancho */}
                <TabsList className='bg-purple-50/80 backdrop-blur-sm border border-purple-100 p-1 rounded-lg shadow-sm'>
                  {" "}
                  {/* Estilo mejorado */}
                  <TabsTrigger
                    value='capitulos'
                    className='data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-1.5 text-sm'>
                    {" "}
                    {/* Estilo mejorado */}
                    Capítulos
                  </TabsTrigger>
                  <TabsTrigger
                    value='libros'
                    className='data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-1.5 text-sm'>
                    {" "}
                    {/* Estilo mejorado */}
                    Libros
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          <Tabs value={activeTab} className='w-full'>
            <TabsContent
              value='capitulos'
              className='mt-0 rounded-lg overflow-hidden'>
              {" "}
              {/* Estilo añadido */}
              <CertificateList
                certificates={filteredCerts}
                handleView={handleView}
                onDownload={handleDownload}
                formatDate={formatDate}
                searchTerm={searchTerm}
                hoverStates={hoverStates}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
              />
            </TabsContent>

            <TabsContent
              value='libros'
              className='mt-0 rounded-lg overflow-hidden'>
              {" "}
              {/* Estilo añadido */}
              <CertificateList
                certificates={filteredCerts}
                handleView={handleView}
                onDownload={handleDownload}
                formatDate={formatDate}
                searchTerm={searchTerm}
                hoverStates={hoverStates}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
              />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Información adicional (sin cambios significativos, se mantiene tu diseño) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='backdrop-blur-sm bg-white/70 p-6 md:p-8 rounded-xl shadow-lg border border-purple-100/80'>
          <h3 className='text-xl font-bold text-gray-800 mb-6 flex items-center'>
            <Award className='h-5 w-5 text-purple-600 mr-2.5' />
            Información Adicional sobre Certificados
          </h3>
          <div className='grid md:grid-cols-3 gap-6'>
            {/* ... tus tres cards de información ... */}
            <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
              <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3'>
                <CheckCircle className='h-5 w-5 text-purple-700' />
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>
                Validez oficial
              </h4>
              <p className='text-sm text-gray-600'>
                Todos los certificados cuentan con validez oficial para
                concursos y oposiciones.
              </p>
            </div>

            <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
              <div className='w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-3'>
                <Download className='h-5 w-5 text-yellow-700' />
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>
                Descarga ilimitada
              </h4>
              <p className='text-sm text-gray-600'>
                Puedes descargar tus certificados tantas veces como necesites.
              </p>
            </div>

            <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
              <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3'>
                <AlertCircle className='h-5 w-5 text-green-700' />
              </div>
              <h4 className='font-semibold text-gray-900 mb-2'>Soporte</h4>
              <p className='text-sm text-gray-600'>
                Si necesitas ayuda con tus certificados, contacta con nuestro
                equipo de soporte.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function CertificateList({
  certificates,
  handleView, // Cambiado a recibir pdfUrl directamente
  onDownload, // Cambiado a recibir pdfUrl directamente
  formatDate,
  searchTerm,
  hoverStates, // Mantener si se usan para efectos visuales en el padre o aquí
  handleMouseEnter, // Mantener
  handleMouseLeave, // Mantener
}: {
  certificates: DisplayCertificate[];
  handleView: (pdfUrl: string) => void; // Ahora espera la URL
  onDownload: (pdfUrl: string) => void; // Ahora espera la URL
  formatDate: (date: string) => string;
  searchTerm: string;
  hoverStates: Record<string, boolean>;
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: (id: string) => void;
}) {
  const router = useRouter();

  const containerVariants = {
    /* ... sin cambios ... */
  };
  const itemVariants = {
    /* ... sin cambios ... */
  };

  if (certificates.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='backdrop-blur-sm bg-white/70 p-8 rounded-xl shadow-md border border-gray-100/80 text-center'>
        {" "}
        {/* Estilo mejorado */}
        <Award className='h-16 w-16 mx-auto text-purple-300 mb-5' />{" "}
        {/* Icono más grande y temático */}
        {searchTerm ? (
          <p className='text-gray-700 text-lg mb-2'>
            {" "}
            {/* Texto más grande */}
            No se encontraron certificados para "
            <strong className='text-purple-700'>{searchTerm}</strong>".
          </p>
        ) : (
          <>
            <p className='text-gray-700 text-lg mb-3'>
              {" "}
              {/* Texto más grande */}
              Aún no tienes certificados disponibles.
            </p>
            <p className='text-gray-500 text-sm mb-6'>
              Participa en nuestras ediciones o crea tu propio libro para
              obtenerlos.
            </p>
            <div className='flex justify-center gap-4 mt-4'>
              <Button
                variant='outline'
                className='border-purple-600 text-purple-700 hover:bg-purple-50' // Estilo mejorado
                onClick={() => router.push("/editions")}>
                {" "}
                {/* Ruta actualizada si es dashboard */}
                Ver Ediciones
              </Button>
              <Button
                className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white' // Estilo mejorado
                onClick={() => router.push("/create-book")}>
                {" "}
                {/* Ruta actualizada si es dashboard */}
                Crear Libro
              </Button>
            </div>
          </>
        )}
      </motion.div>
    );
  }

  function onView(pdfUrl: string): void {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='grid gap-6 md:grid-cols-1 lg:grid-cols-2'>
      {" "}
      {/* Ajustado para mejor visualización */}
      {certificates.map((cert) => (
        <motion.div
          key={cert.id}
          variants={itemVariants}
          whileHover={{
            y: -5,
            boxShadow: "0 8px 25px rgba(128, 90, 213, 0.15)",
          }} /* Sombra mejorada */
          className='group'>
          <div className='relative backdrop-blur-sm bg-white/90 p-5 rounded-xl shadow-lg border border-gray-200/70 transition-all duration-300 group-hover:shadow-2xl group-hover:border-purple-300 flex flex-col h-full'>
            {" "}
            {/* flex-col y h-full */}
            <div className='flex items-start gap-4 mb-3'>
              <div className='flex-shrink-0 bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors duration-300 transform group-hover:scale-105'>
                {cert.type === "CAPITULO" ? (
                  <FileText className='w-6 h-6 text-purple-700' />
                ) : (
                  <BookOpen className='w-6 h-6 text-purple-700' />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                {" "}
                {/* Para que el texto se ajuste */}
                <div className='flex items-center justify-between mb-1'>
                  <h3
                    className='text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors truncate'
                    title={cert.title}>
                    {cert.title}
                  </h3>
                  <Badge
                    className={`text-xs ml-2 shrink-0 ${
                      // shrink-0 para que no se encoja
                      cert.type === "CAPITULO"
                        ? "bg-purple-100 text-purple-800 border-purple-200"
                        : "bg-blue-100 text-blue-800 border-blue-200"
                    }`}
                    variant='outline'>
                    {cert.type === "CAPITULO" ? "Capítulo" : "Libro"}
                  </Badge>
                </div>
                <p
                  className='text-sm text-gray-500 truncate'
                  title={cert.editionOrBook}>
                  {cert.editionOrBook}
                </p>
              </div>
            </div>
            <div className='text-xs text-gray-500 mb-4 pl-1 flex items-center'>
              {" "}
              {/* Alineado con el título */}
              <Calendar className='h-3.5 w-3.5 mr-1.5 text-gray-400' />
              Emitido: {formatDate(cert.date)}
            </div>
            <div className='mt-auto pt-4 border-t border-gray-200/60 flex flex-col sm:flex-row justify-end gap-3'>
              {" "}
              <Button
                size='sm'
                className='w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700' // Estilo principal
                onClick={() => onDownload(cert.pdfUrl)}
                onMouseEnter={() => handleMouseEnter(`download-${cert.id}`)}
                onMouseLeave={() => handleMouseLeave(`download-${cert.id}`)}>
                <Download className='h-4 w-4 mr-2' />
                Descargar
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
