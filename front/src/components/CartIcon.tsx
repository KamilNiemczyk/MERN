import * as React from 'react';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from "react-router-dom";
import { useContext } from 'react';
import { CartContext } from '../contexts/ContextReducer';
import { useState } from 'react';
import { useEffect } from 'react';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -1,
    top: 19,
    backgroundColor: '#607274',
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

export default function CartIcon() {
    const { state } = useContext(CartContext);
    const [badgeContent, setBadgeContent] = useState<number>(0)
    useEffect(() => {
        setBadgeContent(state.totalItems)
    }, [state.totalItems])
  return (
    <Link to="/cart">
    <IconButton aria-label="cart">
      <StyledBadge badgeContent={badgeContent} color="secondary">
        <ShoppingCartIcon sx={{ fontSize : '2.5rem', color : 'black'}} />
      </StyledBadge>
    </IconButton>
    </Link>
  );
}