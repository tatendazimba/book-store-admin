import { FC, useEffect, useRef, useState } from "react";
import { Search } from "../Search";
import { request } from "@/utils/request";
import { Box, Grid } from "@mui/joy";
import { BooksResponse } from "@/types/BooksResponse";
import { ImageCardVertical } from "../ImageCardVertical";
import { Book } from "@/types/Book";

type Props = {
    onSearch?: () => void,
    onFound?: () => void,
    onNotFound?: () => void,
}

export const SearchContainer: FC<Props> = (props) => {
    const abortControllerRef = useRef<AbortController | null>(null);
    const [searchResults, setSearchResults] = useState<BooksResponse | null>(null);

    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const onChange = async (value: string) => {
        try {
            if (!value) {
                setSearchResults(null);
                return;
            };

            setSearchResults(null);

            const baseUrl = `${process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_URL}volumes?q=${value}`;

            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            const newAbortController = new AbortController();

            abortControllerRef.current = newAbortController;

            const response = await request('get', baseUrl, null, newAbortController.signal);

            if (!response) {
                return;
            }

            const booksResponse: BooksResponse = {
                kind: response.kind,
                totalItems: response.totalItems,
                items: response.items.map((item: any) => ({
                    authors: item.volumeInfo.authors,
                    barcodes: item.volumeInfo.industryIdentifiers?.map((barcode: any) => ({
                        type: barcode.type,
                        identifier: barcode.identifier,
                    })) || [],
                    categories: item.volumeInfo.categories,
                    description: item.volumeInfo.description,
                    id: item.id,
                    image: item.volumeInfo.imageLinks?.thumbnail,
                    kind: item.kind,
                    pageCount: item.volumeInfo.pageCount,
                    publishedDate: item.volumeInfo.publishedDate,
                    publisher: item.volumeInfo.publisher,
                    searchInfo: item?.searchInfo?.textSnippet,
                    subtitle: item.volumeInfo.subtitle,
                    title: item.volumeInfo.title,
                })),
            };

            setSearchResults(booksResponse);
        } catch (error: any) {
            console.error('error', error);
        }
    }

    return (
        <Box>
            <Search
                onChange={onChange}
            />

            <Grid container>
                {
                    searchResults?.items.map((item: Book) => (
                        <Grid
                            key={item.id}
                            xs={6}
                        >
                            <ImageCardVertical
                                title={item.title}
                                description={item.description}
                                imageUrl={item.image}
                            />
                        </Grid>
                    ))
                }
            </Grid>
        </Box>

        
    )
}