"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Trash,
  BookOpen,
  List,
  Lock,
  ChevronLeft,
  Save,
  Eye,
  Edit,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import AuthorInvitation from "./author-invitation";

// ==============================
// Tipos y modelos de ejemplo
// ==============================
interface Author {
  id: number;
  dni: string;
  fullName: string;
  email: string;
  status: "Validado" | "Pendiente" | "Rechazado";
}

interface Chapter {
  id: number;
  title: string;
  status: "Aceptado" | "Pendiente" | "Rechazado";
  submissionDate: string;
}

// ==============================
// Componente principal
// ==============================
interface CoordinatePageProps {
  params: { bookId: string };
}

export default function CoordinatePage({ params }: CoordinatePageProps) {
  const { bookId } = params;

  // Estados
  const [activeSection, setActiveSection] = useState<
    "title-authors" | "chapters" | "close"
  >("title-authors");
  const [bookTitle, setBookTitle] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
  const [newDni, setNewDni] = useState("");
  const [newName, setNewName] = useState("");
  const [newLastname, setNewLastname] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Carga inicial: libro, autores y capítulos
  useEffect(() => {
    const fetchData = async () => {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const token = localStorage.getItem("token");
      try {
        setLoading(true);

        // 1. Obtener libro
        const resBook = await fetch(`${baseUrl}/books/${bookId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resBook.ok) throw new Error("Error al obtener el libro");
        const book = await resBook.json();
        setBookTitle(book.title);

        // 2. Obtener autores
        const resAuthors = await fetch(`${baseUrl}/books/${bookId}/authors`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resAuthors.ok) throw new Error("Error al obtener autores");
        const authorsData: Author[] = await resAuthors.json();
        setAuthors(authorsData);

        // 3. Obtener capítulos
        const resChapters = await fetch(`${baseUrl}/books/${bookId}/chapters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resChapters.ok) throw new Error("Error al obtener capítulos");
        const chaptersData: Chapter[] = await resChapters.json();
        setChapters(chaptersData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookId]);

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p>Cargando datos del libro...</p>
      </div>
    );
  }

  // Funciones auxiliares y handlers (igual que antes)
  const handleSaveTitle = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseUrl}/books/${bookId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: bookTitle }),
      });
      if (!res.ok) throw new Error("Error guardando título");
      alert("Título guardado correctamente.");
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar el título.");
    }
  };

  const openAddAuthorModal = () => {
    if (authors.length >= 7) {
      alert("Máximo 7 autores (incluyendo al creador).");
      return;
    }
    setShowAddAuthorModal(true);
  };

  const closeAddAuthorModal = () => {
    setNewDni("");
    setNewName("");
    setNewLastname("");
    setNewEmail("");
    setShowAddAuthorModal(false);
  };

  const handleAddAuthor = () => {
    if (authors.length >= 7) {
      alert("Máximo 7 autores (incluyendo al creador).");
      return;
    }
    const fullName = `${newName} ${newLastname}`.trim();
    const newAuthor: Author = {
      id: Date.now(),
      dni: newDni.toUpperCase(),
      fullName,
      email: newEmail,
      status: "Pendiente",
    };
    setAuthors((prev) => [...prev, newAuthor]);
    closeAddAuthorModal();
    alert("Autor agregado (demo).");
  };

  const handleDeleteAuthor = async (userId: number) => {
    if (!confirm("¿Eliminar este autor?")) return;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseUrl}/books/${bookId}/authors/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error eliminando autor");
      setAuthors((prev) => prev.filter((a) => a.id !== userId));
      alert("Autor eliminado correctamente.");
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el autor.");
    }
  };

  // =============================
  //  Lógica Capítulos
  // =============================
  const handlePreviewChapter = (chapterId: number) => {
    alert(`Previsualizar capítulo: ID ${chapterId} (demo)`);
  };

  const handleEditChapter = (chapterId: number) => {
    alert(`Editar capítulo: ID ${chapterId} (demo)`);
  };

  const handleDeleteChapter = (chapterId: number) => {
    const confirmDel = confirm("¿Eliminar este capítulo?");
    if (confirmDel) {
      setChapters((prev) => prev.filter((ch) => ch.id !== chapterId));
      alert(`Capítulo ${chapterId} eliminado (demo).`);
    }
  };

  // =============================
  //  Lógica Cerrar libro
  // =============================
  const handleCloseBook = () => {
    // TODO: check si hay capítulos pendientes de revisión
    const confirmClose = window.confirm(
      "Al cerrar el libro, no podrás hacer más cambios. ¿Continuar?"
    );
    if (confirmClose) {
      // PUT /api/books/\:bookId/close
      alert(
        "Libro cerrado (demo). Queda 'Pendiente de revisión' en administración."
      );
    }
  };

  // Animation variants
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

  // Render principal
  return (
    <div className='relative overflow-hidden py-8'>
      {/* Fondo decorativo */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 to-white'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>

      <div className='container mx-auto px-4 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='flex items-center justify-between mb-8'>
          <Link href={`/books/${bookId}`}>
            <Button
              variant='ghost'
              className='flex items-center text-purple-700 hover:text-purple-900 hover:bg-purple-50'>
              <ChevronLeft className='mr-1 h-4 w-4' />
              Volver al libro
            </Button>
          </Link>
          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Coordinar Libro
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className='text-center mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900 mb-4'>
            Coordinar Libro
          </h1>
          <div className='w-20 h-1 bg-gradient-to-r from-purple-500 to-yellow-500 mx-auto'></div>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          {/* Menú lateral */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className='col-span-1'>
            <Card className='backdrop-blur-sm bg-white/80 border border-white/50 shadow-md'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg text-purple-800'>
                  Opciones
                </CardTitle>
                <CardDescription>Gestiona tu libro</CardDescription>
              </CardHeader>
              <CardContent className='space-y-2'>
                <button
                  className={`flex items-center gap-2 text-left w-full p-3 rounded-lg transition-colors ${
                    activeSection === "title-authors"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                  }`}
                  onClick={() => setActiveSection("title-authors")}>
                  <BookOpen className='h-5 w-5' />
                  <span className='font-medium'>Título y Autores</span>
                </button>

                <button
                  className={`flex items-center gap-2 text-left w-full p-3 rounded-lg transition-colors ${
                    activeSection === "chapters"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                  }`}
                  onClick={() => setActiveSection("chapters")}>
                  <List className='h-5 w-5' />
                  <span className='font-medium'>Capítulos</span>
                </button>

                <button
                  className={`flex items-center gap-2 text-left w-full p-3 rounded-lg transition-colors ${
                    activeSection === "close"
                      ? "bg-purple-100 text-purple-700"
                      : "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
                  }`}
                  onClick={() => setActiveSection("close")}>
                  <Lock className='h-5 w-5' />
                  <span className='font-medium'>Cerrar libro</span>
                </button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contenido según la sección activa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='col-span-3'>
            <Card className='backdrop-blur-sm bg-white/80 border border-white/50 shadow-md'>
              <CardContent className='pt-6'>
                {activeSection === "title-authors" && renderTitleAndAuthors()}
                {activeSection === "chapters" && renderChaptersSection()}
                {activeSection === "close" && renderCloseSection()}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Modal Añadir Autor */}
      <Dialog open={showAddAuthorModal} onOpenChange={setShowAddAuthorModal}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Añadir nuevo autor</DialogTitle>
            <DialogDescription>
              Busca, añade manualmente o invita a un autor para este libro.
            </DialogDescription>
          </DialogHeader>

          <AuthorInvitation
            bookId={bookId}
            onAuthorAdded={() => {
              closeAddAuthorModal();
              // Refresh authors list
              fetch(`/books/${bookId}/authors`)
                .then((res) => res.json())
                .then((data) => {
                  setAuthors(
                    data.map(
                      (author: {
                        id: number;
                        dni: string;
                        fullName: string;
                        email: string;
                      }) => ({
                        id: author.id,
                        dni: author.dni,
                        fullName: author.fullName,
                        email: author.email,
                        status: "Pendiente" as Author["status"],
                      })
                    )
                  );
                })
                .catch((err) =>
                  console.error("Error refreshing authors:", err)
                );
            }}
            onCancel={closeAddAuthorModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );

  // ===============================
  //  Sub-Render: Título y Autores
  // ===============================
  function renderTitleAndAuthors() {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-xl font-bold text-purple-800 mb-4'>
            Título y Autores
          </h2>
          <p className='text-gray-600 text-sm mb-6'>
            Desde aquí puedes editar el título del libro y gestionar los autores
            participantes.
          </p>
        </div>

        {/* Editar Título */}
        <div className='bg-white/60 p-4 rounded-xl border border-purple-100 space-y-3'>
          <Label htmlFor='book-title' className='text-purple-800 font-medium'>
            Título del libro
          </Label>
          <Input
            id='book-title'
            className='border-purple-200 focus:border-purple-300 focus:ring-purple-200'
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <Button
            onClick={handleSaveTitle}
            className='bg-purple-600 hover:bg-purple-700 mt-2'>
            <Save className='h-4 w-4 mr-2' />
            Guardar título
          </Button>
        </div>

        {/* Lista de Autores */}
        <div className='bg-white/60 p-4 rounded-xl border border-purple-100'>
          <div className='flex justify-between items-center mb-4'>
            <div>
              <h3 className='text-lg font-semibold text-purple-800'>Autores</h3>
              <p className='text-gray-600 text-sm'>
                El libro puede tener hasta 7 autores (incluyéndote a ti).
              </p>
            </div>
            <Button
              variant='outline'
              onClick={openAddAuthorModal}
              className='border-purple-200 text-purple-700 hover:bg-purple-50'>
              <UserPlus className='h-4 w-4 mr-2' />
              Añadir autor
            </Button>
          </div>

          <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
            <div className='grid grid-cols-12 bg-purple-50 text-purple-800 font-medium text-sm'>
              <div className='col-span-3 p-3 border-r'>DNI/NIE/Pasaporte</div>
              <div className='col-span-5 p-3 border-r'>Nombre y apellidos</div>
              <div className='col-span-3 p-3 border-r'>Estado</div>
              <div className='col-span-1 p-3'></div>
            </div>

            {authors.map((author, index) => (
              <div
                key={author.id}
                className={`grid grid-cols-12 text-sm ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-purple-50 transition-colors`}>
                <div className='col-span-3 p-3 border-r'>{author.dni}</div>
                <div className='col-span-5 p-3 border-r'>{author.fullName}</div>
                <div className='col-span-3 p-3 border-r'>
                  <Badge
                    className={
                      author.status === "Validado"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : author.status === "Pendiente"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : "bg-red-100 text-red-800 border-red-200"
                    }>
                    {author.status}
                  </Badge>
                </div>
                <div className='col-span-1 p-3 flex justify-center'>
                  <button
                    onClick={() => handleDeleteAuthor(author.id)}
                    className='text-red-500 hover:text-red-700 transition-colors'>
                    <Trash className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))}

            {authors.length === 0 && (
              <div className='p-4 text-center text-gray-500'>
                No hay autores añadidos. Añade autores usando el botón superior.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  //  Sub-Render: Capítulos
  // ===============================
  function renderChaptersSection() {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-xl font-bold text-purple-800 mb-4'>
            Capítulos en este libro
          </h2>
          <p className='text-gray-600 text-sm mb-6'>
            Aquí puedes ver todos los capítulos enviados a este libro y
            gestionar su estado.
          </p>
        </div>

        <div className='bg-white/60 p-4 rounded-xl border border-purple-100'>
          {chapters.length === 0 ? (
            <div className='text-center py-8'>
              <div className='mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <List className='h-8 w-8 text-gray-400' />
              </div>
              <h3 className='text-lg font-medium text-gray-700 mb-2'>
                No hay capítulos
              </h3>
              <p className='text-gray-500 mb-6'>
                Aún no se han enviado capítulos para este libro.
              </p>
              <Button
                onClick={() => alert("Ir a pantalla de 'Enviar capítulo'...")}
                className='bg-purple-600 hover:bg-purple-700'>
                Enviar mi primer capítulo
              </Button>
            </div>
          ) : (
            <>
              <div className='bg-white rounded-lg border border-gray-200 overflow-hidden mb-4'>
                <div className='grid grid-cols-12 bg-purple-50 text-purple-800 font-medium text-sm'>
                  <div className='col-span-5 p-3 border-r'>Título</div>
                  <div className='col-span-2 p-3 border-r'>Estado</div>
                  <div className='col-span-2 p-3 border-r'>Fecha envío</div>
                  <div className='col-span-3 p-3'>Acciones</div>
                </div>

                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.id}
                    className={`grid grid-cols-12 text-sm ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-purple-50 transition-colors`}>
                    <div className='col-span-5 p-3 border-r font-medium'>
                      {chapter.title}
                    </div>
                    <div className='col-span-2 p-3 border-r'>
                      <Badge
                        className={
                          chapter.status === "Aceptado"
                            ? "bg-green-100 text-green-800 border-green-200"
                            : chapter.status === "Pendiente"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }>
                        {chapter.status}
                      </Badge>
                    </div>
                    <div className='col-span-2 p-3 border-r text-gray-600'>
                      {chapter.submissionDate}
                    </div>
                    <div className='col-span-3 p-3 flex items-center space-x-2'>
                      <Button
                        size='sm'
                        variant='outline'
                        className='h-8 px-2 text-xs border-blue-200 text-blue-700 hover:bg-blue-50'
                        onClick={() => handlePreviewChapter(chapter.id)}>
                        <Eye className='h-3 w-3 mr-1' />
                        Ver
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        className='h-8 px-2 text-xs border-purple-200 text-purple-700 hover:bg-purple-50'
                        onClick={() => handleEditChapter(chapter.id)}>
                        <Edit className='h-3 w-3 mr-1' />
                        Editar
                      </Button>
                      <Button
                        size='sm'
                        variant='outline'
                        className='h-8 px-2 text-xs border-red-200 text-red-700 hover:bg-red-50'
                        onClick={() => handleDeleteChapter(chapter.id)}>
                        <Trash className='h-3 w-3 mr-1' />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => alert("Ir a pantalla de 'Enviar capítulo'...")}
                className='bg-purple-600 hover:bg-purple-700'>
                Enviar nuevo capítulo
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ===============================
  //  Sub-Render: Cerrar Libro
  // ===============================
  function renderCloseSection() {
    return (
      <div className='space-y-6'>
        <div>
          <h2 className='text-xl font-bold text-purple-800 mb-4'>
            Cerrar libro
          </h2>
          <p className='text-gray-600 text-sm mb-6'>
            Finaliza el proceso de edición y envía el libro para su revisión
            final.
          </p>
        </div>

        <Alert className='bg-yellow-50 border-yellow-200'>
          <AlertCircle className='h-4 w-4 text-yellow-600' />
          <AlertTitle className='text-yellow-800'>Importante</AlertTitle>
          <AlertDescription className='text-yellow-700'>
            Al cerrar el libro, no podrás realizar más cambios. Se enviará a
            administración para revisión. Si es aceptado, generaremos el PDF
            final y los certificados para todos los autores.
          </AlertDescription>
        </Alert>

        <div className='bg-white/60 p-6 rounded-xl border border-purple-100 text-center'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>
            ¿Estás seguro de que deseas cerrar este libro?
          </h3>
          <p className='text-gray-600 mb-6'>
            Asegúrate de que todos los autores han pagado sus tasas y que todos
            los capítulos están completos.
          </p>
          <Button
            variant='destructive'
            onClick={handleCloseBook}
            className='bg-red-600 hover:bg-red-700'>
            <Lock className='h-4 w-4 mr-2' />
            Cerrar libro definitivamente
          </Button>
        </div>
      </div>
    );
  }
}
