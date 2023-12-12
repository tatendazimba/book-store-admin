import { FC, PropsWithChildren, ReactElement, cloneElement, useEffect, useRef, useState } from "react";
import { request } from "@/utils/request";
import { Box, Grid, Typography } from "@mui/joy";
import { BooksResponse } from "@/types/BooksResponse";
import { ImageCardVertical } from "../ImageCardVertical";
import { Book } from "@/types/Book";

interface Props extends PropsWithChildren {
    onSearch?: () => void,
    onFound?: () => void,
    onNotFound?: () => void,
    onChange?: (value: string) => void,
    searchValue?: string,
    children: ReactElement,
}

type LoadingStates = 'idle' | 'pending' | 'complete' | 'error';

export const SearchContainer: FC<Props> = (props) => {
    const { searchValue, children, onChange } = props;

    const abortControllerRef = useRef<AbortController | null>(null);
    const [searchResults, setSearchResults] = useState<Book[] | null>([]);
    const [searching, setSearching] = useState<LoadingStates>('idle');

    useEffect(() => {
        if (searchValue) {
            search(searchValue);
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const search = async (value: string) => {
        try {
            setSearchResults(null);
            
            if (!value) {
                return;
            };

            setSearching('pending');

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
            
            const kind = response.kind;
            const totalItems = response.totalItems;

            const books: Book[] = response?.items?.map((item: any) => ({
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
            })) || [];

            setSearchResults(books);
            setSearching('complete');
        } catch (error: any) {
            console.error('error', error);
            setSearching('error');
        }
    }

    const handleChange = async (value: string) => {
        search(value);

        if (onChange) {
            onChange(value);
        }
    }

    return (
        <Box>
            {
                cloneElement(children, { onChange: handleChange })
            }

            <Grid container>
                {
                    searchResults?.map((item: Book) => (
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