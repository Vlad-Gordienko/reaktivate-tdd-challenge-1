import { makeAutoObservable, runInAction } from "mobx";
import { sanitizeText } from "../Shared/sanitize";

export class BooksCreateViewModel {
  name: string = "";
  author: string = "";
  isSubmitting: boolean = false;
  validationError: string | null = null;
  repository: {
    addBook: (payload: { name: string; author: string }) => Promise<boolean>;
  };
  private onBookAdded: () => void;

  constructor(
    booksRepository: {
      addBook: (payload: { name: string; author: string }) => Promise<boolean>;
    },
    onBookAdded: () => void
  ) {
    this.repository = booksRepository;
    this.onBookAdded = onBookAdded;
    makeAutoObservable(this);
  }

  setName = (value: string): void => {
    this.name = value;
    this.validationError = null;
  };

  setAuthor = (value: string): void => {
    this.author = value;
    this.validationError = null;
  };

  submitNewBook = async (): Promise<void> => {
    if (this.isSubmitting) {
      return;
    }

    const trimmedName = sanitizeText(this.name.trim());
    const trimmedAuthor = sanitizeText(this.author.trim());
    if (!trimmedName || !trimmedAuthor) {
      this.validationError = "Name and author are required";
      return;
    }

    this.validationError = null;
    this.isSubmitting = true;
    try {
      const added = await this.repository.addBook({
        name: trimmedName,
        author: trimmedAuthor,
      });
      runInAction(() => {
        if (added) {
          this.name = "";
          this.author = "";
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

export default BooksCreateViewModel;
