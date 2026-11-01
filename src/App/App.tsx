import React from "react";
import { observer } from "mobx-react";
import { BooksListViewModel } from "../Books/BooksList.viewModel";
import { BooksCreateViewModel } from "../Books/BooksCreate.viewModel";
import { BooksView } from "../Books/Books.view";
import { AppHeader } from "./AppHeader";

export interface AppProps {
  listViewModel: BooksListViewModel;
  createViewModel: BooksCreateViewModel;
}

export const App = observer(({ listViewModel, createViewModel }: AppProps) => {
  return (
    <>
      <AppHeader privateBooksCount={listViewModel.privateBooksCount} />
      <main className="mx-auto max-w-2xl px-4 py-6">
        <BooksView listViewModel={listViewModel} createViewModel={createViewModel} />
      </main>
    </>
  );
});

export default App;
