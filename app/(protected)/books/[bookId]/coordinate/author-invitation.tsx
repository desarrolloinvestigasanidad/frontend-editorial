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

  // API root
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;

  // 1️⃣ All users for search
  const [allUsers, setAllUsers] = useState<Author[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);

  // 2️⃣ Manual form
  const [dniManual, setDniManual] = useState("");
  const [emailManual, setEmailManual] = useState("");
  const [firstNameManual, setFirstNameManual] = useState("");
  const [lastNameManual, setLastNameManual] = useState("");
  const [isManualLoading, setIsManualLoading] = useState(false);

  // Load user list once
  useEffect(() => {
    async function loadUsers() {
      setIsLoadingUsers(true);
      setUsersError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${baseUrl}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Error al obtener usuarios");
        const raw: any[] = await res.json();
        const mapped = raw
          .map((u) => ({
            id: u.id,
            dni: u.id,
            fullName: `${u.firstName || ""} ${u.lastName || ""}`.trim(),
            email: u.email,
          }))
          .filter((u) => u.id !== currentUserId);
        setAllUsers(mapped);
      } catch (err) {
        console.error(err);
        setUsersError("No se pudieron cargar los usuarios");
      } finally {
        setIsLoadingUsers(false);
      }
    }
    loadUsers();
  }, [baseUrl, currentUserId]);

  // 3️⃣ Filtered list
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allUsers.filter((u) => u.fullName.toLowerCase().includes(term));
  }, [allUsers, searchTerm]);

  // 4️⃣ Invite existing
  const inviteExisting = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
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

  // 5️⃣ Create & invite manual
  const handleManualAdd = async () => {
    if (!dniManual || !emailManual || !firstNameManual || !lastNameManual) {
      alert("Completa todos los campos del formulario.");
      return;
    }
    setIsManualLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Create user
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

      // Invite to book
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
      // clear form
      setDniManual("");
      setEmailManual("");
      setFirstNameManual("");
      setLastNameManual("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al añadir autor manual.");
    } finally {
      setIsManualLoading(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Manual entry */}
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
            type='email'
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
          disabled={isManualLoading}
          className='mt-2'>
          {isManualLoading ? "Creando..." : "Crear y añadir"}
        </Button>
      </div>

      {/* Search existing */}
      <Input
        placeholder='Filtrar por nombre...'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='w-full'
      />

      {usersError && <p className='text-red-500'>{usersError}</p>}

      {isLoadingUsers ? (
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
