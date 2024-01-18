
import React, { createContext, useReducer } from 'react';
import { CartState}  from '../reducers/CartReducer';
import CartReducer from '../reducers/CartReducer';
import { useEffect } from 'react';
interface CartContextProps {
    state: CartState;
    dispatch: React.Dispatch<any>;
}

export const CartContext = createContext<CartContextProps> ({ state: { cart: [], total: 0, totalItems: 0 }, dispatch: () => null});

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider : React.FC<CartProviderProps>= ({ children }: CartProviderProps) => {
    const storedState = JSON.parse(localStorage.getItem('cartState') || 'null');
    const [state, dispatch] = useReducer(CartReducer, storedState || { cart: [], total: 0, totalItems: 0 });
    useEffect(() => {
        localStorage.setItem('cartState', JSON.stringify(state));
    }, [state]);

    return (
        <CartContext.Provider value={{ state , dispatch}}>
            {children}
        </CartContext.Provider>
    );
}

