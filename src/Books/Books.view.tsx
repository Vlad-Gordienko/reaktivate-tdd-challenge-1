import React from "react";
import { observer } from "mobx-react";
import { BooksListViewModel } from "./BooksList.viewModel";
import { BooksCreateViewModel } from "./BooksCreate.viewModel";

interface BooksViewProps {
  listViewModel: BooksListViewModel;
  createViewModel: BooksCreateViewModel;
}

export const BooksView = observer(({ listViewModel, createViewModel }: BooksViewProps) => {
  return (
    <div>
      <div>Your books: {listViewModel.privateBooksCount}</div>
      <div>
        <button onClick={() => listViewModel.setScope("all")}>All books</button>
        <button onClick={() => listViewModel.setScope("private")}>Private books</button>
      </div>
      {listViewModel.isLoading ? (
        <div>Loading...</div>
      ) : (
        listViewModel.books.map((book) => (
          <div key={book.id}>
            {book.author}: {book.name}
          </div>
        ))
      )}
      <div>
        <input
          type="text"
          value={createViewModel.name}
          disabled={createViewModel.isSubmitting}
          onChange={(e) => createViewModel.setName(e.target.value)}
        />
        <input
          type="text"
          value={createViewModel.author}
          disabled={createViewModel.isSubmitting}
          onChange={(e) => createViewModel.setAuthor(e.target.value)}
        />
        <button
          type="button"
          disabled={createViewModel.isSubmitting}
          onClick={() => createViewModel.submitNewBook()}
        >
          Add
        </button>
        {createViewModel.isSubmitting && <span>Loading...</span>}
        {createViewModel.validationError && <div>{createViewModel.validationError}</div>}
      </div>
    </div>
  );
});

export default BooksView;
