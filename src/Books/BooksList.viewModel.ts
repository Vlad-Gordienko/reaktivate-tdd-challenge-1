import { makeAutoObservable, runInAction } from "mobx";
import { Book, BooksError, BooksScope } from "./Books.repository";
import { createLatestGuard } from "../Shared/latestGuard";
import { withMinimumDuration } from "../Shared/minimumDuration";

function toBooksError(error: unknown): BooksError {
  if (error instanceof BooksError) {
    return error;
  }
  return new BooksError("unknown", error instanceof Error ? error.message : undefined);
}

const MIN_LOADING_DURATION_MS = 120;

export class BooksListViewModel {
  books: Book[] = [];
  isLoading: boolean = false;
  scope: BooksScope = "all";
  privateBooksCount: number = 0;
  error: BooksError | null = null;
  repository: {
    getBooks: (scope?: BooksScope) => Promise<Book[]>;
  };
  private booksGuard = createLatestGuard();
  private privateCountGuard = createLatestGuard();

  constructor(booksRepository: {
    getBooks: (scope?: BooksScope) => Promise<Book[]>;
  }) {
    this.repository = booksRepository;
    makeAutoObservable(this);
  }

  get isEmpty(): boolean {
    return !this.isLoading && !this.error && this.books.length === 0;
  }

  loadBooks = async (): Promise<void> => {
    const isStale = this.booksGuard();
    this.isLoading = true;
    try {
      const books = await withMinimumDuration(
        this.repository.getBooks(this.scope),
        MIN_LOADING_DURATION_MS
      );
      runInAction(() => {
        if (!isStale()) {
          this.books = books;
          this.error = null;
          this.isLoading = false;
        }
      });
    } catch (error) {
      runInAction(() => {
        if (!isStale()) {
          // Previously loaded books are intentionally kept on failure.
          this.error = toBooksError(error);
          this.isLoading = false;
        }
      });
    }
  };

  refreshPrivateCount = async (): Promise<void> => {
    if (this.scope === "private" && !this.isLoading) {
      this.privateBooksCount = this.books.length;
      return;
    }
    const isStale = this.privateCountGuard();
    try {
      const privateBooks = await this.repository.getBooks("private");
      runInAction(() => {
        if (!isStale()) {
          this.privateBooksCount = privateBooks.length;
        }
      });
    } catch {}
  };

  setScope = (scope: BooksScope): void => {
    if (this.scope === scope) {
      return;
    }
    this.scope = scope;
    this.loadBooks();
  };
}

export default BooksListViewModel;
