"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle,
  User,
  Heart, // No usado actualmente, pero mantenido por si acaso
  Edit,
  Save,
  X,
  Award,
  BookOpen,
  FileText,
  Clock,
  Loader2, // Para estados de carga
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import CreditConsumptionHistory from "@/components/CreditConsumptionHistory"; // Asumo que este componente existe
import { toast } from "sonner"; // Para notificaciones

type UserData = {
  id: string; // DNI/NIE/Pasaporte
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  professionalCategory: string; // Este es el ID de la categoría
  gender: string;
  address: string;
  interests: string;
  country: string;
  autonomousCommunity: string; // Parece ser un string, ¿debería ser array como en registro?
  province: string;
  createdAt: string;
};

type Publication = {
  id: number | string;
  title: string;
  type: string;
  date: string;
  status: string;
  cover?: string;
  publishDate: string;
  bookType?: string;
};

type Payment = {
  id: string;
  amount: string;
  paymentDate: string;
  method: string;
  status: string;
};

// Tipo para las opciones de categoría profesional cargadas
type ProfessionalCategoryOption = {
  id: string;
  nombre: string;
};

const CONFIG_KEY_CATEGORIAS = "professional_categories_simple"; // Clave consistente
const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editData, setEditData] = useState<Partial<UserData> | null>(null);
  const [loading, setLoading] = useState(true); // Carga principal del perfil
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // Para el botón de guardar

  // Estados para pestañas (no se usan actualmente pero se mantienen por si se reactivan)
  // const [activeTab, setActiveTab] = useState<"personal" | "publications" | "payments">("personal");
  // const [publications, setPublications] = useState<Publication[]>([]);
  // const [payments, setPayments] = useState<Payment[]>([]);

  // Nuevos estados para categorías profesionales
  const [professionalCategories, setProfessionalCategories] = useState<
    ProfessionalCategoryOption[]
  >([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Cargar perfil del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !BASE_API_URL) {
      setLoading(false);
      setIsLoadingCategories(false); // También detener carga de categorías si no hay token o URL
      toast.error("Error de autenticación o configuración.");
      return;
    }

    setLoading(true);
    fetch(`${BASE_API_URL}/profile`, {
      // Asumo que /profile es la ruta correcta en tu API
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("No se pudo obtener el perfil del usuario.");
        return res.json();
      })
      .then((data) => {
        setUserData(data);
      })
      .catch((error) => {
        console.error("Error al obtener el perfil:", error);
        toast.error(`Error al cargar perfil: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Cargar categorías profesionales
  useEffect(() => {
    const fetchProfessionalCategories = async () => {
      if (!BASE_API_URL) {
        setIsLoadingCategories(false);
        return;
      }
      setIsLoadingCategories(true);
      try {
        const response = await fetch(
          `${BASE_API_URL}/config/${CONFIG_KEY_CATEGORIAS}`
        );
        if (response.status === 404) {
          setProfessionalCategories([]);
        } else if (response.ok) {
          const setting = await response.json();
          const parsedCategories = (JSON.parse(setting.value || "[]") as any[])
            .map((cat) => ({
              id: cat.id,
              nombre: cat.nombre,
            }))
            .sort((a, b) => a.nombre.localeCompare(b.nombre));
          setProfessionalCategories(parsedCategories);
        } else {
          throw new Error("Error al cargar categorías del servidor.");
        }
      } catch (error: any) {
        console.error("Error fetching professional categories:", error);
        toast.error(`Error al cargar categorías: ${error.message}`);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchProfessionalCategories();
  }, []);

  // Cargar publicaciones y pagos (Mantenido como estaba, ajustar si es necesario)
  // useEffect(() => {
  //   if (!userData || !BASE_API_URL) return;
  //   const token = localStorage.getItem("token");
  //   if(!token) return;

  //   fetch(`${BASE_API_URL}/publications?userId=${userData.id}`, { headers: { Authorization: `Bearer ${token}` }})
  //     .then((res) => res.json())
  //     .then((data) => setPublications(data))
  //     .catch((error) => console.error("Error al obtener publicaciones:", error));

  //   fetch(`${BASE_API_URL}/payments?userId=${userData.id}`, { headers: { Authorization: `Bearer ${token}` }})
  //     .then((res) => res.json())
  //     .then((data) => setPayments(data))
  //     .catch((error) => console.error("Error al obtener pagos:", error));
  // }, [userData]);

  const handleEdit = () => {
    if (userData) {
      setEditData({ ...userData }); // Copiar todos los datos para edición
    }
    setEditing(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value } as Partial<UserData>));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token || !editData || !BASE_API_URL) {
      toast.error("No se pueden guardar los cambios. Falta información.");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch(`${BASE_API_URL}/update-profile`, {
        // Asumo que /update-profile es la ruta
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar el perfil.");
      }
      const updatedUser = await response.json();
      setUserData(
        updatedUser.user || ({ ...userData, ...editData } as UserData)
      ); // Priorizar respuesta del backend
      setEditing(false);
      toast.success("Perfil actualizado correctamente.");
    } catch (error: any) {
      console.error("Error al actualizar el perfil:", error);
      toast.error(`Error al guardar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData(null); // Limpiar datos de edición
  };

  const getCategoryNameById = (categoryId: string): string => {
    if (isLoadingCategories) return "Cargando...";
    const category = professionalCategories.find(
      (cat) => cat.id === categoryId
    );
    return category ? category.nombre : categoryId; // Fallback al ID si no se encuentra o no está cargado
  };

  // ... (cálculos de estadísticas como totalPublications, etc. se mantienen igual) ...
  // const totalPublications = publications.length;
  // const publishedCount = publications.filter(pub => pub.status.toLowerCase() === "publicado").length;
  // const reviewCount = publications.filter(pub => pub.status.toLowerCase() === "revision" || pub.status.toLowerCase() === "desarrollo").length;
  // const certifiedCount = publications.filter(pub => pub.status.toLowerCase() === "certificado").length;

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white'>
        <div className='relative'>
          <div className='h-20 w-20 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <User className='h-10 w-10 text-purple-600' />
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gradient-to-br from-purple-50 to-white'>
        <User className='h-16 w-16 text-gray-400 mb-6' />
        <h2 className='text-2xl font-semibold text-gray-800 mb-3'>
          No se pudieron cargar los datos del perfil
        </h2>
        <p className='text-gray-600 mb-6 max-w-md'>
          Hubo un problema al obtener tu información. Por favor, intenta
          recargar la página o inicia sesión de nuevo.
        </p>
        <Button onClick={() => useRouter().push("/login")}>
          Ir a Iniciar Sesión
        </Button>
      </div>
    );
  }

  return (
    <div className='relative overflow-x-hidden py-8 min-h-screen'>
      {" "}
      {/* Evitar overflow horizontal */}
      <div className='absolute inset-0 z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50'></div>
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob'></div>
        <div className='absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000'></div>
      </div>
      <div className='container mx-auto px-4 relative z-10 space-y-8'>
        <motion.div /* ... Breadcrumb ... */>
          <Breadcrumb>
            <span className='inline-block text-sm font-medium py-1.5 px-4 rounded-full bg-purple-100 text-purple-700 shadow-sm'>
              Mi Perfil
            </span>
          </Breadcrumb>
        </motion.div>

        <div className='max-w-4xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='backdrop-blur-md bg-white/80 p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-200/70 mb-8'>
            <div className='flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8'>
              <div className='flex flex-col items-center md:w-1/3 shrink-0'>
                <div className='w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-4xl sm:text-5xl font-bold mb-4 shadow-lg ring-4 ring-white/50'>
                  {userData.firstName?.charAt(0).toUpperCase()}
                  {userData.lastName?.charAt(0).toUpperCase()}
                </div>
                {!editing && (
                  <div className='text-center'>
                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-800'>
                      {userData.firstName} {userData.lastName}
                    </h2>
                    {/* Mostrar nombre de categoría profesional */}
                    <p className='text-sm text-gray-600 mt-1 font-medium'>
                      {getCategoryNameById(userData.professionalCategory) ||
                        "Categoría no especificada"}
                    </p>
                    <div className='flex items-center justify-center mt-2.5 text-xs text-gray-500'>
                      <Calendar className='h-3.5 w-3.5 mr-1.5 text-purple-600' />
                      Miembro desde{" "}
                      {new Date(userData.createdAt).toLocaleDateString(
                        "es-ES",
                        { month: "long", year: "numeric" }
                      )}
                    </div>
                  </div>
                )}
                {/* Inputs para nombre y apellido en modo edición (si se quiere editar aquí) */}
                {editing && (
                  <div className='text-center w-full space-y-3 mt-2'>
                    <Input
                      name='firstName'
                      value={editData?.firstName || ""}
                      onChange={handleInputChange}
                      placeholder='Nombre'
                      className='text-center text-lg font-semibold'
                    />
                    <Input
                      name='lastName'
                      value={editData?.lastName || ""}
                      onChange={handleInputChange}
                      placeholder='Apellidos'
                      className='text-center text-lg font-semibold'
                    />
                  </div>
                )}
                {/* Imagen del doctor - opcional, se puede comentar si no se usa */}
                {!editing && (
                  <div className='mt-6 hidden md:block'>
                    <Image
                      src='/doctor.png'
                      alt='Ilustración profesional'
                      width={200}
                      height={200}
                      className='mx-auto h-auto opacity-80'
                    />
                  </div>
                )}
              </div>

              <div className='flex-1 w-full'>
                {/* Pestañas eliminadas por simplicidad, mostrando solo info personal */}
                {/* <div className='flex space-x-2 sm:space-x-4 mb-6 border-b pb-3'> ... </div */}
                <div className='space-y-5'>
                  <h3 className='text-xl font-semibold text-gray-700 mb-4 border-b pb-2'>
                    Detalles Personales
                  </h3>
                  {/* Campos de información */}
                  {[
                    {
                      label: "Email",
                      value: editing ? null : userData.email,
                      Icon: Mail,
                      name: "email",
                      type: "email",
                    },
                    {
                      label: "Teléfono",
                      value: editing
                        ? null
                        : userData.phone || "No especificado",
                      Icon: Phone,
                      name: "phone",
                      type: "tel",
                    },
                    {
                      label: "DNI/NIE/Pasaporte",
                      value: userData.id,
                      Icon: FileText,
                      name: "id",
                      type: "text",
                      readOnly: true,
                    }, // DNI es solo lectura
                    {
                      label: "Categoría profesional",
                      value: editing
                        ? null
                        : getCategoryNameById(userData.professionalCategory),
                      Icon: Briefcase,
                      name: "professionalCategory",
                      type: "select",
                    },
                    {
                      label: "Género",
                      value: editing
                        ? null
                        : userData.gender === "M"
                        ? "Masculino"
                        : userData.gender === "F"
                        ? "Femenino"
                        : userData.gender || "No especificado",
                      Icon: User,
                      name: "gender",
                      type: "select",
                    },
                    {
                      label: "País",
                      value: editing
                        ? null
                        : userData.country || "No especificado",
                      Icon: MapPin,
                      name: "country",
                      type: "text",
                    }, // Simplificado
                    // Podrías añadir más campos si es necesario como autonomousCommunity, province, address, interests
                  ].map((field) => (
                    <div
                      key={field.name}
                      className='flex items-start gap-3 bg-white/70 p-3.5 rounded-lg border border-gray-200/80 shadow-sm'>
                      <div className='bg-purple-100 p-2.5 rounded-lg mt-0.5'>
                        <field.Icon className='h-5 w-5 text-purple-700' />
                      </div>
                      <div className='flex-1'>
                        <p className='text-xs text-gray-500 font-medium'>
                          {field.label}
                        </p>
                        {editing &&
                          !field.readOnly &&
                          field.type !== "select" && (
                            <Input
                              type={field.type as any} // Asegurar que 'type' sea un tipo válido para Input
                              name={field.name}
                              value={(editData as any)?.[field.name] || ""}
                              onChange={handleInputChange}
                              placeholder={field.label}
                              className='mt-1 text-sm'
                            />
                          )}
                        {editing && field.name === "professionalCategory" && (
                          <select
                            name='professionalCategory'
                            value={editData?.professionalCategory || ""}
                            onChange={handleInputChange}
                            disabled={isLoadingCategories}
                            className='mt-1 w-full border border-gray-300 rounded-md p-2 bg-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-400'>
                            <option value=''>
                              {isLoadingCategories
                                ? "Cargando..."
                                : "Selecciona categoría"}
                            </option>
                            {professionalCategories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                              </option>
                            ))}
                          </select>
                        )}
                        {editing && field.name === "gender" && (
                          <select
                            name='gender'
                            value={editData?.gender || ""}
                            onChange={handleInputChange}
                            className='mt-1 w-full border border-gray-300 rounded-md p-2 bg-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-400'>
                            <option value=''>Seleccionar género</option>
                            <option value='M'>Masculino</option>
                            <option value='F'>Femenino</option>
                            <option value='Otro'>Otro</option>
                          </select>
                        )}
                        {(!editing || field.readOnly) && (
                          <p className='font-medium text-gray-800 text-sm break-words'>
                            {field.value}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {editing ? (
                    <div className='flex gap-3 mt-8 pt-4 border-t'>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'>
                        {isSaving ? (
                          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                          <Save className='mr-2 h-4 w-4' />
                        )}
                        Guardar Cambios
                      </Button>
                      <Button
                        variant='outline'
                        onClick={handleCancel}
                        disabled={isSaving}>
                        <X className='mr-2 h-4 w-4' /> Cancelar
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={handleEdit}
                      className='mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'>
                      <Edit className='mr-2 h-4 w-4' /> Editar Perfil
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sección de Estadísticas (Mantenida como estaba, ajustar si es necesario) */}
          {/* <motion.div ... className='backdrop-blur-sm bg-white/60 p-6 rounded-xl shadow-lg border border-purple-100'> ... </motion.div> */}
        </div>
      </div>
    </div>
  );
}
