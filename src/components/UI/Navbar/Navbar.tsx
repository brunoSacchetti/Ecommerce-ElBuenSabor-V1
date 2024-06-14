import React, { useState } from 'react'
import './Navbar.css'
import { assets } from '../../../assets/assets';
import { Link } from 'react-router-dom';
type NavbarProps = {
  setShowLogin: (value: any) => void;
};

export const Navbar: React.FC<NavbarProps> = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("Home");
  return (
    <div className='navbar'>
       <Link to="/" ><img src="./POLLOLOGO.png" alt='logo.png' className="logo"/></Link>
        <ul className="navbar-menu">
        <li onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}>Home</li>
        <li onClick={() => setMenu("Categorias")} className={menu === "Categorias" ? "active" : ""}>Categorias</li>
        <li onClick={() => setMenu("Mobile")} className={menu === "Mobile" ? "active" : ""}>App Mobile</li>
        <li onClick={() => setMenu("Contactanos")} className={menu === "Contactanos"  ? "active" : ""}>Contactanos</li>
        </ul>
        <div className="navbar-right">
            <img src={assets.search_icon} alt="" />
            <div className="navbar-search-icon">
                <Link to='/cart'><img src={assets.basket_icon} alt=""/></Link>
                <div className="dot"></div>
            </div>
            <button onClick={() => setShowLogin(true)}>Iniciar Sesión</button>
        </div>
    </div>
  )
}
