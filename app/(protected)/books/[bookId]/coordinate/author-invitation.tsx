"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

interface Author {
  id: string; // DNI
  dni: string;
  fullName: string;
  email: string;
}

interface AuthorInvitationProps {
  bookId: string;
  onAuthorAdded: () => void;
  onCancel: () => void;
}

export default function AuthorInvitation({
  bookId,
  onAuthorAdded,
  onCancel,
}: AuthorInvitationProps) {
  const { user } = useUser();
  const currentUserId = user?.id;

  // Listado y filtro
  const [allUsers, setAllUsers] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulario manual
  const [dniManual, setDniManual] = useState("");
  const [firstNameManual, setFirstNameManual] = useState("");
  const [lastNameManual, setLastNameManual] = useState("");
  const [emailManual, setEmailManual] = useState("");
  const [manualLoading, setManualLoading] = useState(false);

  // 1️⃣ Carga inicial y mapeo, excluyendo al usuario actual
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${baseUrl}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener usuarios");
        const raw: any[] = await res.json();
        const mapped: Author[] = raw
          .map((u) => ({
            id: u.id,
            dni: u.id,
            fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
            email: u.email,
          }))
          .filter((u) => u.id !== currentUserId);
        setAllUsers(mapped);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los usuarios");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  // 2️⃣ Filtrar por fullName, sin incluir al usuario actual
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allUsers.filter((u) => u.fullName.toLowerCase().includes(term));
  }, [allUsers, searchTerm]);

  // 3️⃣ Invitar usuario existente
  const inviteExisting = async (userId: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseUrl}/books/${bookId}/authors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Error invitando autor");
      onAuthorAdded();
    } catch (err) {
      console.error(err);
      alert("No se pudo invitar al autor.");
    }
  };

  // 4️⃣ Crear manualmente y añadir
  const handleManualAdd = async () => {
    if (!dniManual || !firstNameManual || !lastNameManual || !emailManual) {
      alert("Completa todos los campos del formulario manual.");
      return;
    }
    setManualLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const token = localStorage.getItem("token");
    try {
      // Crear usuario
      const resCreate = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: dniManual,
          email: emailManual,
          password: dniManual,
          firstName: firstNameManual,
          lastName: lastNameManual,
        }),
      });
      if (!resCreate.ok) {
        const text = await resCreate.text();
        throw new Error(`Error creando usuario: ${text}`);
      }
      // Añadir coautor
      const resInvite = await fetch(`${baseUrl}/books/${bookId}/authors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: dniManual }),
      });
      if (!resInvite.ok) throw new Error("Error añadiendo coautor");

      onAuthorAdded();
      // Limpiar form
      setDniManual("");
      setFirstNameManual("");
      setLastNameManual("");
      setEmailManual("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al añadir autor manual.");
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Formulario manual */}
      <div className='p-4 bg-gray-50 rounded space-y-2'>
        <h4 className='font-semibold'>Crear autor manualmente</h4>
        <div className='grid grid-cols-2 gap-2'>
          <Input
            placeholder='DNI'
            value={dniManual}
            onChange={(e) => setDniManual(e.target.value)}
          />
          <Input
            placeholder='Email'
            value={emailManual}
            onChange={(e) => setEmailManual(e.target.value)}
          />
          <Input
            placeholder='Nombre'
            value={firstNameManual}
            onChange={(e) => setFirstNameManual(e.target.value)}
          />
          <Input
            placeholder='Apellidos'
            value={lastNameManual}
            onChange={(e) => setLastNameManual(e.target.value)}
          />
        </div>
        <Button
          onClick={handleManualAdd}
          disabled={manualLoading}
          className='mt-2'>
          {manualLoading ? "Creando..." : "Crear y añadir"}
        </Button>
      </div>

      {/* Buscador de existentes */}
      <Input
        placeholder='Filtrar por nombre...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='w-full'
      />

      {error && <p className='text-red-500'>{error}</p>}

      {isLoading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <Card>
          <CardContent className='p-3 max-h-60 overflow-y-auto'>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className='flex justify-between items-center p-2 hover:bg-gray-100 rounded-md'>
                  <div>
                    <p className='font-medium'>{u.fullName}</p>
                    <p className='text-sm text-gray-500'>
                      {u.dni} • {u.email}
                    </p>
                  </div>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => inviteExisting(u.id)}>
                    <UserPlus className='h-4 w-4' />
                  </Button>
                </div>
              ))
            ) : (
              <p className='text-center text-gray-500'>
                No se encontraron usuarios.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className='flex justify-end'>
        <Button variant='outline' onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
