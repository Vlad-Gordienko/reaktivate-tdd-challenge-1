import {Book, BookDto} from "./Books.type";

export function mapBookDtoToBook(dto: BookDto): Book {
    return {
        // Workaround: backend does not return an id for newly created books
        id: dto.id !== undefined ? String(dto.id) : crypto.randomUUID(),
        name: dto.name,
        author: dto.author,
    };
}