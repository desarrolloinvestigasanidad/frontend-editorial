"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UserPlus, Search as SearchIcon } from "lucide-react";

interface Author {
  id: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.length < 3) {
        setSearchResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/users/search?term=${encodeURIComponent(searchTerm)}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Error fetching users");
        const data: Author[] = await res.json();
        setSearchResults(data);
      } catch (err: any) {
        console.error(err);
        setError("Error buscando usuarios.");
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const addAuthorToBook = async (userId: string) => {
    try {
      const res = await fetch(`/api/books/${bookId}/authors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (!res.ok) throw new Error("Error añadiendo autor");
      onAuthorAdded();
    } catch (err) {
      console.error(err);
      alert("No se pudo añadir el autor.");
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <Input
          placeholder='Busca por DNI o email (mínimo 3 caracteres)'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='flex-1'
        />
        <Button disabled={isLoading || searchTerm.length < 3}>
          <SearchIcon className='h-4 w-4 mr-2' />
          Buscar
        </Button>
      </div>

      {error && <div className='text-red-500'>{error}</div>}

      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        searchResults.length > 0 && (
          <Card>
            <CardContent className='p-3 max-h-60 overflow-y-auto'>
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className='flex justify-between items-center p-2 hover:bg-gray-100 rounded-md cursor-pointer'>
                  <div>
                    <div className='font-medium'>{user.fullName}</div>
                    <div className='text-sm text-gray-500'>
                      {user.dni} • {user.email}
                    </div>
                  </div>
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-purple-600'
                    onClick={() => addAuthorToBook(user.id)}>
                    <UserPlus className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      )}

      <div className='flex justify-end gap-2'>
        <Button variant='outline' onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
}
