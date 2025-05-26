// app/(protected)/books/[bookId]/my-chapters/[chapterId]/edit/page.tsx
"use client";

import { useParams } from "next/navigation";
import ChapterForm from "@/components/chapter-form";

export default function EditPersonalChapterPage() {
  const { bookId, chapterId } = useParams();

  return (
    <ChapterForm
      mode='edit'
      bookId={bookId as string}
      chapterId={chapterId as string}
      // no editionId
    />
  );
}
