import React from 'react'
import { useContext } from 'react';
import { CartContext } from '../contexts/ContextReducer';
import { addToCart } from '../actions/CartActions';
export default function Cart() {
    const { state , dispatch} = useContext(CartContext);
    return (
        <div>
            <div className="flex justify-center mx-[10vh]">
                <div className="my-12">
                    <h1 className="text-4xl">CART</h1>
                    <p>{JSON.stringify(state)}</p>
                    <button onClick={() => dispatch(addToCart({name: "test", price: 10}))}>Add to cart</button>
                </div>
            </div>
        </div>
    )
}