import React from 'react'
import { useContext } from 'react';
import { CartContext } from '../contexts/ContextReducer';
import { addToCart, removeFromCart} from '../actions/CartActions';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
    const { state , dispatch} = useContext(CartContext);
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate(`/form`)
    }
    return (
        <div>
            <div className="flex justify-center mx-[10vh]">
                <div className="my-12">
                    <h1 className="text-4xl mb-[5vh]">Koszyk</h1>
                    <div className="flex flex-col bg-[#DED0B6] rounded-lg">
                        {state.cart.length === 0 && <p className="text-2xl p-40">KOSZYK JEST PUSTY</p>}
                        {state.cart.map((item: any) => (
                            <div>
                                <div className="mx-3 my-3 p-3 grid grid-cols-8 border-2 bg-[#F1E6D1] rounded-lg">
                                    <p className='flex items-center'>Nazwa produktu : {item.name}</p>
                                    <p className='flex items-center ml-[6vh]'>Cena: {item.price}</p>
                                    <p className='flex items-center'>Ilość: {item.quantity}</p>
                                    <div className='space-x-10 col-span-5'>
                                        <button className='bg-[#607274] hover:bg-[#B2A59B] text-white font-bold rounded-lg px-[10vh] py-4' onClick={() => dispatch(addToCart({name: item.name, price: item.price}))}>+</button>
                                        <button className='bg-[#607274] hover:bg-[#B2A59B] text-white font-bold rounded-lg px-[10vh] py-4' onClick={() => dispatch(removeFromCart({name: item.name, price:item.price}))}>-</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {state.cart.length !== 0 &&
                        <div className='mx-3'> 
                            <div className='flex justify-center flex-col my-7 bg-[#F1E6D1] m-auto px-[10vh] py-[2vh] rounded-lg'>
                                <p className='text-2xl'>Suma bez dostawy: {state.total}</p>
                                <p className='text-2xl'>Suma z dostawą (uśredniona cena dostawy 10zł): {state.total + 10}</p>
                            </div>
                            <div className='flex justify-center mb-[5vh]'>
                                <button className='bg-[#607274] hover:bg-[#B2A59B] text-white font-bold rounded-lg px-[10vh] py-4' onClick={handleNavigate}>Przejdź do formularza</button>
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}