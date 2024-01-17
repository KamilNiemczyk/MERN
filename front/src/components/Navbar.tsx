import { Link } from "react-router-dom";
import CartIcon from "./CartIcon";
export default function Navbar() {
    return (
        <div>
            <div className="flex justify-between mx-[10vh]">
                <div className="my-12">
                    <h1 className="text-4xl">SportSKLEP</h1>
                </div>
                <div className="my-auto mr-[9vh]">
                    <div className="flex space-x-12 text-2xl my-auto py-7 px-10">
                        <div className="hover:border-b hover:py-2 hover:px-10 border-black duration-1000"><Link to="/">Strona główna</Link></div>
                        <div className="hover:border-b hover:py-2 hover:px-10 border-black duration-1000"><Link to="/search">Wyszukiwanie</Link></div>
                        <div className="hover:border-b hover:py-2 hover:px-10 border-black duration-1000"><Link to="/admin">Panel Admina</Link></div>
                    </div>
                </div>
                <div className="my-auto mr-[6vh]">
                    <CartIcon />
                </div>
            </div>
        </div>
    )
}