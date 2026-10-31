import ApiGateway from "../Shared/ApiGateway";
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

function mapBookDtoToBook(dto: BookDto): Book {
  return {
    // Workaround: backend does not return an id for newly created books
    id: dto.id !== undefined ? String(dto.id) : crypto.randomUUID(),
    name: dto.name,
    author: dto.author,
  };
}

class BooksRepository {
  httpGateway: ApiGateway;

  constructor() {
    this.httpGateway = new ApiGateway();
  }

  getBooks = async (scope: BooksScope = "all"): Promise<Book[]> => {
    const path = scope === "private" ? `${BOOKS_BASE_PATH}/private` : `${BOOKS_BASE_PATH}`;
    const booksDto: BookDto[] = await this.httpGateway.get(path);
    return booksDto.map(mapBookDtoToBook);
  };

  addBook = async ({ name, author }: { name: string; author: string }): Promise<boolean> => {
    const bookAddDto = await this.httpGateway.post(`${BOOKS_BASE_PATH}`, { name, author });
    return !!(bookAddDto && bookAddDto.status === "ok");
  };
}

const booksRepository = new BooksRepository();
export default booksRepository;
