import { createBooksViewModels } from "./Books.composition";
import { flushPromises } from "../testUtils";
import {Book} from "./Books.type";

describe("createBooksViewModels", () => {
  it("refreshes the list and private count after a successful book creation", async () => {
    const initialBooks: Book[] = [{ id: "1", name: "Existing Book", author: "Someone" }];
    const updatedBooks: Book[] = [
      ...initialBooks,
      { id: "2", name: "New Book", author: "New Author" },
    ];

    const mockRepository = {
      getBooks: jest.fn(),
      addBook: jest.fn(),
    };

    mockRepository.getBooks.mockResolvedValue({ ok: true, value: updatedBooks });
    mockRepository.addBook.mockResolvedValue(true);

    const { listViewModel, createViewModel } = createBooksViewModels(mockRepository);

    createViewModel.setName("New Book");
    createViewModel.setAuthor("New Author");

    await createViewModel.submitNewBook();
    await flushPromises();

    expect(mockRepository.addBook).toHaveBeenCalledWith({
      name: "New Book",
      author: "New Author",
    });
    expect(listViewModel.books).toEqual(updatedBooks);
    expect(listViewModel.privateBooksCount).toBe(updatedBooks.length);
  });
});
