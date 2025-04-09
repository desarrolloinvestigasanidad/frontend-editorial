"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Breadcrumb } from "@/components/breadcrumb";
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
  const [loading, setLoading] = useState(true);
  const [hoverStates, setHoverStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Simulamos una carga de datos (en una implementación real se haría un fetch a la API)
    const timer = setTimeout(() => {
      // DEMO: comentar o eliminar la carga de datos si se desea que aparezca el mensaje
      setCertificates([]);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const handleMouseEnter = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    setHoverStates((prev) => ({ ...prev, [id]: false }));
  };

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
    // Puedes abrir un modal de previsualización o redirigir a otra página
    alert(`Ver (previsualizar) Certificado ID: ${certId} (demo)`);
  };

  const handleDownload = (certId: number) => {
    const cert = certificates.find((c) => c.id === certId);
    if (!cert) return;
    // Puedes usar window.open(cert.pdfUrl, "_blank");
    alert(`Descargar PDF del certificado ID: ${certId} (demo).`);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <FileText className='h-6 w-6 text-purple-500' />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Background con degradado y blobs */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between'>
          <Breadcrumb />
          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Mis Certificados
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Certificados de Autoría
          </h2>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto mb-4'></div>
          <p className='text-gray-600 max-w-2xl mx-auto'>
            Accede a todos tus certificados de autoría de capítulos y libros
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='backdrop-blur-sm bg-white/80 p-6 md:p-8 rounded-2xl shadow-lg border border-white/50'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 mb-6'>
            <div className='relative w-full md:w-64'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                type='search'
                placeholder='Buscar certificados...'
                className='pl-10 border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='flex items-center gap-2'>
              <Filter className='h-4 w-4 text-gray-500' />
              <span className='text-sm text-gray-600 mr-2'>Filtrar por:</span>
              <Tabs
                value={activeTab}
                onValueChange={(val) =>
                  setActiveTab(val as "capitulos" | "libros")
                }
                className='w-full md:w-auto'>
                <TabsList className='bg-white/50 backdrop-blur-sm border border-gray-100 p-1 rounded-lg'>
                  <TabsTrigger
                    value='capitulos'
                    className='data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800'>
                    Capítulos
                  </TabsTrigger>
                  <TabsTrigger
                    value='libros'
                    className='data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800'>
                    Libros
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <Tabs value={activeTab} className='w-full'>
            <TabsContent value='capitulos' className='mt-0'>
              <CertificateList
                certificates={filteredCerts}
                onView={handleView}
                onDownload={handleDownload}
                formatDate={formatDate}
                searchTerm={searchTerm}
                hoverStates={hoverStates}
                handleMouseEnter={handleMouseEnter}
                handleMouseLeave={handleMouseLeave}
              />
            </TabsContent>

            <TabsContent value='libros' className='mt-0'>
              <CertificateList
                certificates={filteredCerts}
                onView={handleView}
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

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='backdrop-blur-sm bg-white/60 p-8 rounded-xl shadow-lg border border-purple-100'>
          <h3 className='text-xl font-bold text-gray-900 mb-6 flex items-center'>
            <Award className='h-5 w-5 text-purple-600 mr-2' />
            Información sobre certificados
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

/**
 * Componente que muestra la lista de certificados.
 * Si no existen certificados y no se está filtrando por búsqueda, se muestra
 * un mensaje invitando al usuario a participar en ediciones o crear su libro.
 */
function CertificateList({
  certificates,
  onView,
  onDownload,
  formatDate,
  searchTerm,
  hoverStates,
  handleMouseEnter,
  handleMouseLeave,
}: {
  certificates: Certificate[];
  onView: (id: number) => void;
  onDownload: (id: number) => void;
  formatDate: (date: string) => string;
  searchTerm: string;
  hoverStates: Record<string, boolean>;
  handleMouseEnter: (id: string) => void;
  handleMouseLeave: (id: string) => void;
}) {
  const router = useRouter();

  // Variantes de animación
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Si no hay certificados y no se está realizando una búsqueda, mostramos el mensaje invitando a participar.
  if (certificates.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='backdrop-blur-sm bg-white/60 p-8 rounded-xl shadow-md border border-gray-100 text-center'>
        <FileText className='h-12 w-12 mx-auto text-gray-400 mb-4' />
        {searchTerm ? (
          <p className='text-gray-600 mb-2'>
            No se encontraron certificados para &quot;{searchTerm}&quot;
          </p>
        ) : (
          <>
            <p className='text-gray-600 mb-2'>
              Aún no tienes certificados disponibles, si quieres participar en
              nuestras ediciones o crear tu propio libro, pulsa aquí.
            </p>
            <div className='flex justify-center gap-4 mt-4'>
              <Button
                variant='outline'
                onClick={() => router.push("/ediciones")}>
                Ver Ediciones
              </Button>
              <Button onClick={() => router.push("/create-book")}>
                Crear tu Libro
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
      className='grid gap-6 md:grid-cols-2'>
      {certificates.map((cert) => (
        <motion.div
          key={cert.id}
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className='group'>
          <div className='backdrop-blur-sm bg-white/80 p-6 rounded-2xl shadow-md border border-white/50 transition-all duration-300 hover:shadow-xl hover:border-purple-200'>
            <div className='flex items-start gap-4'>
              <div className='bg-purple-100 p-3 rounded-full group-hover:bg-purple-200 transition-colors duration-300 group-hover:scale-110 flex-shrink-0'>
                {cert.type === "CAPITULO" ? (
                  <FileText className='w-6 h-6 text-purple-700' />
                ) : (
                  <BookOpen className='w-6 h-6 text-purple-700' />
                )}
              </div>
              <div className='flex-1'>
                <div className='flex items-start justify-between'>
                  <div>
                    <h3 className='text-lg font-bold text-gray-900 group-hover:text-purple-700 transition-colors mb-1'>
                      {cert.title}
                    </h3>
                    <p className='text-gray-600 mb-2'>{cert.editionOrBook}</p>
                  </div>
                  <Badge
                    className={
                      cert.type === "CAPITULO"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }>
                    {cert.type === "CAPITULO" ? "Capítulo" : "Libro"}
                  </Badge>
                </div>

                <div className='flex items-center text-sm text-gray-500 mb-4'>
                  <Calendar className='h-4 w-4 mr-1' />
                  {formatDate(cert.date)}
                </div>

                <div className='flex justify-end gap-2 mt-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='border-purple-200 hover:bg-purple-50 hover:text-purple-700'
                    onClick={() => onView(cert.id)}
                    onMouseEnter={() => handleMouseEnter(`view-${cert.id}`)}
                    onMouseLeave={() => handleMouseLeave(`view-${cert.id}`)}>
                    <Eye className='h-4 w-4 mr-2' />
                    Previsualizar
                  </Button>

                  <Button
                    size='sm'
                    className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
                    onClick={() => onDownload(cert.id)}
                    onMouseEnter={() => handleMouseEnter(`download-${cert.id}`)}
                    onMouseLeave={() =>
                      handleMouseLeave(`download-${cert.id}`)
                    }>
                    <Download className='h-4 w-4 mr-2' />
                    Descargar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
