import EditionBooksPage, { Book, Edition } from "./EditionBooksPage";

export default async function EditionBooksPageWrapper({
  params,
}: {
  params: { id: string };
}) {
  const editionId = params.id;
  // Aquí debes obtener el userId; en un componente servidor podrías tener acceso a los cookies o alguna sesión.
  // Supondré que tienes un método para obtenerlo, o lo defines como una variable de ejemplo.
  const userId = "123456789X"; // Ejemplo, reemplázalo según corresponda.

  // Fetch de todos los libros del usuario
  const booksRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/publications?userId=${userId}`
  );
  const allBooks: Book[] = await booksRes.json();

  // Filtrar en el servidor para obtener solo los libros que pertenecen a esta edición
  const initialBooks = allBooks.filter((book) => book.editionId === editionId);

  // Fetch de los detalles de la edición
  const editionRes = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/editions/${editionId}`
  );
  const initialEdition: Edition = await editionRes.json();

  return (
    <EditionBooksPage
      initialBooks={initialBooks}
      initialEdition={initialEdition}
    />
  );
}
