import { makeAutoObservable, runInAction } from "mobx";
import { Book, BooksScope } from "./Books.repository";
import { createLatestGuard } from "../Shared/latestGuard";

export class BooksListViewModel {
  books: Book[] = [];
  isLoading: boolean = false;
  scope: BooksScope = "all";
  privateBooksCount: number = 0;
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

  loadBooks = async (): Promise<void> => {
    const isStale = this.booksGuard();
    this.isLoading = true;
    const books = await this.repository.getBooks(this.scope);
    runInAction(() => {
      if (!isStale()) {
        this.books = books;
        this.isLoading = false;
      }
    });
  };

  refreshPrivateCount = async (): Promise<void> => {
    if (this.scope === "private" && !this.isLoading) {
      this.privateBooksCount = this.books.length;
      return;
    }
    const isStale = this.privateCountGuard();
    const privateBooks = await this.repository.getBooks("private");
    runInAction(() => {
      if (!isStale()) {
        this.privateBooksCount = privateBooks.length;
      }
    });
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
