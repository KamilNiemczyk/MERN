import React, { useEffect, useState, useRef } from 'react'
import ProductCard from './ProductCard'
import { ProductCardProps } from './ProductCard';
export default function Search() {
    const [products, setProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [brands, setBrands] = useState<any[]>([])
    const searchInput = useRef<HTMLInputElement | null >(null);
    useEffect(() => {
        fetch('http://localhost:5000/getProducts')
        .then(res => res.json())
        .then(data => setProducts(data))
    },[])

    useEffect(() => {
        if(searchInput.current){
            searchInput.current.focus();
        }
    }
    ,[])

    useEffect(() => {
        fetch('http://localhost:5000/getCategories')
        .then(res => res.json())
        .then(data => {
            const allBrands = ["Wszystkie", ...data]
            setCategories(allBrands)
            } 
            )
    },[])
    useEffect(() => {
        fetch('http://localhost:5000/getBrands')
        .then(res => res.json())
        .then(data => {
            const allBrands = ["Wszystkie", ...data]
            setBrands(allBrands)
            } 
        )
    },[])
    const handleSearchEndpoint = (event: any) => {
        event.preventDefault();
        fetch(`http://localhost:5000/searchProducts/${event.target.search.value}`)
        .then(res => res.json())
        .then(data => setProducts(data))
    }
    const handleFilterEndpoint = (event: any) => {
        event.preventDefault();
        fetch(`http://localhost:5000/getProductsByCategoryAndBrand/${event.target.category.value}/${event.target.brand.value}`)
        .then(res => res.json())
        .then(data => data.filter((product: any) => product.quantity > 0))
        .then(data => {
            if((event.target.datesort.value !== "none" && event.target.avgRating.value !== "none") || (event.target.datesort.value !== "none" && event.target.sort.value !== "none") || (event.target.avgRating.value !== "none" && event.target.sort.value !== "none")){
                alert("Nie można jednoczesni losować według daty, oceny i ceny")
                event.target.reset()
            }else{
                if(event.target.sort.value === "asc"){
                    data.sort((a: any, b: any) => a.price - b.price)
                }else if(event.target.sort.value === "desc"){
                    data.sort((a: any, b: any) => b.price - a.price)
                }
                if(event.target.datesort.value === "asc"){
                    data.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                }else if(event.target.datesort.value === "desc"){
                    data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                }
                if(event.target.avgRating.value === "asc"){
                    data.sort((a: any, b: any) => {
                        const avgRatingA = a.rating.length ? a.rating.reduce((a: any, b: any) => a + b.rating, 0) / a.rating.length : 0
                        const avgRatingB = b.rating.length ? b.rating.reduce((a: any, b: any) => a + b.rating, 0) / b.rating.length : 0
                        return avgRatingA - avgRatingB
                    })

                }else if(event.target.avgRating.value === "desc"){
                    data.sort((a: any, b: any) => {
                        const avgRatingA = a.rating.length ? a.rating.reduce((a: any, b: any) => a + b.rating, 0) / a.rating.length : 0
                        const avgRatingB = b.rating.length ? b.rating.reduce((a: any, b: any) => a + b.rating, 0) / b.rating.length : 0
                        return avgRatingB - avgRatingA
                    })
                }
                if(event.target.priceFrom.value !== ""){
                    data = data.filter((product: any) => product.price >= event.target.priceFrom.value)
                }
                if(event.target.priceTo.value !== ""){
                    data = data.filter((product: any) => product.price <= event.target.priceTo.value)
                }
                if(event.target.priceWithDeliveryFrom.value !== ""){
                    data = data.filter((product: any) => product.price+10 >= event.target.priceWithDeliveryFrom.value)
                }
                if(event.target.priceWithDeliveryTo.value !== ""){
                    data = data.filter((product: any) => product.price+10 <= event.target.priceWithDeliveryTo.value)
                }
                setProducts(data)
            }
        })
    }

    return (
        <div>
            <form onSubmit={handleSearchEndpoint}>
                <input
                        ref={searchInput}
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Wyszukaj"
                        className="text-xl mx-[10vh] my-[5vh] w-[80vh] h-[6vh] rounded-lg border-[#DED0B6] border-2"
                />
            </form>
            <div className='grid grid-cols-4 gap-[7vh]'>
                <div className='col-span-1 flex-col justify-center bg-primary ml-[10vh] pb-[8vh]'>
                    <p className='my-[6vh] text-2xl'>Filtrowanie</p>
                    <form onSubmit={handleFilterEndpoint} className='flex flex-col mx-10 space-y-3'>
                        <label htmlFor="category" className='text-xl'>Kategoria</label>
                        <select name="category" id="category">
                            {categories.map((category: any) => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <label htmlFor="brand" className='text-xl'>Marka</label>
                        <select name="brand" id="brand">
                            {brands.map((brand: any) => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                        <label htmlFor="sort" className='text-xl'>Sortowanie Ceny</label>
                        <select name="sort" id="sort">
                            <option value="none">Sortuj</option>
                            <option value="asc">Rosnąco</option>
                            <option value="desc">Malejąco</option>
                        </select>
                        <label htmlFor="price" className='text-xl'>Cena bez dostawy</label>
                        <input type="number" name="priceFrom" id="priceFrom" placeholder='Cena od' className='text-xl' min={0}/>
                        <input type="number" name="priceTo" id="priceTo" placeholder='Cena do' className='text-xl' min={0}/>
                        <label htmlFor="priceWithDelivery" className='text-xl'>Cena z dostawą</label>
                        <input type="number" name="priceWithDeliveryFrom" id="priceWithDeliveryFrom" placeholder='Cena od' className='text-xl' min={0}/>
                        <input type="number" name="priceWithDeliveryTo" id="priceWithDeliveryTo" placeholder='Cena do' className='text-xl' min={0}/>
                        <label htmlFor="datesort" className='text-xl'>Sortowanie daty dodania</label>
                        <select name="datesort" id="datesort">
                            <option value="none">-</option>
                            <option value="asc">Rosnąco</option>
                            <option value="desc">Malejąco</option>
                        </select>
                        <label htmlFor='avgRating' className='text-xl'>Średnia ocena</label>
                        <select name="avgRating" id="avgRating">
                            <option value="none">-</option>
                            <option value="asc">Rosnąco</option>
                            <option value="desc">Malejąco</option>
                        </select>
                        <button type="submit" className='my-6 text-xl bg-[#607274] hover:bg-[#B2A59B] text-white font-bold py-2 px-4 rounded'>Filtruj</button>
                    </form>
                </div>
                <div className='col-span-3 flex items-center justify-center'>
                    {products.length === 0 && <h1 className='text-4xl'>Brak produktów pasujących do filtrowania</h1>}
                    <div className='grid grid-cols-4 gap-[7vh]'>
                    {products.map((product: ProductCardProps) => (
                            <ProductCard key={product._id} {...product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}