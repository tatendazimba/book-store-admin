import { Close, QrCode } from '@mui/icons-material';
import { Box, Input, Stack } from '@mui/joy';
import Link from 'next/link';
import * as React from 'react';

type Props = {
    value?: string;
    onChange?: (value: string) => void;
};

export const Search: React.FC<Props> = ({ value, onChange }) => {
    const [searchValue, setSearchValue] = React.useState(value || '');

    const handleChange = (newInput: string) => {
        setSearchValue(newInput);

        if (onChange) {
            onChange(newInput);
        }
    }
    
    return (
        <Box className="Search">
            <Input
                className="Search__input"
                type="text"
                value={searchValue}
                onChange={(e) => handleChange(e.target.value)}
                endDecorator={
                    <Stack
                        direction="row"
                        spacing={0.5}
                        alignItems="center"
                    >
                        <a
                            style={{
                                height: '24px',
                            }}
                        >
                            <Close
                                sx={{
                                    cursor: 'pointer',
                                    visibility: searchValue ? 'visible' : 'hidden',
                                }}
                                onClick={() => handleChange('')}
                            />
                        </a>
                        <Link
                            href={'/scanner'}
                            style={{
                                height: '24px',
                            }}
                        >
                            <QrCode
                                sx={{
                                    cursor: 'pointer',
                                }}
                            />
                        </Link>
                    </Stack>
                }
            />
        </Box>
    );
}