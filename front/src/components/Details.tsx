import React from 'react'
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ProductCardProps } from './ProductCard';
import { useContext } from 'react';
import { CartContext } from '../contexts/ContextReducer';
import { addToCart } from '../actions/CartActions';
import { useFormik } from 'formik';
import { v4 as uuidv4 } from 'uuid';
import Stars from './StarsRead';
import StarsGive from './StarsGive';
interface CommentProps {
    name: string;
    komentarz: string;
    id: string;
}
interface Product extends ProductCardProps {
    comments: CommentProps[];
  }

export default function Details() {
    const {id} = useParams();
    const [product, setProduct] = useState<Product>()
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
    console.log(product?.comments)
    const validate = (values: {name? : string; komentarz?:string}) => {
        let errors : {name? : string; komentarz?:string} = {};
        if (!values.name) {
            errors.name = 'Wymagane imie';
        } else if (values.name.length < 5) {
            errors.name = 'Imie musi miec wiecej niz 4 znaki';
        }
        if (!values.komentarz) {
            errors.komentarz = 'Wymagany komentarz';
        } else if (values.komentarz.length < 5) {
            errors.komentarz = 'Komentarz musi miec wiecej niz 4 znaki';
        }
        return errors;
    }
    
    const formik = useFormik({
        initialValues: {
            name: '',
            komentarz: '',
        },
        validate,
        onSubmit: values => {
            const uniqueId = uuidv4();
            fetch(`http://localhost:5000/addComment/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: values.name, komentarz: values.komentarz, id: uniqueId}),
            })
            formik.resetForm();
            window.location.reload();
            alert('Dodano komentarz');
        },  
    });


    return (
        <div>
            {product && product.name ? (
        <div>      
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
                        <p className='text-2xl'>Cena bez dostawy {product?.price}zł + (doliczyć dostawe według cennika poniżej)</p>
                        <div className='flex flex-row space-x-[2vh]'>
                            <form className='space-x-10' onSubmit={handleSubmit}>
                                <label className='text-2xl'>Ilość:</label>
                                <input className='bg-[#F1E6D1] text-2xl px-[5vh] py-[1vh] rounded-lg' type="number" name="quantity" min="1" max={product?.quantity} />
                                <input className='bg-[#F1E6D1] text-2xl px-[5vh] py-[1vh] rounded-lg' type="submit" value="Dodaj do koszyka" />
                            </form>
                        </div>
                        <div className='flex flex-row space-x-10 '>
                                <p className='text-2xl'>Cennik dostaw:</p>
                                <p className='text-2xl'>Paczkomat: 10zł</p>
                                <p className='text-2xl'>Kurier: 12zł</p>
                                <p className='text-2xl'>Poczta: 16zł</p>
                        </div>
                        <div className='flex space-x-[10vh]'>
                            <Stars id={product._id}/>
                            <StarsGive id={product._id}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='mt-[3vh] flex-col items-center justify-center bg-[#B2A59B] py-[10vh]'>
                <div className='items-center justify-center flex flex-col space-y-20'>
                    <h1 className='text-4xl'>Dodaj opinie o produkcie</h1>
                    <div className='bg-[#F1E6D1] rounded-lg w-1/2 py-[10vh]'>
                        <form onSubmit={formik.handleSubmit} className='flex flex-col items-center space-y-3'>
                            <label className="text-3xl" htmlFor="name">Imie</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                className='w-1/2'
                            />
                            {formik.errors.name ? <div>{formik.errors.name}</div> : null}
                            <label className="text-3xl" htmlFor="komentarz">Komentarz</label>
                            <input
                                id="komentarz"
                                name="komentarz"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.komentarz}
                                className='w-1/2'
                            />
                            {formik.errors.komentarz ? <div>{formik.errors.komentarz}</div> : null}
                            <button className="bg-[#B2A59B] py-2 px-2 rounded-lg hover:scale-110" type="submit">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className='mt-[3vh] flex-col items-center justify-center bg-[#DED0B6] py-[10vh]'>
                <div className='items-center justify-center flex flex-col space-y-20'>
                    <h1 className='text-4xl'>Opinie o produkcie</h1>
                    {product?.comments.map((comment) => (
                        <div key={comment.id} className='bg-[#F1E6D1] rounded-lg w-1/2 py-[7vh]'>
                            <p className='text-2xl'>Imie: {comment.name}</p>
                            <p className='text-2xl'>Komentarz: {comment.komentarz}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
            ) : (
            <div>Nie ma takiego produktu</div>
            )}
        </div>
    )
}