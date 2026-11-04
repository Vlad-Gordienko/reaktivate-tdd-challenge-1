// Raw shape of a book as returned by the server (DTO).

export interface BookDto {
    id?: number;
    name: string;
    author: string;
    ownerId: string;
}

// Domain model exposed by the Model layer to the ViewModel/View.
export interface Book {
    id: string;
    name: string;
    author: string;
}

export type BooksScope = "all" | "private";

export type BooksErrorType = "network" | "server" | "unknown";

export interface BooksErrorI extends Error {
    type: BooksErrorType;
}

export type BooksResult<T> =
    | { ok: true; value: T }
    | { ok: false; error: BooksErrorI };

export interface BooksRepositoryI {
    getBooks(scope?: BooksScope): Promise<BooksResult<Book[]>>;

    addBook(payload: { name: string; author: string }): Promise<boolean>;
}