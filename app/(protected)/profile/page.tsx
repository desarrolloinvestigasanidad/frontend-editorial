"use client";

import { Breadcrumb } from "@/components/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Asegúrate de tener este componente
import { useState, useEffect } from "react";

type UserData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  category: string;
  country: string;
  region: string;
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
        category: userData.category || "",
        country: userData.country || "",
        region: userData.region || "",
        province: userData.province || "",
      });
    }
    setEditing(true);
  };

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
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
            <p className='text-sm text-muted-foreground'>{userData.category}</p>
            <p className='text-xs text-muted-foreground mt-1'>
              Miembro desde{" "}
              {new Date(userData.createdAt).toLocaleDateString("es-ES", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className='space-y-4'>
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

            <div className='flex items-center gap-3'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <MapPin className='h-4 w-4 text-purple-700' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Ubicación</p>
                {editing ? (
                  <div className='grid grid-cols-1 gap-2'>
                    <Input
                      name='province'
                      value={editData?.province || ""}
                      onChange={handleInputChange}
                      placeholder='Provincia'
                      className='text-sm'
                    />
                    <Input
                      name='region'
                      value={editData?.region || ""}
                      onChange={handleInputChange}
                      placeholder='Comunidad Autónoma'
                      className='text-sm'
                    />
                  </div>
                ) : (
                  <p className='text-sm'>
                    {userData.province}, {userData.region}
                  </p>
                )}
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <Briefcase className='h-4 w-4 text-purple-700' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>Categoría</p>
                {editing ? (
                  <Input
                    name='category'
                    value={editData?.category || ""}
                    onChange={handleInputChange}
                    placeholder='Categoría'
                    className='text-sm'
                  />
                ) : (
                  <p className='text-sm'>{userData.category}</p>
                )}
              </div>
            </div>

            <div className='flex items-center gap-3'>
              <div className='bg-purple-100 p-2 rounded-full'>
                <Calendar className='h-4 w-4 text-purple-700' />
              </div>
              <div>
                <p className='text-xs text-muted-foreground'>País</p>
                {editing ? (
                  <Input
                    name='country'
                    value={editData?.country || ""}
                    onChange={handleInputChange}
                    placeholder='País'
                    className='text-sm'
                  />
                ) : (
                  <p className='text-sm'>{userData.country}</p>
                )}
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
