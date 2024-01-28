
import React, { useState } from 'react';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { useFormik } from 'formik';


export default function Admin() {
    const [admin, setAdmin] = useState(Cookies.get('admin'));
    useEffect(() => {
        const storedAdmin = Cookies.get('admin');
        setAdmin(storedAdmin);
    }, []);

    const changeRole = () => {
        if (admin === "true") {
            Cookies.set("admin", "false");
            setAdmin("false");
        } else {
            Cookies.set("admin", "true");
            setAdmin("true");
        }
        window.location.reload();
    }
    const validate = (values : {name? : string, image?:string, price?:number, description?: string, quantity? : number, category? : string, brand? : string, full_description? : string}) => {
        let errors :  {name? : string, image?:string, price?:string, description?: string, quantity? : string, category? : string, brand? : string, full_description? : string}= {};
        if (!values.name) {
            errors.name = "Nazwa jest wymagana";
        }else if(values.name?.[0] === " "){
            errors.name = "Nazwa nie może zaczynać się od spacji";
        }
        if (!values.image) {
            errors.image = "Zdjęcie jest wymagane";
        }else if(values.image?.[0] === " "){
            errors.image = "Zdjęcie nie może zaczynać się od spacji";
        }
        if (!values.price || typeof values.price !== 'number') {
            errors.price = "Cena jest wymagana";
        }else if(values.price<0){
            errors.price = "Cena nie może być ujemna";
        }
        if (!values.description) {
            errors.description = "Opis jest wymagany";
        }else if(values.description?.[0] === " "){
            errors.description = "Opis nie może zaczynać się od spacji";
        }
        if (!values.quantity || typeof values.quantity !== 'number') {
            errors.quantity = "Ilość jest wymagana";
        }else if(values.quantity<0){
            errors.quantity = "Ilość nie może być ujemna";
        }
        if (!values.category) {
            errors.category = "Kategoria jest wymagana";
        }else if(values.category?.[0] === " "){
            errors.category = "Kategoria nie może zaczynać się od spacji";
        }
        if (!values.brand) {
            errors.brand = "Marka jest wymagana"
        }else if(values.brand?.[0] === " "){
            errors.brand = "Marka nie może zaczynać się od spacji";
        }
        if (!values.full_description) {
            errors.full_description = "Pełny opis jest wymagany"
        }else if(values.full_description?.[0] === " "){
            errors.full_description = "Pełny opis nie może zaczynać się od spacji";
        }
        return errors;
    }
    const formik = useFormik({
        initialValues: {
            name: "",
            image: "",
            price: 0,
            description: "",
            quantity: 0,
            category: "",
            brand: "",
            full_description: ""
        },
        validate,
        onSubmit: values => {
            fetch('http://localhost:5000/addProduct', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            })
                .then(response => response.json())
                .then(data => {
                    alert('Udało sie dodać produkt');
                    window.location.reload();
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        }
    })
    return (
        <div>
            <div className="flex flex-col justify-center mx-[10vh]">
                <div className="my-12 space-y-[5vh]">
                    <h1 className="text-4xl">Panel Admina</h1>
                    <button className='bg-[#607274] hover:bg-[#B2A59B] text-white font-bold rounded-lg px-[10vh] py-4' onClick={changeRole}>{admin==="true" ? "Wyłącz" : "Włącz"} uprawnienia admina</button>
                    <p className="text-2xl">Aktualnie {admin === "true" ? "posiadasz prawa administratora" : "nie posiadasz praw administratora"}</p>
                </div>
                {admin === "true" ?
                    <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-4 bg-[#DED0B6] rounded-lg pb-[4vh]">
                        <label className="bg-[#B2A59B] rounded m-auto min-w-[90vh] py-[1vh] text-white text-3xl mt-[4vh]" htmlFor="name">Dodaj produkt</label>
                        <label className="bg-[#B2A59B] rounded m-auto min-w-[30vh] py-[1vh] text-white text-2xl mt-[4vh]" htmlFor="name">Nazwa</label>
                        <input className='mx-[10vh] rounded-lg' id="name" name="name" type="text" onChange={formik.handleChange} value={formik.values.name} />
                        {formik.errors.name ? <div>{formik.errors.name}</div> : null}
                        <label className="bg-[#B2A59B] rounded m-auto min-w-[30vh] py-[1vh] text-white text-2xl" htmlFor="image">Zdjęcie</label>
                        <input className='mx-[10vh] rounded-lg' id="image" name="image" type="text" onChange={formik.handleChange} value={formik.values.image} />
                        {formik.errors.image ? <div>{formik.errors.image}</div> : null}
                        <label className="bg-[#B2A59B] rounded m-auto min-w-[30vh] py-[1vh] text-white text-2xl" htmlFor="price">Cena</label>
                        <input className='mx-[10vh] rounded-lg' id="price" name="price" type="number" onChange={formik.handleChange} value={formik.values.price} />
                        {formik.errors.price ? <div>{formik.errors.price}</div> : null}
                        <label className="bg-[#B2A59B] rounded m-auto min-w-[30vh] py-[1vh] text-white text-2xl" htmlFor="description">Opis</label>
                        <input className='mx-[10vh] rounded-lg' id="description" name="description" type="text" onChange={formik.handleChange} value={formik.values.description} />
                        {formik.errors.description ? <div>{formik.errors.description}</div> : null}
                        <label className="bg-[#B2A59B] rounded m-auto min-w-[30vh] py-[1vh] text-white text-2xl" htmlFor="quantity">Ilość</label>
                        <input className='mx-[10vh] rounded-lg' id="quantity" name="quantity" type="number" onChange={formik.handleChange} value={formik.values.quantity} />
                        {formik.errors.quantity ? <div>{formik.errors.quantity}</div> : null}
                        <label className="bg-[#B2A59B] rounded m-auto min-w-[30vh] py-[1vh] text-white text-2xl" htmlFor="category">Kategoria</label>
                        <input id="category" className='mx-[10vh] rounded-lg' name="category" type="text" onChange={formik.handleChange} value={formik.values.category} />
                        {formik.errors.category ? <div>{formik.errors.category}</div> : null}
                        <label className="bg-[#B2A59B] rounded m-auto min-w-[30vh] py-[1vh] text-white text-2xl" htmlFor="brand">Marka</label>
                        <input className='mx-[10vh] rounded-lg' id="brand" name="brand" type="text" onChange={formik.handleChange} value={formik.values.brand} />
                        {formik.errors.brand ? <div>{formik.errors.brand}</div> : null}
                        <label className="bg-[#B2A59B] rounded m-auto min-w-[30vh] py-[1vh] text-white text-2xl" htmlFor="full_description">Pełny opis</label>
                        <input className='mx-[10vh] rounded-lg' id="full_description" name="full_description" type="text" onChange={formik.handleChange} value={formik.values.full_description} />
                        {formik.errors.full_description ? <div>{formik.errors.full_description}</div> : null}
                        <button className="bg-[#B2A59B] py-2 mx-20 px-2 rounded-lg hover:scale-110 text-white" type="submit">Dodaj produkt</button>
                    </form>
                    : null
                }
            </div>
        </div>
    )
}