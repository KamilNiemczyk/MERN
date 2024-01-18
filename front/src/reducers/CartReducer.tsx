

interface CartProduct {
    name: string;
    price: number;
    quantity: number;
}
export interface CartState {
    cart: CartProduct[];
    total: number;
    totalItems: number;
}

export type CartAction = { type: 'ADD_TO_CART', payload: CartProduct }
;

const initialState : CartState = {
    cart: [],
    total: 0,
    totalItems: 0,
    };

export default function CartReducer(state : CartState = initialState, action : CartAction){
    switch (action.type) {
        case 'ADD_TO_CART':
            let existItem = state.cart.find((item) => item.name === action.payload.name);
            if (existItem) {
                // existItem.quantity++;
                return {
                    ...state,
                    cart: state.cart.map((item) =>
                    item.name === action.payload.name
                      ? { ...item, quantity: item.quantity + 1 }
                      : item
                  ),
                    total: state.total + action.payload.price,
                    totalItems: state.totalItems + 1,
                };
            }
            else {
                return {
                    cart : [...state.cart, { name: action.payload.name, price: action.payload.price, quantity: 1 }],
                    total: state.total + action.payload.price,
                    totalItems: state.totalItems + 1,
                };
            }
        default:
            return state;
    }
}