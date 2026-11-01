import { BooksRepository } from "./Books.repository";
import ApiGateway from "../Shared/Http/ApiGateway";

function createFakeGateway(): jest.Mocked<ApiGateway> {
  return {
    get: jest.fn(),
    post: jest.fn(),
  } as unknown as jest.Mocked<ApiGateway>;
}

describe("BooksRepository.addBook", () => {
  let fakeGateway: jest.Mocked<ApiGateway>;
  let repository: BooksRepository;

  beforeEach(() => {
    fakeGateway = createFakeGateway();
    repository = new BooksRepository(fakeGateway);
  });

  const newBook = { name: "Some Name", author: "Some Author" };

  it("resolves to true when the gateway responds with status ok", async () => {
    fakeGateway.post.mockResolvedValueOnce({ status: "ok" });
    await expect(repository.addBook(newBook)).resolves.toBe(true);
  });

  it("resolves to false when the gateway responds with a non-ok status", async () => {
    fakeGateway.post.mockResolvedValueOnce({ status: "error" });
    await expect(repository.addBook(newBook)).resolves.toBe(false);
  });

  it("resolves to false when the gateway responds with undefined or null", async () => {
    fakeGateway.post.mockResolvedValueOnce(undefined);
    await expect(repository.addBook(newBook)).resolves.toBe(false);

    fakeGateway.post.mockResolvedValueOnce(null);
    await expect(repository.addBook(newBook)).resolves.toBe(false);
  });
});
