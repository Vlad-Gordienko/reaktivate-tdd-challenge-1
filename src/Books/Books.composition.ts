import { BooksListViewModel } from "./ViewModel/BooksList.viewModel";
import { BooksCreateViewModel } from "./ViewModel/BooksCreate.viewModel";
import { Book, BooksScope } from "./Books.repository";

export interface BooksRepositoryDependency {
  getBooks: (scope?: BooksScope) => Promise<Book[]>;
  addBook: (payload: { name: string; author: string }) => Promise<boolean>;
}

export function createBooksViewModels(repository: BooksRepositoryDependency) {
  const listViewModel = new BooksListViewModel(repository);

  const fetchAll = (): void => {
    listViewModel.loadBooks();
    listViewModel.refreshPrivateCount();
  };

  const createViewModel = new BooksCreateViewModel(repository, fetchAll);

  return { listViewModel, createViewModel, fetchAll };
}
