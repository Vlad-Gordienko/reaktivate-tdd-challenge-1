import React from "react";
import { observer } from "mobx-react";
import { BooksListViewModel } from "./BooksList.viewModel";
import { BooksCreateViewModel } from "./BooksCreate.viewModel";
import { BookCreateForm } from "./BookCreateForm";
import { BooksScopeTabs } from "./BooksScopeTabs";
import { BooksList } from "./BooksList";

interface BooksViewProps {
  listViewModel: BooksListViewModel;
  createViewModel: BooksCreateViewModel;
}

export const BooksView = observer(({ listViewModel, createViewModel }: BooksViewProps) => {
  return (
    <div className="flex flex-col gap-6">
      <BookCreateForm viewModel={createViewModel} />
      <BooksScopeTabs viewModel={listViewModel} />
      <BooksList viewModel={listViewModel} />
    </div>
  );
});

export default BooksView;
