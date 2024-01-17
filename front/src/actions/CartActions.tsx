
export interface Product {
    name : string;
    price : number;
}


export const addToCart = (product : Product ) => {
    return {
        type: "ADD_TO_CART",
        payload: product,
    };
} 