import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { Routes, Route } from "react-router-dom";
import Home from './components/Home';
import Search from './components/Search';
import Admin from './components/Admin';
import Cart from './components/Cart';
import { CartProvider } from './contexts/ContextReducer';
import Details from './components/Details';
import Form from './components/Form';
import Confirmation from './components/Confirmation';

function App() {
  return (
    <div className="App">
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="search/:id" element={<Details />} />
          <Route path="/form" element={<Form />} />
          <Route path="/confirmation" element={<Confirmation />} />
        </Routes>
      </CartProvider>
    </div>
  );
}

export default App;
