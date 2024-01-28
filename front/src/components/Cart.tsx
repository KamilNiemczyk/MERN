import React from 'react'
import { useContext } from 'react';
import { CartContext } from '../contexts/ContextReducer';
import { addToCart, removeFromCart} from '../actions/CartActions';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Cart() {
    const { state , dispatch} = useContext(CartContext);
    const navigate = useNavigate();
    const [products, setProducts] = useState<any[]>([])
    useEffect(() => {
        fetch('http://localhost:5000/getProducts')
        .then(res => res.json())
        .then(data => setProducts(data))
    },[])

    const handleNavigate = () => {
        let navigateToForm = true;
        state.cart.forEach((item: any) => {
            const quantityInCart = state.cart.filter((itema: any) => itema.name === item.name)[0]?.quantity;
            const quantityInStock = products.filter((itema: any) => itema.name === item.name)[0]?.quantity;
            if(quantityInCart > quantityInStock){
                alert(`Brak wystarczającej ilości produktu ${item.name} na stanie. Można zamówić max ${quantityInStock} sztuk.`);
                navigateToForm = false;
                return;
            }
        })
        if(navigateToForm){
            Cookies.set("cartApproved", "true"); 
            navigate(`/form`)
        }
    }
    return (
        <div>
            <div className="flex justify-center mx-[10vh]">
                <div className="my-12">
                    <h1 className="text-4xl mb-[5vh]">Koszyk</h1>
                    <div className="flex flex-col bg-primary rounded-lg">
                        {state.cart.length === 0 && <p className="text-2xl p-40">KOSZYK JEST PUSTY</p>}
                        {state.cart.map((item: any) => (
                            <div>
                                <div className="mx-3 my-3 p-3 grid grid-cols-8 border-2 bg-[#F1E6D1] rounded-lg">
                                    <p className='flex items-center'>Nazwa produktu : {item.name}</p>
                                    <p className='flex items-center ml-[6vh]'>Cena: {item.price}</p>
                                    <p className='flex items-center'>Ilość: {item.quantity}</p>
                                    <div className='space-x-10 col-span-5'>
                                        <button className='bg-[#607274] hover:bg-[#B2A59B] text-white font-bold rounded-lg px-[10vh] py-4' onClick={() => dispatch(addToCart({name: item.name, price: item.price, id : item._id}))}>+</button>
                                        <button className='bg-[#607274] hover:bg-[#B2A59B] text-white font-bold rounded-lg px-[10vh] py-4' onClick={() => dispatch(removeFromCart({name: item.name, price:item.price, id: item._id}))}>-</button>
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