import ApiGateway from "../Shared/ApiGateway";
import { HttpError } from "../Shared/HttpError";
import { HttpGateway } from "../Shared/HttpGateway";
import { NetworkError } from "../Shared/NetworkError";
import { USER_ID } from "../Shared/config";

export type BooksScope = "all" | "private";

const BOOKS_BASE_PATH = `/v1/books/${USER_ID}`;

// Raw shape of a book as returned by the server (DTO).
export interface BookDto {
  id?: number;
  name: string;
  author: string;
  ownerId: string;
}

// Domain model exposed by the Model layer to the ViewModel/View.
export interface Book {
  id: string;
  name: string;
  author: string;
}

export type BooksErrorType = "network" | "server" | "unknown";

export class BooksError extends Error {
  type: BooksErrorType;

  constructor(type: BooksErrorType, message?: string) {
    super(message ?? type);
    this.name = "BooksError";
    this.type = type;
    Object.setPrototypeOf(this, BooksError.prototype);
  }
}

function mapBookDtoToBook(dto: BookDto): Book {
  return {
    // Workaround: backend does not return an id for newly created books
    id: dto.id !== undefined ? String(dto.id) : crypto.randomUUID(),
    name: dto.name,
    author: dto.author,
  };
}

export class BooksRepository {
  httpGateway: HttpGateway;

  constructor(httpGateway: HttpGateway = new ApiGateway()) {
    this.httpGateway = httpGateway;
  }

  getBooks = async (scope: BooksScope = "all"): Promise<Book[]> => {
    const path = scope === "private" ? `${BOOKS_BASE_PATH}/private` : `${BOOKS_BASE_PATH}`;
    let booksDto: BookDto[];
    try {
      booksDto = await this.httpGateway.get(path);
    } catch (error) {
      if (error instanceof HttpError) {
        throw new BooksError("server", error.message);
      }
      if (error instanceof NetworkError) {
        throw new BooksError("network", error.message);
      }
      throw new BooksError("unknown", error instanceof Error ? error.message : undefined);
    }
    return booksDto.map(mapBookDtoToBook);
  };

  addBook = async ({ name, author }: { name: string; author: string }): Promise<boolean> => {
    try {
      const bookAddDto = await this.httpGateway.post(`${BOOKS_BASE_PATH}`, { name, author });
      return !!(bookAddDto && bookAddDto.status === "ok");
    } catch {
      // add book contract is boolean
      return false;
    }
  };
}

const booksRepository = new BooksRepository();
export default booksRepository;
