import React, { useState } from 'react';
import { useContext } from 'react';
import { CartContext } from '../contexts/ContextReducer';
import { addToCart } from '../actions/CartActions';
import { useNavigate } from 'react-router-dom';
export interface ProductCardProps {
    name: string;
    price: number;
    quantity: number;
    image: string;
    description: string;
    category: string;
    brand: string;
    rating: object;
    comments: object;
    _id: string;
    full_description: string;
}

export default function ProductCard(product: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    // const {dispatch} = useContext(CartContext);
    const navigate = useNavigate();
    const handleNavigate = (id : string) => {
        navigate(`/search/${id}`)
    }
    const { state , dispatch} = useContext(CartContext);
    const handleAdd= (producta : ProductCardProps) => {
        const quantityInCart = state.cart.filter((item: any) => item.name === producta.name)[0]?.quantity;
        if(quantityInCart === product.quantity){
            return;
        }else{
            dispatch(addToCart({name: producta.name, price: producta.price}));
        }
    }
    return (
        <div
      className={`relative w-64 h-96 bg-[#DED0B6] rounded-lg shadow-lg transition-transform transform ${
        isHovered ? 'hover:scale-110' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
            <div className="flex flex-col justify-center items-center w-full h-3/4">
                <h1 className="text-xl font-bold mx-1">{product.name}</h1>
                <img className="w-3/4 h-3/4 object-contain" src={product.image} alt={product.name} />
            </div>
            <div className="flex flex-col justify-center items-center w-full h-1/4">
                <p className="text-sm">Cena bez dostawy: {product.price} zł</p>
                <p className="text-sm">Cena z dostawą: {product.price+10} zł</p>
                <p className="text-sm">Opis: {product.description}</p>
                <p className="text-sm">Dostępna ilość: {product.quantity}</p>
            </div>
            {isHovered && (
                <div className="absolute top-0 left-0 w-full h-full bg-[#DED0B6] bg-opacity-80 rounded-lg flex flex-col justify-center items-center space-y-5">
                    {/* <button className="bg-[#607274] hover:bg-[#B2A59B] text-white font-bold py-2 px-4 rounded" onClick={() => dispatch(addToCart({name: product.name, price: product.price}))}> */}
                    <button className="bg-[#607274] hover:bg-[#B2A59B] text-white font-bold py-2 px-4 rounded" onClick={() => handleAdd(product)}>
                        Dodaj do koszyka
                    </button>
                    <button className="bg-[#607274] hover:bg-[#B2A59B] text-white font-bold py-2 px-4 rounded" onClick={() => handleNavigate(product._id)}>
                        Informacje
                    </button>
                </div> 
                )}
        </div>
    )
}