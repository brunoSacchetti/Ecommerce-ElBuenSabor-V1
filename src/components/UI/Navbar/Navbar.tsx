import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../../assets/assets';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/slices/userSlice';
import { useAppSelector } from '../../../hooks/redux';


type NavbarProps = {
  setShowLogin: (value: any) => void;
};

export const Navbar: React.FC<NavbarProps> = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("Home");
  const dispatch = useDispatch();

  const { isLoggedIn, cliente } = useAppSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  

  return (
    <div className='navbar' style={{justifyContent:"space-around"}}>
      <Link to="/" ><img src="./POLLOLOGO.png" alt='logo.png' className="logo"/></Link>
      <ul className="navbar-menu">
        <li onClick={() => setMenu("Home")} className={menu === "Home" ? "active" : ""}><Link className='link' to={"/"}>Home</Link></li>
        <li onClick={() => setMenu("Categorias")} className={menu === "Categorias" ? "active" : ""}>Categorias</li>
        {isLoggedIn && cliente ? ( <li onClick={() => setMenu("Pedidos")} className={menu === "Pedidos" ? "active" : ""}><Link className='link' to={"/pedidos"}> Pedidos</Link></li>) : ( <></> )}
       
      </ul>
      <div className="navbar-right">
        {/* <img src={assets.search_icon} alt="" /> */}
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt=""/></Link>
          <div className="dot"></div>
        </div>
        {isLoggedIn && cliente ? (
          <>
            <span className='userName'>{cliente.userName}</span>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </>
        ) : (
          <button onClick={() => setShowLogin(true)}>Iniciar Sesión</button>
        )}
      </div>
    </div>
  );
};

