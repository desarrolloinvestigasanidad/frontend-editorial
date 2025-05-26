"use client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import AuthorInvitationDialog from "../../../../../../books/[bookId]/submit-chapter/author-invitation-dialog";
import ChapterForm from "../../../../../../../../components/chapter-form";

export default function CreateChapterPage() {
  const { editionId, bookId } = useParams();

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header with co-author button */}
      <header className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold text-primary'>
          Crear nuevo capítulo
        </h1>
        <AuthorInvitationDialog
          bookId={bookId as string}
          onAuthorAdded={() => console.log("Coautor añadido")}
          trigger={
            <Button
              variant='outline'
              className='border border-primary/30 text-primary hover:bg-primary/10'>
              <UserPlus className='h-4 w-4 mr-2' />
              Añadir coautor
            </Button>
          }
        />
      </header>

      {/* Chapter Form */}
      <ChapterForm
        mode='create'
        editionId={editionId as string}
        bookId={bookId as string}
      />
    </div>
  );
}
