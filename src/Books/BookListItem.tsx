import React from "react";
import { Book } from "./Books.repository";

export interface BookListItemProps {
  book: Book;
}

export const BookListItem = ({ book }: BookListItemProps) => {
  return (
    <li className="px-4 py-3 border-b border-gray-200 text-gray-900 hover:bg-gray-50 transition-colors">
      {book.author}: {book.name}
    </li>
  );
};

export default BookListItem;
