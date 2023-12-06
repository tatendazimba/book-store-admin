import { Book } from "./Book";

export interface BooksResponse {
    kind: string;
    totalItems: number;
    items: Book[];
}