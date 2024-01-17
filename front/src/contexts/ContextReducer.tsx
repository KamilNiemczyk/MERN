
import React, { createContext, useReducer } from 'react';
import { CartState}  from '../reducers/CartReducer';
import CartReducer from '../reducers/CartReducer';


interface CartContextProps {
    state: CartState;
    dispatch: React.Dispatch<any>;
}

export const CartContext = createContext<CartContextProps> ({ state: { cart: [], total: 0, totalItems: 0 }, dispatch: () => null});

interface CartProviderProps {
    children: React.ReactNode;
}

export const CartProvider : React.FC<CartProviderProps>= ({ children }: CartProviderProps) => {
    const [state, dispatch] = useReducer(CartReducer, { cart: [], total: 0, totalItems: 0 });

    return (
        <CartContext.Provider value={{ state , dispatch}}>
            {children}
        </CartContext.Provider>
    );
}

