"use client";

import { useParams } from "next/navigation";
import ChapterForm from "../../../../../../../../../components/chapter-form";

export default function EditChapterPage() {
  const { editionId, bookId, chapterId } = useParams();

  return (
    <ChapterForm
      mode='edit'
      chapterId={chapterId as string}
      editionId={editionId as string}
      bookId={bookId as string}
    />
  );
}
