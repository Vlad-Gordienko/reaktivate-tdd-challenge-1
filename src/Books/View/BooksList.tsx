import React from "react";
import { observer } from "mobx-react";
import { BooksListViewModel } from "../ViewModel/BooksList.viewModel";
import { BookListItem } from "./BookListItem";
import { BooksSkeletonList } from "./BooksSkeletonList";
import { BooksEmptyState } from "./BooksEmptyState";
import { BooksErrorState } from "./BooksErrorState";

export interface BooksListProps {
  viewModel: BooksListViewModel;
}

export const BooksList = observer(({ viewModel }: BooksListProps) => {
  if (viewModel.isLoading) {
    return <BooksSkeletonList />;
  }
  if (viewModel.error) {
    return <BooksErrorState errorKind={viewModel.error.type} />;
  }
  if (viewModel.isEmpty) {
    return <BooksEmptyState />;
  }
  return (
    <ul className="flex flex-col">
      {viewModel.books.map((book) => (
        <BookListItem key={book.id} book={book} />
      ))}
    </ul>
  );
});
