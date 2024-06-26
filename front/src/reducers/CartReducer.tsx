

interface CartProduct {
    name: string;
    price: number;
    quantity: number;
    id: string;
}
export interface CartState {
    cart: CartProduct[];
    total: number;
    totalItems: number;
}

export type CartAction = { type: 'ADD_TO_CART', payload: CartProduct } | { type: 'REMOVE_FROM_CART', payload: CartProduct} | { type: 'CLEAR_CART'}
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
                    cart : [...state.cart, { name: action.payload.name, price: action.payload.price, quantity: 1, id: action.payload.id}],
                    total: state.total + action.payload.price,
                    totalItems: state.totalItems + 1,
                };
            }
        case 'REMOVE_FROM_CART':
            let item = state.cart.find((item) => item.name === action.payload.name);
            if (item?.quantity === 1) {
                return {
                    ...state,
                    cart: state.cart.filter((item) => item.name !== action.payload.name),
                    total: state.total - action.payload.price,
                    totalItems: state.totalItems - 1,
                };
            }
            else {
                return {
                    ...state,
                    cart: state.cart.map((item) =>
                    item.name === action.payload.name
                      ? { ...item, quantity: item.quantity - 1 }
                      : item
                  ),
                    total: state.total - action.payload.price,
                    totalItems: state.totalItems - 1,
                };
            }
        case 'CLEAR_CART':
            return {
                ...state,
                cart: [],
                total: 0,
                totalItems: 0,
            };
        default:
            return state;
    }
}