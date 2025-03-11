"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserPlus, Trash, BookOpen, List, Lock } from "lucide-react";

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

  // Estado: secciones del menú
  // "title-authors" | "chapters" | "close"
  const [activeSection, setActiveSection] = useState<
    "title-authors" | "chapters" | "close"
  >("title-authors");

  // Estado: datos del libro y autores
  const [bookTitle, setBookTitle] = useState("");
  const [authors, setAuthors] = useState<Author[]>([]);
  // Modal para añadir autor
  const [showAddAuthorModal, setShowAddAuthorModal] = useState(false);
  const [newDni, setNewDni] = useState("");
  const [newName, setNewName] = useState("");
  const [newLastname, setNewLastname] = useState("");
  const [newEmail, setNewEmail] = useState("");

  // Estado: capítulos de este libro
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    // Cargar datos del libro (título, autores)
    // GET /api/books/:bookId
    // GET /api/books/:bookId/authors
    setBookTitle(
      "Auxiliar Administrativo de Centros Hospitalarios: Optimización de Recursos y Gestión Eficaz"
    );
    setAuthors([
      {
        id: 101,
        dni: "46398526M",
        fullName: "MARILINI DELGADO MEJÍA",
        email: "marilini@example.com",
        status: "Validado",
      },
      {
        id: 102,
        dni: "45078590R",
        fullName: "JUANA PÉREZ DURÁN",
        email: "juana@example.com",
        status: "Validado",
      },
    ]);

    // Cargar capítulos
    // GET /api/books/:bookId/chapters
    setChapters([
      {
        id: 1,
        title: "Gestión de riesgos hospitalarios",
        status: "Aceptado",
        submissionDate: "2024-10-01",
      },
      {
        id: 2,
        title: "Análisis de casos clínicos en pediatría",
        status: "Pendiente",
        submissionDate: "2024-10-05",
      },
    ]);
  }, [bookId]);

  // =============================
  //  Lógica Título & Autores
  // =============================
  const handleSaveTitle = async () => {
    // PUT /api/books/:bookId { title: bookTitle }
    alert("Título guardado (demo).");
  };

  const openAddAuthorModal = () => {
    setShowAddAuthorModal(true);
  };
  const closeAddAuthorModal = () => {
    setNewDni("");
    setNewName("");
    setNewLastname("");
    setNewEmail("");
    setShowAddAuthorModal(false);
  };
  const handleBlurDni = async () => {
    if (!newDni) return;
    // GET /api/users?dni=...
    // autocompletar nombre, apellido, email
    // DEMO
    if (newDni === "12345678Z") {
      setNewName("Carlos");
      setNewLastname("Gómez López");
      setNewEmail("carlos@example.com");
    }
  };
  const handleAddAuthor = async () => {
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
  const handleDeleteAuthor = async (id: number) => {
    // DELETE /api/books/:bookId/authors/:id
    setAuthors((prev) => prev.filter((a) => a.id !== id));
    alert("Autor eliminado (demo).");
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
      // PUT /api/books/:bookId/close
      alert(
        "Libro cerrado (demo). Queda 'Pendiente de revisión' en administración."
      );
    }
  };

  // Render principal
  return (
    <div className='container mx-auto py-6 px-4'>
      {/* Botón Volver */}
      <div className='mb-4'>
        <Link href={`/books`}>
          <button className='flex items-center gap-2 text-gray-600 hover:text-black'>
            <ArrowLeft className='h-5 w-5' />
            Volver
          </button>
        </Link>
      </div>

      {/* Layout */}
      <div className='grid grid-cols-1 md:grid-cols-5 gap-8'>
        {/* Menú lateral */}
        <aside className='col-span-1 border-r pr-4 space-y-2'>
          <button
            className={
              "flex items-center gap-2 text-left w-full p-2 rounded " +
              (activeSection === "title-authors"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:text-blue-600")
            }
            onClick={() => setActiveSection("title-authors")}>
            <BookOpen className='h-5 w-5' />
            Título y Autores
          </button>

          <button
            className={
              "flex items-center gap-2 text-left w-full p-2 rounded " +
              (activeSection === "chapters"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:text-blue-600")
            }
            onClick={() => setActiveSection("chapters")}>
            <List className='h-5 w-5' />
            Capítulos
          </button>

          <button
            className={
              "flex items-center gap-2 text-left w-full p-2 rounded " +
              (activeSection === "close"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:text-blue-600")
            }
            onClick={() => setActiveSection("close")}>
            <Lock className='h-5 w-5' />
            Cerrar libro
          </button>
        </aside>

        {/* Contenido según la sección activa */}
        <main className='col-span-4'>
          {activeSection === "title-authors" && renderTitleAndAuthors()}
          {activeSection === "chapters" && renderChaptersSection()}
          {activeSection === "close" && renderCloseSection()}
        </main>
      </div>

      {/* Modal Añadir Autor */}
      {showAddAuthorModal && (
        <div className='fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg p-6 w-full max-w-sm shadow-lg'>
            <h3 className='text-lg font-semibold mb-4'>Nuevo autor</h3>

            <label className='block text-sm font-medium'>DNI</label>
            <input
              type='text'
              className='border rounded w-full p-2 mb-3'
              value={newDni}
              onChange={(e) => setNewDni(e.target.value)}
              onBlur={handleBlurDni}
            />

            <label className='block text-sm font-medium'>Nombre</label>
            <input
              type='text'
              className='border rounded w-full p-2 mb-3'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <label className='block text-sm font-medium'>Apellidos</label>
            <input
              type='text'
              className='border rounded w-full p-2 mb-3'
              value={newLastname}
              onChange={(e) => setNewLastname(e.target.value)}
            />

            <label className='block text-sm font-medium'>Email</label>
            <input
              type='email'
              className='border rounded w-full p-2 mb-4'
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={closeAddAuthorModal}>
                Cancelar
              </Button>
              <Button onClick={handleAddAuthor}>Añadir</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // ===============================
  //  Sub-Render: Título y Autores
  // ===============================
  function renderTitleAndAuthors() {
    return (
      <div>
        <h2 className='text-xl font-bold mb-4'>Título y Autores</h2>

        {/* Editar Título */}
        <div className='mb-6'>
          <label className='block font-semibold text-gray-700 mb-2'>
            Título del libro
          </label>
          <input
            type='text'
            className='border rounded w-full p-2'
            value={bookTitle}
            onChange={(e) => setBookTitle(e.target.value)}
          />
          <Button onClick={handleSaveTitle} className='mt-3'>
            Guardar
          </Button>
        </div>

        {/* Lista de Autores */}
        <h3 className='text-lg font-semibold mb-2'>Autores</h3>
        <p className='text-gray-600 text-sm mb-4'>
          El libro puede tener hasta 7 autores (incluyéndote a ti).
        </p>

        <table className='w-full border text-sm mb-4'>
          <thead>
            <tr className='bg-gray-50'>
              <th className='p-2 border'>DNI</th>
              <th className='p-2 border'>Nombre y apellidos</th>
              <th className='p-2 border'>Estado</th>
              <th className='p-2 border'></th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <tr key={author.id}>
                <td className='p-2 border'>{author.dni}</td>
                <td className='p-2 border'>{author.fullName}</td>
                <td className='p-2 border'>{author.status}</td>
                <td className='p-2 border text-right'>
                  <button
                    onClick={() => handleDeleteAuthor(author.id)}
                    className='text-red-600 hover:text-red-800 flex items-center gap-1'>
                    <Trash className='h-4 w-4' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={openAddAuthorModal}
          className='text-blue-600 flex items-center gap-1 text-sm'>
          <UserPlus className='h-4 w-4' />
          Añadir autor
        </button>
      </div>
    );
  }

  // ===============================
  //  Sub-Render: Capítulos
  // ===============================
  function renderChaptersSection() {
    return (
      <div>
        <h2 className='text-xl font-bold mb-4'>Capítulos en este libro</h2>
        {chapters.length === 0 ? (
          <p className='text-gray-600'>No hay capítulos todavía.</p>
        ) : (
          <table className='w-full border text-sm mb-4'>
            <thead>
              <tr className='bg-gray-50'>
                <th className='p-2 border'>Título</th>
                <th className='p-2 border'>Estado</th>
                <th className='p-2 border'>Fecha envío</th>
                <th className='p-2 border text-right'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((ch) => (
                <tr key={ch.id}>
                  <td className='p-2 border'>{ch.title}</td>
                  <td className='p-2 border'>{ch.status}</td>
                  <td className='p-2 border'>{ch.submissionDate}</td>
                  <td className='p-2 border text-right'>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handlePreviewChapter(ch.id)}>
                      Previsualizar
                    </Button>{" "}
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleEditChapter(ch.id)}>
                      Modificar
                    </Button>{" "}
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDeleteChapter(ch.id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* Puedes poner un botón para “Enviar nuevo capítulo” y linkear a /submit-chapter */}
        <Button
          onClick={() => alert("Ir a pantalla de 'Enviar capítulo'...")}
          className='mt-2'>
          Enviar nuevo capítulo
        </Button>
      </div>
    );
  }

  // ===============================
  //  Sub-Render: Cerrar Libro
  // ===============================
  function renderCloseSection() {
    return (
      <div>
        <h2 className='text-xl font-bold mb-4'>Cerrar libro</h2>
        <p className='text-gray-700 mb-4'>
          Al cerrar el libro, no podrás realizar más cambios. Se enviará a
          administración para revisión. Si es aceptado, generaremos el PDF final
          y los certificados.
        </p>
        <Button variant='destructive' onClick={handleCloseBook}>
          Cerrar libro
        </Button>
      </div>
    );
  }
}
