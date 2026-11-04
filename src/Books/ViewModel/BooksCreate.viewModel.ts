import { makeAutoObservable, runInAction } from "mobx";
import { sanitizeText } from "../../Shared/sanitize";
import { withMinimumDuration } from "../../Shared/async/minimumDuration";

import {BooksRepositoryI} from "../Books.type";

const MIN_SUBMITTING_DURATION_MS = 120;

export class BooksCreateViewModel {
  name: string = "";
  author: string = "";
  isSubmitting: boolean = false;
  formError: string | null = null;
  private readonly repository: BooksRepositoryI;
  private readonly onBookAdded: () => void;

  constructor(booksRepository: BooksRepositoryI, onBookAdded: () => void) {
    this.repository = booksRepository;
    this.onBookAdded = onBookAdded;
    makeAutoObservable<this, "repository" | "onBookAdded">(this, {
      repository: false,
      onBookAdded: false,
    });
  }

  setName = (value: string): void => {
    this.name = value;
    this.formError = null;
  };

  setAuthor = (value: string): void => {
    this.author = value;
    this.formError = null;
  };

  submitNewBook = async (): Promise<void> => {
    if (this.isSubmitting) {
      return;
    }

    const trimmedName = sanitizeText(this.name.trim());
    const trimmedAuthor = sanitizeText(this.author.trim());
    if (!trimmedName || !trimmedAuthor) {
      this.formError = "Name and author are required";
      return;
    }

    this.formError = null;
    this.isSubmitting = true;
    try {
      const added = await withMinimumDuration(
        this.repository.addBook({
          name: trimmedName,
          author: trimmedAuthor,
        }),
        MIN_SUBMITTING_DURATION_MS
      );
      runInAction(() => {
        if (added) {
          this.name = "";
          this.author = "";
        } else {
          this.formError = "Failed to add the book. Please try again.";
        }
      });
      if (added) {
        this.onBookAdded();
      }
    } finally {
      runInAction(() => {
        this.isSubmitting = false;
      });
    }
  };
}
