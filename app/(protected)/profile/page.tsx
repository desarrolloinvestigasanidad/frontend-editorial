"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

type UserData = {
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

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [editData, setEditData] = useState<Partial<UserData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

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
        console.log(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener el perfil:", error);
        setLoading(false);
      });
  }, []);

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
    return <div>Cargando...</div>;
  }

  if (!userData) {
    return <div>No se encontraron datos del usuario.</div>;
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <Breadcrumb />
      </div>

      <Card className='mx-auto max-w-2xl bg-gradient-to-br from-purple-50 to-white'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xl font-bold'>Mi Perfil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col items-center mb-6'>
            <div className='w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4'>
              {userData.firstName?.charAt(0)}
              {userData.lastName?.charAt(0)}
            </div>
            {editing ? (
              <div className='flex flex-col items-center space-y-2'>
                <Input
                  name='firstName'
                  value={editData?.firstName || ""}
                  onChange={handleInputChange}
                  placeholder='Nombre'
                />
                <Input
                  name='lastName'
                  value={editData?.lastName || ""}
                  onChange={handleInputChange}
                  placeholder='Apellidos'
                />
              </div>
            ) : (
              <h2 className='text-xl font-bold'>
                {userData.firstName} {userData.lastName}
              </h2>
            )}
            <p className='text-sm text-muted-foreground'>
              {userData.professionalCategory}
            </p>
            <p className='text-xs text-muted-foreground mt-1'>
              Miembro desde{" "}
              {new Date(userData.createdAt).toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          {/* Layout de información usando grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            {/* Email */}
            <div className='flex items-center gap-3'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <Mail className='h-4 w-4 text-purple-700' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Email</p>
                {editing ? (
                  <Input
                    name='email'
                    value={editData?.email || ""}
                    onChange={handleInputChange}
                    placeholder='Email'
                    className='text-sm'
                  />
                ) : (
                  <p className='text-sm'>{userData.email}</p>
                )}
              </div>
            </div>

            {/* Teléfono */}
            <div className='flex items-center gap-3'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <Phone className='h-4 w-4 text-purple-700' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Teléfono</p>
                {editing ? (
                  <Input
                    name='phone'
                    value={editData?.phone || ""}
                    onChange={handleInputChange}
                    placeholder='Teléfono'
                    className='text-sm'
                  />
                ) : (
                  <p className='text-sm'>{userData.phone}</p>
                )}
              </div>
            </div>

            {/* Categoría Profesional */}
            <div className='flex items-center gap-3'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <Briefcase className='h-4 w-4 text-purple-700' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>
                  Categoría profesional
                </p>
                {editing ? (
                  <Input
                    name='professionalCategory'
                    value={editData?.professionalCategory || ""}
                    onChange={handleInputChange}
                    placeholder='Categoría profesional'
                    className='text-sm'
                  />
                ) : (
                  <p className='text-sm'>{userData.professionalCategory}</p>
                )}
              </div>
            </div>

            {/* Género */}
            <div className='flex items-center gap-3'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <Briefcase className='h-4 w-4 text-purple-700' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Género</p>
                {editing ? (
                  <select
                    name='gender'
                    value={editData?.gender || ""}
                    onChange={handleInputChange}
                    className='w-full border border-gray-200 rounded-md p-2 bg-white text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all'>
                    <option value=''>Selecciona tu género</option>
                    <option value='M'>Masculino</option>
                    <option value='F'>Femenino</option>
                    <option value='Otro'>Otro</option>
                  </select>
                ) : (
                  <p className='text-sm'>{userData.gender}</p>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div className='flex items-center gap-3'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <MapPin className='h-4 w-4 text-purple-700' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Dirección</p>
                {editing ? (
                  <Input
                    name='address'
                    value={editData?.address || ""}
                    onChange={handleInputChange}
                    placeholder='Dirección'
                    className='text-sm'
                  />
                ) : (
                  <p className='text-sm'>{userData.address}</p>
                )}
              </div>
            </div>

            {/* Intereses */}
            <div className='flex items-center gap-3'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <Briefcase className='h-4 w-4 text-purple-700' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Intereses</p>
                {editing ? (
                  <Input
                    name='interests'
                    value={editData?.interests || ""}
                    onChange={handleInputChange}
                    placeholder='Intereses'
                    className='text-sm'
                  />
                ) : (
                  <p className='text-sm'>{userData.interests}</p>
                )}
              </div>
            </div>

            {/* Ubicación */}
            <div className='flex items-center gap-3 col-span-1 sm:col-span-2'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <MapPin className='h-4 w-4 text-purple-700' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Ubicación</p>
                {editing ? (
                  <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
                    <Input
                      name='country'
                      value={editData?.country || ""}
                      onChange={handleInputChange}
                      placeholder='País'
                      className='text-sm'
                    />
                    <Input
                      name='autonomousCommunity'
                      value={editData?.autonomousCommunity || ""}
                      onChange={handleInputChange}
                      placeholder='Comunidad Autónoma'
                      className='text-sm'
                    />
                    <Input
                      name='province'
                      value={editData?.province || ""}
                      onChange={handleInputChange}
                      placeholder='Provincia'
                      className='text-sm'
                    />
                  </div>
                ) : (
                  <p className='text-sm'>
                    {userData.province}, {userData.autonomousCommunity},{" "}
                    {userData.country}
                  </p>
                )}
              </div>
            </div>

            {/* Miembro desde */}
            <div className='flex items-center gap-3 col-span-1 sm:col-span-2'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <Calendar className='h-4 w-4 text-purple-700' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Miembro desde</p>
                <p className='text-sm'>
                  {new Date(userData.createdAt).toLocaleDateString("es-ES", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {editing ? (
            <div className='flex gap-3 mt-6'>
              <Button onClick={handleSave}>Guardar</Button>
              <Button variant='outline' onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          ) : (
            <Button
              className='w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-800'
              onClick={handleEdit}>
              Editar Perfil
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Componente StepIndicator
function StepIndicator({
  stepNumber,
  label,
  active,
  completed,
}: {
  stepNumber: number;
  label: string;
  active: boolean;
  completed?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center transition-all duration-300 ${
        active ? "opacity-100" : completed ? "opacity-90" : "opacity-60"
      }`}>
      <div
        className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
          completed
            ? "bg-purple-600 text-white"
            : active
            ? "border-2 border-purple-600 bg-white text-purple-600"
            : "border-2 border-gray-300 bg-transparent text-gray-400"
        }`}>
        {completed ? (
          <CheckCircle className='w-4 h-4 md:w-5 md:h-5' />
        ) : (
          stepNumber
        )}
      </div>
      <span
        className={`text-xs md:text-sm font-medium mt-1 ${
          active
            ? "text-purple-900"
            : completed
            ? "text-purple-700"
            : "text-gray-500"
        }`}>
        {label}
      </span>
    </div>
  );
}
