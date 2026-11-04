import { makeAutoObservable, runInAction } from "mobx";
import { createLatestGuard } from "../../Shared/async/latestGuard";
import { withMinimumDuration } from "../../Shared/async/minimumDuration";
import {Book, BooksErrorI, BooksRepositoryI, BooksScope} from "../Books.type";

const MIN_LOADING_DURATION_MS = 120;

export class BooksListViewModel {
  books: Book[] = [];
  isLoading: boolean = false;
  scope: BooksScope = "all";
  privateBooksCount: number = 0;
  error: BooksErrorI | null = null;
  private readonly repository: BooksRepositoryI;
  private booksGuard = createLatestGuard();
  private privateCountGuard = createLatestGuard();

  constructor(booksRepository: BooksRepositoryI) {
    this.repository = booksRepository;
    makeAutoObservable<this, "repository" | "booksGuard" | "privateCountGuard">(this, {
      repository: false,
      booksGuard: false,
      privateCountGuard: false,
    });
  }

  get isEmpty(): boolean {
    return !this.isLoading && !this.error && this.books.length === 0;
  }

  loadBooks = async (): Promise<void> => {
    const isStale = this.booksGuard();
    this.isLoading = true;
    const result = await withMinimumDuration(
      this.repository.getBooks(this.scope),
      MIN_LOADING_DURATION_MS
    );
    runInAction(() => {
      if (isStale()) {
        return;
      }
      if (result.ok) {
        this.books = result.value;
        this.error = null;
      } else {
        // Previously loaded books are intentionally kept on failure.
        this.error = result.error;
      }
      this.isLoading = false;
    });
  };

  refreshPrivateCount = async (): Promise<void> => {
    if (this.scope === "private" && !this.isLoading) {
      this.privateBooksCount = this.books.length;
      return;
    }
    const isStale = this.privateCountGuard();
    const result = await this.repository.getBooks("private");
    runInAction(() => {
      if (!isStale() && result.ok) {
        this.privateBooksCount = result.value.length;
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
