"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, User, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface Author {
  id: string; // DNI
  dni: string;
  fullName: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

interface AuthorInvitationDialogProps {
  bookId: string;
  chapterId?: string;
  onAuthorAdded?: () => void;
  trigger?: React.ReactNode;
}

export default function AuthorInvitationDialog({
  bookId,
  chapterId,
  onAuthorAdded,
  trigger,
}: AuthorInvitationDialogProps) {
  const { user } = useUser();
  const currentUserId = user?.id;
  const [open, setOpen] = useState(false);

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

  // 3️⃣ New ID search functionality
  const [searchId, setSearchId] = useState("");
  const [isSearchingId, setIsSearchingId] = useState(false);
  const [foundUser, setFoundUser] = useState<Author | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Load user list once
  useEffect(() => {
    if (chapterId) {
      setOpen(true);
    }

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
            firstName: u.firstName,
            lastName: u.lastName,
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
  }, [baseUrl, currentUserId, open]);

  // 3️⃣ Filtered list
  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allUsers.filter((u) => u.fullName.toLowerCase().includes(term));
  }, [allUsers, searchTerm]);

  // 4️⃣ Invite existing
  const inviteExisting = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");

      // Si tenemos chapterId, invitamos al autor al capítulo
      if (chapterId) {
        const res = await fetch(`${baseUrl}/chapters/${chapterId}/authors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) throw new Error("Error invitando autor al capítulo");
      }
      // Si no, lo invitamos al libro
      else {
        const res = await fetch(`${baseUrl}/books/${bookId}/authors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) throw new Error("Error invitando autor al libro");
      }

      // Cerrar el diálogo y notificar
      setOpen(false);
      if (onAuthorAdded) onAuthorAdded();
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

      // Invite to chapter or book
      if (chapterId) {
        const resInvite = await fetch(
          `${baseUrl}/chapters/${chapterId}/authors`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ userId: dniManual }),
          }
        );
        if (!resInvite.ok)
          throw new Error("Error añadiendo coautor al capítulo");
      } else {
        const resInvite = await fetch(`${baseUrl}/books/${bookId}/authors`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: dniManual }),
        });
        if (!resInvite.ok) throw new Error("Error añadiendo coautor al libro");
      }

      // Cerrar el diálogo y notificar
      setOpen(false);
      if (onAuthorAdded) onAuthorAdded();

      // clear form
      setDniManual("");
      setEmailManual("");
      setFirstNameManual("");
      setLastNameManual("");
      setFoundUser(null);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error al añadir autor manual.");
    } finally {
      setIsManualLoading(false);
    }
  };

  // 6️⃣ New function to search user by ID
  const searchUserById = async () => {
    if (!searchId.trim()) {
      alert("Por favor, introduce un DNI para buscar");
      return;
    }

    setIsSearchingId(true);
    setFoundUser(null);
    setSearchError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${baseUrl}/users/search?term=${searchId.trim()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al buscar usuario");
      }

      const users = await res.json();
      if (users.length > 0) {
        // User found, set the found user
        const user = users[0];
        setFoundUser(user);

        // Auto-fill the manual form
        setDniManual(user.id || user.dni);
        setEmailManual(user.email);
        setFirstNameManual(
          user.firstName || (user.fullName ? user.fullName.split(" ")[0] : "")
        );
        setLastNameManual(
          user.lastName ||
            (user.fullName ? user.fullName.split(" ").slice(1).join(" ") : "")
        );
      } else {
        // User not found, clear the form for manual entry except DNI
        setDniManual(searchId);
        setEmailManual("");
        setFirstNameManual("");
        setLastNameManual("");
        setSearchError("Usuario no encontrado. Puedes añadirlo manualmente.");
      }
    } catch (err: any) {
      console.error(err);
      setSearchError(err.message || "Error al buscar usuario");
    } finally {
      setIsSearchingId(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Limpiar estados al cerrar
      setSearchId("");
      setFoundUser(null);
      setSearchError(null);
      setDniManual("");
      setEmailManual("");
      setFirstNameManual("");
      setLastNameManual("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            variant='outline'
            className='border border-orange-300 text-orange-600 hover:bg-orange-50'>
            <UserPlus className='h-4 w-4 mr-2' />
            Añadir coautor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle className='text-xl font-semibold text-orange-600 flex items-center gap-2'>
            <UserPlus className='h-5 w-5' />
            Añadir coautor al capítulo
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-6'>
          {/* New ID search section */}
          <div className='p-4 bg-purple-50 rounded-lg border border-purple-100 space-y-3'>
            <h4 className='font-semibold text-purple-800 flex items-center gap-2'>
              <Search className='h-4 w-4' />
              Buscar usuario por DNI
            </h4>
            <p className='text-sm text-gray-600'>
              Primero busca si el usuario ya está registrado en el sistema.
            </p>
            <div className='flex gap-2'>
              <Input
                placeholder='Introduce DNI'
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className='border-purple-200 focus:border-purple-300 focus:ring-purple-200'
              />
              <Button
                onClick={searchUserById}
                disabled={isSearchingId}
                className='bg-purple-600 hover:bg-purple-700'>
                {isSearchingId ? "Buscando..." : "Buscar"}
              </Button>
            </div>

            {searchError && (
              <Alert className='bg-yellow-50 border-yellow-200'>
                <AlertCircle className='h-4 w-4 text-yellow-600' />
                <AlertDescription className='text-yellow-700'>
                  {searchError}
                </AlertDescription>
              </Alert>
            )}

            {foundUser && (
              <div className='mt-2 p-3 bg-green-50 border border-green-200 rounded-lg'>
                <div className='flex items-center gap-2 text-green-700 font-medium mb-1'>
                  <User className='h-4 w-4' />
                  <span>Usuario encontrado</span>
                </div>
                <p className='text-sm text-green-800 mb-2'>
                  {foundUser.fullName ||
                    `${foundUser.firstName} ${foundUser.lastName}`}{" "}
                  ({foundUser.email})
                </p>
                <Button
                  onClick={() => inviteExisting(foundUser.id)}
                  className='mt-1 bg-green-600 hover:bg-green-700 text-sm'
                  size='sm'>
                  <UserPlus className='h-3.5 w-3.5 mr-1.5' />
                  Añadir como coautor
                </Button>
              </div>
            )}
          </div>

          {/* Manual entry - now used either for new users or to edit found user details */}
          <div className='p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3'>
            <h4 className='font-semibold text-gray-800'>
              {foundUser
                ? "Datos del usuario encontrado"
                : "Crear autor manualmente"}
            </h4>
            <p className='text-sm text-gray-600'>
              {foundUser
                ? "Puedes editar los datos si es necesario antes de añadir al usuario."
                : "Si el usuario no está registrado, completa sus datos para añadirlo."}
            </p>
            <div className='grid grid-cols-2 gap-3'>
              <div className='space-y-1'>
                <label className='text-xs text-gray-500'>DNI</label>
                <Input
                  placeholder='DNI'
                  value={dniManual}
                  onChange={(e) => setDniManual(e.target.value)}
                  readOnly={!!foundUser}
                  className={foundUser ? "bg-gray-100" : ""}
                />
              </div>
              <div className='space-y-1'>
                <label className='text-xs text-gray-500'>Email</label>
                <Input
                  placeholder='Email'
                  type='email'
                  value={emailManual}
                  onChange={(e) => setEmailManual(e.target.value)}
                />
              </div>
              <div className='space-y-1'>
                <label className='text-xs text-gray-500'>Nombre</label>
                <Input
                  placeholder='Nombre'
                  value={firstNameManual}
                  onChange={(e) => setFirstNameManual(e.target.value)}
                />
              </div>
              <div className='space-y-1'>
                <label className='text-xs text-gray-500'>Apellidos</label>
                <Input
                  placeholder='Apellidos'
                  value={lastNameManual}
                  onChange={(e) => setLastNameManual(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={handleManualAdd}
              disabled={isManualLoading}
              className='mt-2 bg-purple-600 hover:bg-purple-700'>
              {isManualLoading
                ? "Procesando..."
                : foundUser
                ? "Actualizar y añadir"
                : "Crear y añadir"}
            </Button>
          </div>

          <div className='flex justify-end'>
            <DialogClose asChild>
              <Button
                variant='outline'
                onClick={() => setOpen(false)}
                className='border-gray-200'>
                Cancelar
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
