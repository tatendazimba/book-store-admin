"use client";

import { ScanditScanner } from "@/components/shared/Scanner";
import { Box } from "@mui/joy";

import styles from './styles.module.scss';
import { SearchContainer } from "@/components/shared/SearchContainer";
import { Search } from "@/components/shared/Search";
import { useState } from "react";

export default function Scanner() {
    const [barcode, setBarcode] = useState('');

    const onFound = (barcode: string) => {
        setBarcode(barcode);
    };

    return (
        <main>
            <Box>
                <ScanditScanner
                    onFound={onFound}
                />
                <Box
                    className={styles.search_container}
                >
                    <SearchContainer
                        key={barcode}
                        searchValue={barcode}
                        onChange={onFound}
                    >
                        <Search value={barcode} key={barcode}/>
                    </SearchContainer>
                </Box>
            </Box>
        </main>
    )
}