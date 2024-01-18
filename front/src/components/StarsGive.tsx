import * as React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

interface StarsGiveProps {
    id: string;
}

export default function StarsGive({id}: StarsGiveProps) {

  return (
    <Box
      sx={{
        '& > legend': { mt: 3 },
        '& .MuiRating-icon': {
          fontSize: '2.5rem',
      },
      }}
    >
      <Typography component="legend">Wystaw swoją opinie</Typography>
      <Rating
        name="simple-controlled"
        value={0}
        onChange={(event, newValue) => {
          fetch(`http://localhost:5000/addRating/${id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({rating: newValue}),
          })
          window.location.reload();
        }}
      />
    </Box>
  );
}