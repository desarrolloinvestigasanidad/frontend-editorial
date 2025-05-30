"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// import { Breadcrumb } from "@/components/breadcrumb"; // Descomenta si lo usas
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
import { useUser } from "@/context/UserContext";

// Tipo para el certificado tal como viene del backend (actualizado)
interface BackendCertificate {
  id: string;
  userId: string;
  type: "chapter_author" | "book_author" | string;
  content: string; // JSON string
  status: string;
  createdAt: string;
  updatedAt: string;
  documentUrl: string;
  bookTitle?: string | null; // Ahora se espera que venga del backend
  chapterTitle?: string | null; // Ahora se espera que venga del backend
}

// Tipo para el certificado como lo usaremos en el frontend para mostrar
interface DisplayCertificate {
  id: string;
  title: string;
  type: "CAPITULO" | "LIBRO";
  date: string;
  editionOrBook: string;
  pdfUrl: string;
}

export default function CertificatesPage() {
  const { user } = useUser();
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
      setLoading(false);
      return;
    }

    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/certificates/user/${user.id}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (!response.ok) {
          throw new Error(
            `Error al cargar los certificados: ${response.statusText}`
          );
        }
        const backendCerts: BackendCertificate[] = await response.json();
        console.log(
          "Certificados CRUDOS del backend (esperando bookTitle/chapterTitle):",
          JSON.stringify(backendCerts, null, 2)
        );

        const displayCerts = backendCerts.map((bc) => {
          let contentData: {
            bookId?: string; // Hacer opcional por si no viene en algun content
            chapterId?: string;
            issueDate?: string;
          } = { issueDate: bc.createdAt }; // Fallback inicial para issueDate

          try {
            if (bc.content) {
              const parsedContent = JSON.parse(bc.content);
              contentData = {
                bookId: parsedContent.bookId,
                chapterId: parsedContent.chapterId,
                issueDate: parsedContent.issueDate || bc.createdAt, // Usar createdAt si issueDate no está en content
              };
            }
          } catch (e) {
            console.error(
              `Error parsing certificate content (ID: ${bc.id}):`,
              bc.content,
              e
            );
          }

          const bookOrEditionTitle =
            bc.bookTitle || "Libro/Edición no disponible";
          let itemTitle = "Título no disponible";
          let displayType: "CAPITULO" | "LIBRO" = "CAPITULO"; // Default por si el tipo es inesperado

          if (bc.type === "chapter_author") {
            displayType = "CAPITULO";
            itemTitle = bc.chapterTitle || `Capítulo de ${bookOrEditionTitle}`;
          } else if (bc.type === "book_author") {
            displayType = "LIBRO";
            itemTitle = bookOrEditionTitle; // Para certificados de libro, el título es el del libro.
          } else {
            console.warn(
              `Tipo de certificado backend desconocido: "${bc.type}" para certificado ID ${bc.id}.`
            );
            // Decidir cómo manejar tipos desconocidos, por ahora usará el `itemTitle` y `displayType` por defecto.
            // Podrías asignar un título genérico o incluso filtrar estos certificados si no deberían mostrarse.
            itemTitle = `Certificado (${
              bc.type || "desconocido"
            }) para ${bookOrEditionTitle}`;
          }

          return {
            id: bc.id,
            title: itemTitle,
            type: displayType,
            date: contentData.issueDate || bc.createdAt, // Doble fallback para la fecha
            editionOrBook: bookOrEditionTitle,
            pdfUrl: bc.documentUrl,
          };
        });

        // Filtrar certificados que pudieron haber resultado en un tipo no deseado si es necesario
        // const filteredForUI = displayCerts.filter(cert => cert.type === "CAPITULO" || cert.type === "LIBRO");
        // setCertificates(filteredForUI);
        setCertificates(displayCerts);
        console.log(
          "Certificados TRANSFORMADOS para UI:",
          JSON.stringify(displayCerts, null, 2)
        );
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]); // Depender del objeto user (o user.id si es más estable y user puede cambiar de otras formas)

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
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (pdfUrl: string) => {
    window.open(pdfUrl, "_blank", "noopener,noreferrer");
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

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <FileText className='h-8 w-8 text-purple-500' />
          </div>
        </div>
      </div>
    );
  }

  return (
    // ... (El JSX de tu return no necesita cambios respecto a esta lógica)
    // ... (Tu JSX desde <div className='relative overflow-hidden py-8 min-h-screen'> hasta el final se mantiene)
    // ... Reemplaza esta sección con tu JSX existente para la UI de la página ...
    <div className='relative overflow-hidden py-8 min-h-screen'>
      <div className='absolute inset-0 z-0 pointer-events-none'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
        <div className='absolute top-1/3 right-1/3 w-56 h-56 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000'></div>
      </div>
      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
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
            Certificados de Autoría
          </h1>
          <div className='w-24 h-1.5 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mb-6'></div>
          <p className='text-gray-700 max-w-2xl mx-auto text-base'>
            Aquí puedes visualizar y descargar todos tus certificados de
            autoría, tanto de capítulos individuales como de libros completos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='backdrop-blur-sm bg-white/80 p-6 md:p-8 rounded-2xl shadow-xl border border-white/50'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
            <div className='relative w-full md:flex-grow md:max-w-sm'>
              <Search className='absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
              <Input
                type='search'
                placeholder='Buscar por título, libro o edición...'
                className='pl-10 py-2.5 border-gray-300 focus:border-purple-500 focus:ring-purple-500 focus:ring-1 rounded-lg w-full'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='flex items-center gap-2 flex-shrink-0'>
              <Filter className='h-4 w-4 text-gray-500' />
              <span className='text-sm text-gray-600 mr-1'>Filtrar:</span>
              <Tabs
                value={activeTab}
                onValueChange={(val) =>
                  setActiveTab(val as "capitulos" | "libros")
                }
                className='w-auto'>
                <TabsList className='bg-purple-50/80 backdrop-blur-sm border border-purple-100 p-1 rounded-lg shadow-sm'>
                  <TabsTrigger
                    value='capitulos'
                    className='data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-1.5 text-sm'>
                    Capítulos
                  </TabsTrigger>
                  <TabsTrigger
                    value='libros'
                    className='data-[state=active]:bg-purple-600 data-[state=active]:text-white px-4 py-1.5 text-sm'>
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

// El componente CertificateList no necesita cambios si sus props no cambian drásticamente.
// Se asume que CertificateList y las demás funciones auxiliares (handleMouseEnter, etc.)
// y el JSX principal de la página no necesitan modificaciones para ESTE cambio específico
// (que es sobre cómo se obtienen y procesan los datos de los certificados).

// Asegúrate de que el componente CertificateList (y sus props) siga siendo compatible.
// Por ejemplo, las props handleView, onDownload, formatDate, etc., parecen estar bien.
// La estructura de `DisplayCertificate` no ha cambiado, solo cómo se obtienen sus datos.
function CertificateList({
  certificates,
  handleView,
  onDownload,
  formatDate,
  searchTerm,
  hoverStates,
  handleMouseEnter,
  handleMouseLeave,
}: {
  certificates: DisplayCertificate[];
  handleView: (pdfUrl: string) => void;
  onDownload: (pdfUrl: string) => void;
  formatDate: (date: string) => string;
  searchTerm: string;
  hoverStates: Record<string, boolean>;
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: (id: string) => void;
}) {
  const router = useRouter(); // Asegúrate de tener useRouter importado aquí si no está global

  // ... (variantes de animación sin cambios)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 90, damping: 15 },
    },
  };

  if (certificates.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='backdrop-blur-sm bg-white/70 p-8 rounded-xl shadow-md border border-gray-100/80 text-center'>
        <Award className='h-16 w-16 mx-auto text-purple-300 mb-5' />
        {searchTerm ? (
          <p className='text-gray-700 text-lg mb-2'>
            No se encontraron certificados para "
            <strong className='text-purple-700'>{searchTerm}</strong>".
          </p>
        ) : (
          <>
            <p className='text-gray-700 text-lg mb-3'>
              Aún no tienes certificados disponibles.
            </p>
            <p className='text-gray-500 text-sm mb-6'>
              Participa en nuestras ediciones o crea tu propio libro para
              obtenerlos.
            </p>
            <div className='flex justify-center gap-4 mt-4'>
              <Button
                variant='outline'
                className='border-purple-600 text-purple-700 hover:bg-purple-50'
                onClick={() => router.push("/editions")}>
                Ver Ediciones
              </Button>
              <Button
                className='bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                onClick={() => router.push("/create-book")}>
                Crear Libro
              </Button>
            </div>
          </>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='grid gap-6 md:grid-cols-1 lg:grid-cols-2'>
      {certificates.map((cert) => (
        <motion.div
          key={cert.id}
          variants={itemVariants}
          whileHover={{
            y: -5,
            boxShadow: "0 8px 25px rgba(128, 90, 213, 0.15)",
          }}
          className='group'>
          <div className='relative backdrop-blur-sm bg-white/90 p-5 rounded-xl shadow-lg border border-gray-200/70 transition-all duration-300 group-hover:shadow-2xl group-hover:border-purple-300 flex flex-col h-full'>
            <div className='flex items-start gap-4 mb-3'>
              <div className='flex-shrink-0 bg-purple-100 p-3 rounded-lg group-hover:bg-purple-200 transition-colors duration-300 transform group-hover:scale-105'>
                {cert.type === "CAPITULO" ? (
                  <FileText className='w-6 h-6 text-purple-700' />
                ) : (
                  <BookOpen className='w-6 h-6 text-purple-700' />
                )}
              </div>
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between mb-1'>
                  <h3
                    className='text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors truncate'
                    title={cert.title}>
                    {cert.title}
                  </h3>
                  <Badge
                    className={`text-xs ml-2 shrink-0 ${
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
              <Calendar className='h-3.5 w-3.5 mr-1.5 text-gray-400' />
              Emitido: {formatDate(cert.date)}
            </div>
            <div className='mt-auto pt-4 border-t border-gray-200/60 flex flex-col sm:flex-row justify-end gap-3'>
              <Button
                size='sm'
                className='w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                onClick={() => onDownload(cert.pdfUrl)}
                onMouseEnter={() => handleMouseEnter(`download-${cert.id}`)}
                onMouseLeave={() => handleMouseLeave(`download-${cert.id}`)}>
                <Download className='h-4 w-4 mr-2' />
                Descargar
              </Button>
              {/* Botón Ver (opcional, si Download ya abre en nueva pestaña)
                <Button
                  variant="outline"
                  size='sm'
                  className='w-full sm:w-auto'
                  onClick={() => handleView(cert.pdfUrl)}
                  onMouseEnter={() => handleMouseEnter(`view-${cert.id}`)}
                  onMouseLeave={() => handleMouseLeave(`view-${cert.id}`)}
                >
                  <Eye className='h-4 w-4 mr-2' />
                  Ver
                </Button>
              */}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
