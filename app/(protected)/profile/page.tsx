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
  Heart,
  Edit,
  Save,
  X,
  Award,
  BookOpen,
  FileText,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  professionalCategory: string;
  gender: string;
  address: string;
  interests: string;
  country: string;
  autonomousCommunity: string;
  province: string;
  createdAt: string;
};

type Publication = {
  id: number | string;
  title: string;
  type: string;
  date: string;
  status: string;
};

type Payment = {
  id: string;
  amount: string;
  paymentDate: string;
  method: string;
  status: string;
};

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editData, setEditData] = useState<Partial<UserData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "publications">(
    "personal"
  );
  const [publications, setPublications] = useState<Publication[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  // Cargar perfil del usuario
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUserData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener el perfil:", error);
        setLoading(false);
      });
  }, []);

  // Cargar publicaciones y pagos reales, usando el id del usuario obtenido
  useEffect(() => {
    if (!userData) return;
    const token = localStorage.getItem("token");

    // Obtener publicaciones: ajusta la URL según tu endpoint real
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/publications?userId=${userData.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => setPublications(data))
      .catch((error) =>
        console.error("Error al obtener publicaciones:", error)
      );

    // Obtener pagos: ajusta la URL según tu endpoint real
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payments?userId=${userData.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )
      .then((res) => res.json())
      .then((data) => setPayments(data))
      .catch((error) => console.error("Error al obtener pagos:", error));
  }, [userData]);

  const handleEdit = () => {
    if (userData) {
      setEditData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        professionalCategory: userData.professionalCategory || "",
        gender: userData.gender || "",
        address: userData.address || "",
        interests: userData.interests || "",
        country: userData.country || "",
        autonomousCommunity: userData.autonomousCommunity || "",
        province: userData.province || "",
      });
    }
    setEditing(true);
  };

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const token = localStorage.getItem("token");
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    })
      .then((res) => res.json())
      .then((data) => {
        // Se espera que el endpoint devuelva el usuario actualizado en data.user
        setUserData(data.user || editData);
        setEditing(false);
      })
      .catch((error) => {
        console.error("Error al actualizar el perfil:", error);
      });
  };

  const handleCancel = () => {
    setEditing(false);
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-64'>
        <div className='relative'>
          <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <User className='h-6 w-6 text-purple-500' />
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className='flex flex-col items-center justify-center h-64 text-center'>
        <User className='h-12 w-12 text-gray-400 mb-4' />
        <h2 className='text-xl font-semibold text-gray-800 mb-2'>
          No se encontraron datos del usuario
        </h2>
        <p className='text-gray-600'>
          Por favor, inicia sesión para ver tu perfil
        </p>
      </div>
    );
  }

  return (
    <div className='relative overflow-hidden py-8'>
      {/* Background with gradient and blobs */}
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
          <Breadcrumb>
            <span>Mi Perfil</span>
          </Breadcrumb>

          <div className='inline-block text-sm font-medium py-1 px-3 rounded-full bg-purple-100 text-purple-700'>
            Mi Perfil
          </div>
        </motion.div>

        <div className='max-w-4xl mx-auto'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='backdrop-blur-sm bg-white/80 p-8 rounded-2xl shadow-lg border border-white/50 mb-8'>
            <div className='flex flex-col md:flex-row items-center md:items-start gap-8'>
              {/* Avatar y nombre */}
              <div className='flex flex-col items-center'>
                <div className='w-28 h-28 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg'>
                  {userData.firstName?.charAt(0)}
                  {userData.lastName?.charAt(0)}
                </div>
                {editing ? (
                  <div className='flex flex-col items-center space-y-2 w-full'>
                    <Input
                      name='firstName'
                      value={editData?.firstName || ""}
                      onChange={handleInputChange}
                      placeholder='Nombre'
                      className='text-center'
                    />
                    <Input
                      name='lastName'
                      value={editData?.lastName || ""}
                      onChange={handleInputChange}
                      placeholder='Apellidos'
                      className='text-center'
                    />
                  </div>
                ) : (
                  <div className='text-center'>
                    <h2 className='text-2xl font-bold text-gray-900'>
                      {userData.firstName} {userData.lastName}
                    </h2>
                    <p className='text-sm text-gray-500 mt-1'>{userData.id}</p>
                    <p className='text-sm text-gray-500 mt-1'>
                      {userData.professionalCategory}
                    </p>
                    <div className='flex items-center justify-center mt-2'>
                      <Calendar className='h-4 w-4 text-purple-600 mr-1' />
                      <p className='text-xs text-gray-500'>
                        Miembro desde{" "}
                        {new Date(userData.createdAt).toLocaleDateString(
                          "es-ES",
                          {
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Información principal */}
              <div className='flex-1'>
                <div className='flex space-x-4 mb-6'>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === "personal"
                        ? "bg-purple-100 text-purple-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("personal")}>
                    Información Personal
                  </button>
                  <button
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      activeTab === "publications"
                        ? "bg-purple-100 text-purple-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab("publications")}>
                    Mis Publicaciones y Pagos
                  </button>
                </div>

                {activeTab === "personal" ? (
                  <div className='space-y-6'>
                    {/* Grid de información personal */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      {/* Email */}
                      <div className='flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-gray-100 shadow-sm'>
                        <div className='bg-purple-100 p-2 rounded-full'>
                          <Mail className='h-5 w-5 text-purple-700' />
                        </div>
                        <div className='flex-1'>
                          <p className='text-xs text-gray-500'>Email</p>
                          {editing ? (
                            <Input
                              name='email'
                              value={editData?.email || ""}
                              onChange={handleInputChange}
                              placeholder='Email'
                              className='mt-1'
                            />
                          ) : (
                            <p className='font-medium'>{userData.email}</p>
                          )}
                        </div>
                      </div>

                      {/* Teléfono */}
                      <div className='flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-gray-100 shadow-sm'>
                        <div className='bg-purple-100 p-2 rounded-full'>
                          <Phone className='h-5 w-5 text-purple-700' />
                        </div>
                        <div className='flex-1'>
                          <p className='text-xs text-gray-500'>Teléfono</p>
                          {editing ? (
                            <Input
                              name='phone'
                              value={editData?.phone || ""}
                              onChange={handleInputChange}
                              placeholder='Teléfono'
                              className='mt-1'
                            />
                          ) : (
                            <p className='font-medium'>
                              {userData.phone || "No especificado"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Categoría Profesional */}
                      <div className='flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-gray-100 shadow-sm'>
                        <div className='bg-purple-100 p-2 rounded-full'>
                          <Briefcase className='h-5 w-5 text-purple-700' />
                        </div>
                        <div className='flex-1'>
                          <p className='text-xs text-gray-500'>
                            Categoría profesional
                          </p>
                          {editing ? (
                            <Input
                              name='professionalCategory'
                              value={editData?.professionalCategory || ""}
                              onChange={handleInputChange}
                              placeholder='Categoría profesional'
                              className='mt-1'
                            />
                          ) : (
                            <p className='font-medium'>
                              {userData.professionalCategory ||
                                "No especificado"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Género */}
                      <div className='flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-gray-100 shadow-sm'>
                        <div className='bg-purple-100 p-2 rounded-full'>
                          <User className='h-5 w-5 text-purple-700' />
                        </div>
                        <div className='flex-1'>
                          <p className='text-xs text-gray-500'>Género</p>
                          {editing ? (
                            <select
                              name='gender'
                              value={editData?.gender || ""}
                              onChange={handleInputChange}
                              className='w-full border border-gray-200 rounded-md p-2 bg-white mt-1 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all'>
                              <option value=''>Selecciona tu género</option>
                              <option value='M'>Masculino</option>
                              <option value='F'>Femenino</option>
                              <option value='Otro'>Otro</option>
                            </select>
                          ) : (
                            <p className='font-medium'>
                              {userData.gender === "M"
                                ? "Masculino"
                                : userData.gender === "F"
                                ? "Femenino"
                                : userData.gender || "No especificado"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Dirección */}
                      <div className='flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-gray-100 shadow-sm'>
                        <div className='bg-purple-100 p-2 rounded-full'>
                          <MapPin className='h-5 w-5 text-purple-700' />
                        </div>
                        <div className='flex-1'>
                          <p className='text-xs text-gray-500'>Dirección</p>
                          {editing ? (
                            <Input
                              name='address'
                              value={editData?.address || ""}
                              onChange={handleInputChange}
                              placeholder='Dirección'
                              className='mt-1'
                            />
                          ) : (
                            <p className='font-medium'>
                              {userData.address || "No especificado"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Intereses */}
                      <div className='flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-gray-100 shadow-sm'>
                        <div className='bg-purple-100 p-2 rounded-full'>
                          <Heart className='h-5 w-5 text-purple-700' />
                        </div>
                        <div className='flex-1'>
                          <p className='text-xs text-gray-500'>Intereses</p>
                          {editing ? (
                            <Input
                              name='interests'
                              value={editData?.interests || ""}
                              onChange={handleInputChange}
                              placeholder='Intereses'
                              className='mt-1'
                            />
                          ) : (
                            <p className='font-medium'>
                              {userData.interests || "No especificado"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Ubicación */}
                      <div className='flex items-start gap-3 bg-white/60 p-3 rounded-lg border border-gray-100 shadow-sm col-span-1 md:col-span-2'>
                        <div className='bg-purple-100 p-2 rounded-full mt-1'>
                          <MapPin className='h-5 w-5 text-purple-700' />
                        </div>
                        <div className='flex-1'>
                          <p className='text-xs text-gray-500'>Ubicación</p>
                          {editing ? (
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mt-2'>
                              <Input
                                name='country'
                                value={editData?.country || ""}
                                onChange={handleInputChange}
                                placeholder='País'
                              />
                              <Input
                                name='autonomousCommunity'
                                value={editData?.autonomousCommunity || ""}
                                onChange={handleInputChange}
                                placeholder='Comunidad Autónoma'
                              />
                              <Input
                                name='province'
                                value={editData?.province || ""}
                                onChange={handleInputChange}
                                placeholder='Provincia'
                              />
                            </div>
                          ) : (
                            <p className='font-medium'>
                              {[
                                userData.province,
                                userData.autonomousCommunity,
                                userData.country,
                              ]
                                .filter(Boolean)
                                .join(", ") || "No especificado"}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botones de acción */}
                    {editing ? (
                      <div className='flex gap-3 mt-8'>
                        <Button
                          onClick={handleSave}
                          className='bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'>
                          <Save className='mr-2 h-4 w-4' />
                          Guardar Cambios
                        </Button>
                        <Button variant='outline' onClick={handleCancel}>
                          <X className='mr-2 h-4 w-4' />
                          Cancelar
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className='mt-8 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900'
                        onClick={handleEdit}>
                        <Edit className='mr-2 h-4 w-4' />
                        Editar Perfil
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className='space-y-6'>
                    <div className='flex items-center justify-between'>
                      <h3 className='text-lg font-semibold text-gray-900'>
                        Mis Publicaciones
                      </h3>
                      <Badge className='bg-purple-100 text-purple-800 hover:bg-purple-200'>
                        {publications.length} publicaciones
                      </Badge>
                    </div>

                    <div className='space-y-4'>
                      {publications.map((pub) => (
                        <motion.div
                          key={pub.id}
                          whileHover={{ y: -3 }}
                          className='bg-white/60 p-4 rounded-lg border border-gray-100 shadow-sm hover:border-purple-200 transition-all'>
                          <div className='flex items-start gap-3'>
                            <div
                              className={`p-2 rounded-full ${
                                pub.type === "Libro"
                                  ? "bg-yellow-100"
                                  : "bg-purple-100"
                              }`}>
                              {pub.type === "Libro" ? (
                                <BookOpen className='h-5 w-5 text-yellow-700' />
                              ) : (
                                <FileText className='h-5 w-5 text-purple-700' />
                              )}
                            </div>
                            <div className='flex-1'>
                              <div className='flex items-center justify-between'>
                                <h4 className='font-medium text-gray-900'>
                                  {pub.title}
                                </h4>
                                <Badge
                                  className={
                                    pub.status === "Publicado"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }>
                                  {pub.status}
                                </Badge>
                              </div>
                              <div className='flex items-center mt-2 text-sm text-gray-500'>
                                <Badge
                                  variant='outline'
                                  className='mr-2 border-gray-200'>
                                  {pub.type}
                                </Badge>
                                <span className='flex items-center'>
                                  <Calendar className='h-3 w-3 mr-1' />
                                  {new Date(pub.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className='flex justify-center mt-6'>
                      <Button
                        variant='outline'
                        className='border-purple-200 text-purple-700 hover:bg-purple-50'>
                        <BookOpen className='mr-2 h-4 w-4' />
                        Ver todas mis publicaciones
                      </Button>
                    </div>

                    <div className='mt-8'>
                      <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                        Mis Pagos
                      </h3>
                      {payments.length === 0 ? (
                        <p>No se encontraron pagos.</p>
                      ) : (
                        <table className='min-w-full bg-white rounded-lg shadow overflow-hidden'>
                          <thead className='bg-purple-100'>
                            <tr>
                              <th className='px-4 py-2'>ID</th>
                              <th className='px-4 py-2'>Monto</th>
                              <th className='px-4 py-2'>Fecha</th>
                              <th className='px-4 py-2'>Método</th>
                              <th className='px-4 py-2'>Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((pay) => (
                              <tr key={pay.id} className='hover:bg-gray-50'>
                                <td className='border px-4 py-2'>{pay.id}</td>
                                <td className='border px-4 py-2'>
                                  {pay.amount}€
                                </td>
                                <td className='border px-4 py-2'>
                                  {new Date(
                                    pay.paymentDate
                                  ).toLocaleDateString()}
                                </td>
                                <td className='border px-4 py-2'>
                                  {pay.method}
                                </td>
                                <td className='border px-4 py-2'>
                                  {pay.status}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Estadísticas */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className='backdrop-blur-sm bg-white/60 p-6 rounded-xl shadow-lg border border-purple-100'>
            <h3 className='text-lg font-semibold text-gray-900 mb-6'>
              Estadísticas de Publicación
            </h3>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
                <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-3'>
                  <BookOpen className='h-5 w-5 text-purple-700' />
                </div>
                <h4 className='font-semibold text-gray-900 mb-1'>3</h4>
                <p className='text-sm text-gray-600'>Publicaciones</p>
              </div>
              <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
                <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3'>
                  <CheckCircle className='h-5 w-5 text-green-700' />
                </div>
                <h4 className='font-semibold text-gray-900 mb-1'>2</h4>
                <p className='text-sm text-gray-600'>Publicados</p>
              </div>
              <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
                <div className='w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mb-3'>
                  <Clock className='h-5 w-5 text-yellow-700' />
                </div>
                <h4 className='font-semibold text-gray-900 mb-1'>1</h4>
                <p className='text-sm text-gray-600'>En revisión</p>
              </div>
              <div className='bg-white/80 p-4 rounded-lg shadow border border-purple-50 hover:border-purple-200 transition-all duration-300 hover:shadow-md'>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-3'>
                  <Award className='h-5 w-5 text-blue-700' />
                </div>
                <h4 className='font-semibold text-gray-900 mb-1'>2</h4>
                <p className='text-sm text-gray-600'>Certificados</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
