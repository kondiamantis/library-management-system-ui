export interface Book {
    id?: number;
    title: string;
    author: string;
    isbn: string;
    publicationYear: number | null;
    genre: string;
    description?: string;
    coverUrl?: string;
    totalCopies: number;
    availableCopies: number;
  }