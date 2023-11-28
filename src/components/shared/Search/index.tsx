import { Box, Input } from '@mui/joy';
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
            />
        </Box>
    );
}