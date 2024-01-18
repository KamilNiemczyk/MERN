import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard, { ProductCardProps } from './ProductCard';
import { useContext } from 'react';
import { CartContext } from '../contexts/ContextReducer';
import { addToCart } from '../actions/CartActions';


export default function Details() {
    const {id} = useParams();
    const [product, setProduct] = useState<ProductCardProps>()
    const {dispatch} = useContext(CartContext);
    useEffect(() => {
        fetch(`http://localhost:5000/getProduct/${id}`)
        .then(res => res.json())
        .then(data => setProduct(data))
    },[id])

    const handleSubmit = (event: any) => {
        event.preventDefault();
        for(let i=0; i<event.target.quantity.value; i++){
            dispatch(addToCart({name: product?.name ?? "Imie jeśli bedzie undefined", price: product?.price ?? 0}))
        }
    }
    return (
        <div>
            {product && product.name ? (      
        <div className='mt-[5vh] flex items-center justify-center bg-[#DED0B6] py-[10vh]'>
            <div className='grid grid-cols-2 gap-[10vh]'>
                <div>
                    <img className='w-[50vh] h-[50vh]' src={product?.image} alt={product?.name} />
                </div>
                <div className='flex flex-col items-start space-y-6'>
                    <h1 className='text-4xl'>{product?.name}</h1>
                    <p className='text-2xl'>{product?.description}</p>
                    <div className='flex flex-row items-center space-x-[10vh]'>
                        <p className='text-2xl'>Kategoria: {product?.category}</p>
                        <p className='text-2xl'>Marka: {product?.brand}</p>
                        <p className='text-2xl'>Ilośc na stanie: {product?.quantity}</p>
                    </div>
                    <p className='text-2xl'>Opis: {product?.full_description}</p>
                    <p className='text-2xl'>Cena bez dostawy: {product?.price} + dostawa (10zł)</p>
                    <div className='flex flex-row space-x-[2vh]'>
                        <form className='space-x-10' onSubmit={handleSubmit}>
                            <label className='text-2xl'>Ilość:</label>
                            <input className='bg-[#F1E6D1] text-2xl px-[5vh] py-[1vh] rounded-lg' type="number" name="quantity" min="1" max={product?.quantity} />
                            <input className='bg-[#F1E6D1] text-2xl px-[5vh] py-[1vh] rounded-lg' type="submit" value="Dodaj do koszyka" />
                        </form>
                    </div>

                </div>
            </div>
        </div>
            ) : (
            <div>Nie ma takiego produktu</div>
            )}
        </div>
    )
}