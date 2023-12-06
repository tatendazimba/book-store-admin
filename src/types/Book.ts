import { Barcode } from "./Barcode";

export interface Book {
    authors: string[];
    barcodes: Barcode[];
    categories: string[];
    description: string;
    id: string;
    image?: string;
    kind: string;
    pageCount: number;
    publishedDate: string;
    publisher: string;
    searchInfo?: string;
    subtitle: string;
    title: string;
}