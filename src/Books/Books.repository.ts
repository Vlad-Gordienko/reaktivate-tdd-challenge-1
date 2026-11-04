import ApiGateway from "../Shared/Http/ApiGateway";
import {HttpError} from "../Shared/Http/HttpError";
import {HttpGateway} from "../Shared/Http/HttpGateway";
import {NetworkError} from "../Shared/Http/NetworkError";
import {USER_ID} from "../Shared/config";
import {Book, BookDto, BooksErrorI, BooksErrorType, BooksRepositoryI, BooksResult, BooksScope} from "./Books.type";
import {mapBookDtoToBook} from "./Books.utils";

const BOOKS_BASE_PATH = `/v1/books/${USER_ID}`;

export class BooksError extends Error implements BooksErrorI {
  type: BooksErrorType;

  constructor(type: BooksErrorType, message?: string) {
    super(message ?? type);
    this.name = "BooksError";
    this.type = type;
    Object.setPrototypeOf(this, BooksError.prototype);
  }
}

export class BooksRepository implements BooksRepositoryI {
  private readonly httpGateway: HttpGateway;

  constructor(httpGateway: HttpGateway = new ApiGateway()) {
    this.httpGateway = httpGateway;
  }

  getBooks = async (scope: BooksScope = "all"): Promise<BooksResult<Book[]>> => {
    const path = scope === "private" ? `${BOOKS_BASE_PATH}/private` : BOOKS_BASE_PATH;
    try {
      const booksDto = await this.httpGateway.get<BookDto[]>(path);
      return { ok: true, value: booksDto.map(mapBookDtoToBook) };
    } catch (error) {
      if (error instanceof HttpError) {
        return { ok: false, error: new BooksError("server", error.message) };
      }
      if (error instanceof NetworkError) {
        return { ok: false, error: new BooksError("network", error.message) };
      }
      return { ok: false, error: new BooksError("unknown", error instanceof Error ? error.message : undefined) };
    }
  };

  addBook = async ({ name, author }: { name: string; author: string }): Promise<boolean> => {
    try {
      const bookAddDto = await this.httpGateway.post<{ status: string }>(BOOKS_BASE_PATH, { name, author });
      return (bookAddDto && bookAddDto.status === "ok");
    } catch {
      // add book contract is boolean
      return false;
    }
  };
}

const booksRepository = new BooksRepository();
export default booksRepository;
