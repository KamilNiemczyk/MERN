import React from 'react'
import ProductCard from './ProductCard'
import { ProductCardProps } from './ProductCard';
import { useState, useEffect } from 'react';


export default function Home() {
    const [products, setProducts] = useState<any[]>([])


    const fetchData = () => {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:5000/getProducts')
            .then(res => res.json())
            .then(data => {
                const test = data.slice(0, 9)
                resolve(test)
            })}).then((data) => {
                setProducts(data as any[]);
            }).then(() => {
                console.log("Pobrano produkty")
            }).catch((error) => {
                console.error('Error:', error);
            }).finally(() => {
                console.log("Zakończono pobieranie produktów")
            })
    }
    useEffect(() => {
        fetchData();
    },[])
    
    return (
        <div>
            <div className="flex justify-center mx-[10vh]">
                <div className="my-12">
                    <h1 className="text-4xl">Przykładowe produkty</h1>
                </div>
            </div>
            <div className='flex justify-center items-center'>
                <div className='grid grid-cols-3 gap-[7vh]'>
                {products.map((product: ProductCardProps) => (
                        <ProductCard key={product._id} {...product} />
                    ))}
                </div>
            </div>
        </div>
    )
}