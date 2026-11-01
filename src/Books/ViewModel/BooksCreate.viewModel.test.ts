import { BooksCreateViewModel } from "./BooksCreate.viewModel";
import { createDeferred } from "../../testUtils";

describe("BooksCreateViewModel", () => {
  let mockRepository: { addBook: jest.Mock };
  let onBookAdded: jest.Mock;
  let viewModel: BooksCreateViewModel;

  beforeEach(() => {
    mockRepository = { addBook: jest.fn() };
    onBookAdded = jest.fn();
    viewModel = new BooksCreateViewModel(mockRepository, onBookAdded);
  });

  test.each([
    ["", "Author"],
    ["Name", ""],
    ["", ""],
    ["   ", "   "],
    ["<b></b>", "<i></i>"],
  ])("rejects name author as invalid", async (name, author) => {
    viewModel.setName(name);
    viewModel.setAuthor(author);

    await viewModel.submitNewBook();

    expect(viewModel.formError).toBe("Name and author are required");
    expect(mockRepository.addBook).not.toHaveBeenCalled();
  });

  test("calls addBook with trimmed and sanitized values", async () => {
    mockRepository.addBook.mockResolvedValue(true);
    viewModel.setName("  <b>Jane</b>  ");
    viewModel.setAuthor("  Doe  ");

    await viewModel.submitNewBook();

    expect(mockRepository.addBook).toHaveBeenCalledTimes(1);
    expect(mockRepository.addBook).toHaveBeenCalledWith({
      name: "Jane",
      author: "Doe",
    });
  });

  test("resets the form after a successful add", async () => {
    mockRepository.addBook.mockResolvedValue(true);
    viewModel.setName("Jane");
    viewModel.setAuthor("Doe");

    await viewModel.submitNewBook();

    expect(viewModel.name).toBe("");
    expect(viewModel.author).toBe("");
  });

  test("calls onBookAdded after a successful add", async () => {
    mockRepository.addBook.mockResolvedValue(true);
    viewModel.setName("Jane");
    viewModel.setAuthor("Doe");

    await viewModel.submitNewBook();

    expect(onBookAdded).toHaveBeenCalledTimes(1);
  });

  test("does not reset the form when the add fails", async () => {
    mockRepository.addBook.mockResolvedValue(false);
    viewModel.setName("Jane");
    viewModel.setAuthor("Doe");

    await viewModel.submitNewBook();

    expect(viewModel.name).toBe("Jane");
    expect(viewModel.author).toBe("Doe");
  });

  test("does not call onBookAdded when the add fails", async () => {
    mockRepository.addBook.mockResolvedValue(false);
    viewModel.setName("Jane");
    viewModel.setAuthor("Doe");

    await viewModel.submitNewBook();

    expect(onBookAdded).not.toHaveBeenCalled();
  });

  test("isSubmitting is true while the request is in flight and false after", async () => {
    const deferred = createDeferred<boolean>();
    mockRepository.addBook.mockReturnValue(deferred.promise);
    viewModel.setName("Jane");
    viewModel.setAuthor("Doe");

    const submitPromise = viewModel.submitNewBook();
    expect(viewModel.isSubmitting).toBe(true);

    deferred.resolve(true);
    await submitPromise;

    expect(viewModel.isSubmitting).toBe(false);
  });

  test("isSubmitting resets to false when addBook throws", async () => {
    mockRepository.addBook.mockRejectedValueOnce(new Error("network error"));
    viewModel.setName("Jane");
    viewModel.setAuthor("Doe");

    await expect(viewModel.submitNewBook()).rejects.toThrow("network error");

    expect(viewModel.isSubmitting).toBe(false);
  });

  test("a second submit while the first is in flight does not call addBook again", async () => {
    const deferred = createDeferred<boolean>();
    mockRepository.addBook.mockReturnValue(deferred.promise);
    viewModel.setName("Jane");
    viewModel.setAuthor("Doe");

    const call1 = viewModel.submitNewBook();
    const call2 = viewModel.submitNewBook();

    expect(mockRepository.addBook).toHaveBeenCalledTimes(1);

    deferred.resolve(true);
    await Promise.all([call1, call2]);
  });

  test("setName clears an existing validation error", async () => {
    await viewModel.submitNewBook();
    expect(viewModel.formError).toBe("Name and author are required");

    viewModel.setName("something");

    expect(viewModel.formError).toBeNull();
  });

  test("setAuthor clears an existing validation error", async () => {
    await viewModel.submitNewBook();
    expect(viewModel.formError).toBe("Name and author are required");

    viewModel.setAuthor("something");

    expect(viewModel.formError).toBeNull();
  });
});
