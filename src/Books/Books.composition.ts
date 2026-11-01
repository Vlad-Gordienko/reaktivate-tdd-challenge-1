import { BooksListViewModel } from "./ViewModel/BooksList.viewModel";
import { BooksCreateViewModel } from "./ViewModel/BooksCreate.viewModel";
import { BooksCreateRepository, BooksListRepository } from "./Books.repository";

export type BooksRepositoryDependency = BooksListRepository & BooksCreateRepository;

export function createBooksViewModels(repository: BooksRepositoryDependency) {
  const listViewModel = new BooksListViewModel(repository);

  const fetchAll = (): void => {
    listViewModel.loadBooks();
    listViewModel.refreshPrivateCount();
  };

  const createViewModel = new BooksCreateViewModel(repository, fetchAll);

  return { listViewModel, createViewModel, fetchAll };
}
