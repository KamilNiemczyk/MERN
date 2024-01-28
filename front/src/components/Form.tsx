
import React from 'react'; 
import { useFormik } from 'formik';
import Cookies from 'js-cookie';  
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Form() {
    const [formApproved] = useState(Cookies.get('cartApproved'));
    useEffect(() => {
        if(formApproved !== "true"){
            navigate(`/cart`)
        }
    },[])
    const validate = (values: {name? : string, surname? : string, email? : string, phone? : string, city? : string, street? : string, house? : string, postcode? : string, flatNumber? : string, delivery? : string}) => {
        let errors : {name? : string, surname? : string, email? : string, phone? : string, city? : string, street? : string, house? : string, postcode? : string, flatNumber? : string, delivery? : string} = {};
        if (!values.name) {
            errors.name = 'Wymagane imie';
        } else if (values.name.length < 3) {
            errors.name = 'Imie musi miec wiecej niz 2 znaki';
        } else if (values.name[0] === " ") {
            errors.name = 'Imie nie moze zaczynac sie od spacji';
        }
        if (!values.surname) {
            errors.surname = 'Wymagane nazwisko';
        } else if (values.surname.length < 3) {
            errors.surname = 'Nazwisko musi miec wiecej niz 2 znaki';
        } else if (values.surname[0] === " ") {
            errors.surname = 'Nazwisko nie moze zaczynac sie od spacji';
        }
        if (!values.email) {
            errors.email = 'Email wymagany'
        } 
        else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
        ) {
            errors.email = 'Błedny email';
        } else if (values.email[0] === " ") {
            errors.email = 'Email nie moze zaczynac sie od spacji';
        }
        if (!values.phone) {
            errors.phone = 'Telefon wymagany'
        } else if (
            !/^(\d{3}-\d{3}-\d{3})$/i.test(values.phone)
        ) {
            errors.phone = "Błędny numer telefonu, nie może być stacjonarny i bez kierunkowego"
        } else if (values.phone[0] === " ") {
            errors.phone = 'Telefon nie moze zaczynac sie od spacji';
        }
        if (!values.city) {
            errors.city = 'Miasto wymagane'
        } else if(
            !/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/i.test(values.city)
        ){
            errors.city = "Błędne miasto"
        } else if (values.city[0] === " ") {
            errors.city = 'Miasto nie moze zaczynac sie od spacji';
        }
        if (!values.street) {
            errors.street = 'Ulica wymagana'
        } else if(
            !/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/i.test(values.street)
        ){
            errors.street = "Błędna ulica"
        } else if (values.street[0] === " ") {
            errors.street = 'Ulica nie moze zaczynac sie od spacji';
        }
        if (!values.house) {
            errors.house = 'Numer domu wymagany'
        } else if(
            !/^[0-9]+[a-zA-Z]*$/i.test(values.house)
        ){
            errors.house = "Błędny numer domu"
        } else if (values.house[0] === " ") {
            errors.house = 'Numer domu nie moze zaczynac sie od spacji';
        }
        if (!values.postcode) {
            errors.postcode = 'Kod pocztowy wymagany'
        } else if(
            !/^[0-9]{2}-[0-9]{3}$/i.test(values.postcode)
        ){
            errors.postcode = "Błędny kod pocztowy"
        } else if (values.postcode[0] === " ") {
            errors.postcode = 'Kod pocztowy nie moze zaczynac sie od spacji';
        }
        if (!values.flatNumber) {
            errors.flatNumber = 'Numer mieszkania wymagany'
        } else if(
            !/^\d+$/.test(values.flatNumber)
        ){
            errors.flatNumber = "Błędny numer mieszkania"
        } else if (values.flatNumber[0] === " ") {
            errors.flatNumber = 'Numer mieszkania nie moze zaczynac sie od spacji';
        }
        if (!values.delivery) {
            errors.delivery = 'Wymagany sposób dostawy'
        } else if (values.delivery[0] === " ") {
            errors.delivery = 'Sposób dostawy nie moze zaczynac sie od spacji';
        }
        return errors;
    }
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            phone: '',
            city: '',
            street: '',
            house: '',
            postcode: '',
            flatNumber: '',
            delivery: 'kurierA',
        },
        validate,
        onSubmit: values => {
            Cookies.set('dostawa', values.delivery, { expires: 7 });
            navigate(`/confirmation`)
        },  
    });

    return (
        <div>
            <div className="flex flex-col justify-center mx-[10vh]">
                <div className="my-12">
                    <h1 className="text-4xl">Formularz</h1>
                </div>
                <form className="flex flex-col space-y-4 bg-[#DED0B6] rounded-lg" onSubmit={formik.handleSubmit}>
                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl" htmlFor="name">Imie</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.name}
                            className='mx-[10vh] rounded-lg'
                        />
                        {formik.errors.name ? <div>{formik.errors.name}</div> : null}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl" htmlFor="surname">Nazwisko</label>
                        <input
                            id="surname"
                            name="surname"
                            type="text"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.surname}
                            className='mx-[10vh] rounded-lg'
                        />
                        {formik.errors.surname ? <div>{formik.errors.surname}</div> : null}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl" htmlFor="email">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            className='mx-[10vh] rounded-lg'
                        />
                        {formik.errors.email ? <div>{formik.errors.email}</div> : null}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl" htmlFor="phone">Telefon z myślnikami</label>
                        <input
                            id="phone"
                            name="phone"
                            type="text"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.phone}
                            className='mx-[10vh] rounded-lg'
                        />
                        {formik.errors.phone ? <div>{formik.errors.phone}</div> : null}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl" htmlFor="city">Miasto</label>
                        <input
                            id="city"
                            className='mx-[10vh] rounded-lg'
                            name="city"
                            type="text"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.city}
                        />
                        {formik.errors.city ? <div>{formik.errors.city}</div> : null}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl" htmlFor="street">Ulica</label>
                        <input
                            id="street"
                            name="street"
                            type="text"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.street}
                            className='mx-[10vh] rounded-lg'
                        />
                        {formik.errors.street ? <div>{formik.errors.street}</div> : null}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl" htmlFor="house">Numer domu</label>
                        <input
                            id="house"
                            name="house"
                            type="text"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.house}
                            className='mx-[10vh] rounded-lg'
                        />
                        {formik.errors.house ? <div>{formik.errors.house}</div> : null}
                        </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl" htmlFor="postcode">Kod pocztowy</label>
                        <input
                            id="postcode"
                            name="postcode"
                            type="text"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.postcode}
                            className='mx-[10vh] rounded-lg'
                        />
                        {formik.errors.postcode ? <div>{formik.errors.postcode}</div> : null}
                        </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl" htmlFor="flatNumber">Numer mieszkania</label>
                        <input
                            id="flatNumber"
                            name="flatNumber"
                            type="text"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.flatNumber}
                            className='mx-[10vh] rounded-lg'
                        />
                        {formik.errors.flatNumber ? <div>{formik.errors.flatNumber}</div> : null}
                        </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-2xl" htmlFor="delivery">Sposób dostawy</label>
                        <select
                            id="delivery"
                            name="delivery"
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            value={formik.values.delivery}
                            className='mx-[10vh] rounded-lg'
                        >
                            <option value="kurierA">Kurier firma A + 5zł</option>
                            <option value="kurierB">Kurier firmy B + 10zł</option>
                            <option value="kurierC">Kurier firmy C + 15zł</option>
                        </select>
                        {formik.errors.delivery ? <div>{formik.errors.delivery}</div> : null}
                        </div>
                    <button className="bg-[#B2A59B] py-2 mx-20 px-2 rounded-lg hover:scale-110" type="submit">Submit</button>
                </form>
            </div>
        </div>
    )
}