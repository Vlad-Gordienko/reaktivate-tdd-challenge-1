import { BooksListViewModel } from "./ViewModel/BooksList.viewModel";
import { BooksCreateViewModel } from "./ViewModel/BooksCreate.viewModel";
import {BooksRepositoryI} from "./Books.type";

export function createBooksViewModels(repository: BooksRepositoryI) {
  const listViewModel = new BooksListViewModel(repository);

  const fetchAll = async (): Promise<void> => {
    await listViewModel.loadBooks();
    await listViewModel.refreshPrivateCount();
  };

  const createViewModel = new BooksCreateViewModel(repository, fetchAll);

  return { listViewModel, createViewModel, fetchAll };
}
