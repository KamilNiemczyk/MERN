
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useContext } from 'react';
import { CartContext } from '../contexts/ContextReducer';
import { clearCart } from '../actions/CartActions';

export default function Confirmation() {
    const [deliver, setDelivery] = useState<any>();
    const navigate = useNavigate();
    const { state , dispatch} = useContext(CartContext);
    useEffect(() => {
        const storedDelivery = Cookies.get('dostawa');
        if(storedDelivery){
            setDelivery(storedDelivery);
        }else{
            setDelivery(null);
        }
    }, [])
    const handleDeleteCookie = () => {
        Cookies.remove('dostawa');
        Cookies.remove('cartApproved');
        handleDeletingQuantity();
        navigate(`/`)
        dispatch(clearCart());
    }
    const handleDeletingQuantity = () => {
        state.cart.forEach((product: any) => {
            fetch(`http://localhost:5000/updateQuantity/${product.id}/${product.quantity}`, 
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
            }
            )
            .then(res => res.json())
            .then(data => console.log(data))
        })
    }
    
    return (
        <div>
            <div className="flex justify-center items-center mx-[10vh]">
                <div className="my-12 bg-[#DED0B6] flex flex-col px-[20vh] justify-center items-center rounded-lg py-[10vh] space-y-7">
                    <h1 className="text-4xl">Potwierdzenie zakupu</h1>
                    {deliver === 'kurierA' ? 
                        <div>
                            <p className='text-2xl'>Wybrano kuriera firmy A: +5zł</p>
                            <p className='text-2xl'>Suma zamówienia+ kurier: {state.total} + 5 = {state.total+5} </p>
                        </div>
                     : null}
                    {deliver === 'kurierB' ?                         
                        <div>
                            <p className='text-2xl'>Wybrano kuriera firmy B: +10zł</p>
                            <p className='text-2xl'>Suma zamówienia+ kurier: {state.total} + 10 = {state.total+10} </p>
                        </div> : null}
                    {deliver === 'kurierC' ?                         
                        <div>
                            <p className='text-2xl'>Wybrano kuriera firmy C: +15zł</p>
                            <p className='text-2xl'>Suma zamówienia+ kurier: {state.total} + 15 = {state.total+15} </p>
                        </div> : null}
                    {deliver === null ? <p className='text-2xl'>Niestety nie złożono zamówienia</p> : null}
                    {deliver !== null ? <button className='bg-[#607274] hover:bg-[#B2A59B] text-white font-bold rounded-lg px-[10vh] py-4' onClick={handleDeleteCookie}>Zamów ponownie</button> : null}
                </div>
            </div>
        </div>
    )
}