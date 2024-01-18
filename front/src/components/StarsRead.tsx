import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

interface StarsReadProps {
    id: string;
}

export default function Stars({id}: StarsReadProps) {
    const [value, setValue] = useState<number | null>(2);
    
    useEffect(() => {
        fetch(`http://localhost:5000/getAverageRating/${id}`)
        .then(res => res.json())
        .then(data => setValue(data.averageRating))
    },[id])

    return (
        <Box
        sx={{
            '& > legend': { mt: 3 },
            '& .MuiRating-icon': {
                fontSize: '2.5rem', 
            },
        }}
        >
        <Typography component="legend">Aktualna średnia ocen</Typography>
        <Rating name="read-only" value={value} readOnly />
        </Box>
    );
}