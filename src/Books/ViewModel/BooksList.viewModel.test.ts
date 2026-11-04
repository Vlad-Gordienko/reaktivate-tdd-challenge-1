import { BooksListViewModel } from "./BooksList.viewModel";
import { createDeferred, createMockBooksRepository, flushPromises } from "../../testUtils";
import {Book, BooksResult} from "../Books.type";

const ok = <T>(value: T): BooksResult<T> => ({ ok: true, value });

const sampleBooks: Book[] = [
  { id: "1", name: "Clean Code", author: "Robert C. Martin" },
  { id: "2", name: "Refactoring", author: "Martin Fowler" },
];

const threePrivateBooks: Book[] = [
  { id: "10", name: "Private One", author: "X" },
  { id: "11", name: "Private Two", author: "Y" },
  { id: "12", name: "Private Three", author: "Z" },
];

describe("BooksListViewModel", () => {
  let mockRepository: ReturnType<typeof createMockBooksRepository>;
  let viewModel: BooksListViewModel;

  beforeEach(() => {
    mockRepository = createMockBooksRepository();
    viewModel = new BooksListViewModel(mockRepository);
  });

  it("loadBooks populates books with the fetched result", async () => {
    mockRepository.getBooks.mockResolvedValueOnce(ok(sampleBooks));

    await viewModel.loadBooks();

    expect(viewModel.books).toEqual(sampleBooks);
  });

  it("loadBooks toggles isLoading around the request", async () => {
    const deferred = createDeferred<BooksResult<Book[]>>();
    mockRepository.getBooks.mockReturnValueOnce(deferred.promise);

    const call = viewModel.loadBooks();
    expect(viewModel.isLoading).toBe(true);

    deferred.resolve(ok(sampleBooks));
    await call;

    expect(viewModel.isLoading).toBe(false);
  });

  it("discards a stale loadBooks response when a newer call has started", async () => {
    const firstBooks: Book[] = [{ id: "1", name: "First", author: "A" }];
    const secondBooks: Book[] = [{ id: "2", name: "Second", author: "B" }];
    const deferred1 = createDeferred<BooksResult<Book[]>>();
    const deferred2 = createDeferred<BooksResult<Book[]>>();
    mockRepository.getBooks
      .mockReturnValueOnce(deferred1.promise)
      .mockReturnValueOnce(deferred2.promise);

    const call1 = viewModel.loadBooks();
    const call2 = viewModel.loadBooks();

    deferred2.resolve(ok(secondBooks));
    await call2;
    deferred1.resolve(ok(firstBooks));
    await call1;

    expect(viewModel.books).toEqual(secondBooks);
    expect(viewModel.isLoading).toBe(false);
  });

  it("setScope to a different scope updates scope and triggers loadBooks", async () => {
    mockRepository.getBooks.mockResolvedValue(ok(sampleBooks));

    viewModel.setScope("private");
    await flushPromises();

    expect(viewModel.scope).toBe("private");
    expect(mockRepository.getBooks).toHaveBeenCalledWith("private");
    expect(viewModel.books).toEqual(sampleBooks);
  });

  it("setScope to the current scope is a no-op", async () => {
    mockRepository.getBooks.mockResolvedValue(ok(sampleBooks));

    viewModel.setScope("private");
    await flushPromises();
    mockRepository.getBooks.mockClear();


    viewModel.setScope("private");

    expect(mockRepository.getBooks).not.toHaveBeenCalled();
    expect(viewModel.scope).toBe("private");
  });

  it("refreshPrivateCount reuses the list fetch after switching to private (one total getBooks call)", async () => {
    mockRepository.getBooks.mockResolvedValue(ok(threePrivateBooks));

    viewModel.setScope("all");
    await flushPromises();
    mockRepository.getBooks.mockClear();

    viewModel.setScope("private");
    await flushPromises();
    expect(viewModel.isLoading).toBe(false);

    await viewModel.refreshPrivateCount();

    expect(mockRepository.getBooks).toHaveBeenCalledTimes(1);
    expect(mockRepository.getBooks).toHaveBeenCalledWith("private");
    expect(viewModel.privateBooksCount).toBe(threePrivateBooks.length);
  });

  it("refreshPrivateCount on scope 'all' fetches private books and sets the count", async () => {
    mockRepository.getBooks.mockImplementation((scope: string) =>
      Promise.resolve(ok(scope === "private" ? threePrivateBooks : []))
    );

    await viewModel.refreshPrivateCount();

    expect(viewModel.privateBooksCount).toBe(3);
    expect(mockRepository.getBooks).toHaveBeenCalledWith("private");
  });
});
