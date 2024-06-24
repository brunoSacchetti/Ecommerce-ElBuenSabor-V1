import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../../assets/assets";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/userSlice";
import { useAppSelector } from "../../../hooks/redux";
import { Popover } from "@mui/material";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div className="navbar" style={{ justifyContent: "space-around" }}>
      <Link to="/">
        <img src="./POLLOLOGO.png" alt="logo.png" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <li
          onClick={() => setMenu("Home")}
          className={menu === "Home" ? "active" : ""}
        >
          <Link className="link" to={"/"}>
            Home
          </Link>
        </li>
        <li
          onClick={() => setMenu("Promociones")}
          className={menu === "Promociones" ? "active" : ""}
        >
          <Link className="link" to={"/promociones"}>
            Promociones
          </Link>
        </li>
        {isLoggedIn && cliente ? (
          <li
            onClick={() => setMenu("Pedidos")}
            className={menu === "Pedidos" ? "active" : ""}
          >
            <Link className="link" to={"/pedidos"}>
              Pedidos
            </Link>
          </li>
        ) : null}
        <li className="carrito-navBar">
          <div
            onClick={() => setMenu("Carrito")}
            className={`carrito ${menu === "Carrito" ? "active" : ""}`}
          >
            <Link className="link" to={"/cart"}>
              Carrito
            </Link>
            <img src={assets.basket_icon} alt="" />
          </div>
        </li>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" />
          </Link>
          <div className="dot"></div>
        </div>
        {isLoggedIn && cliente ? (
          <>
            <span className="userName">{cliente.userName}</span>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </>
        ) : (
          <button onClick={() => setShowLogin(true)}>Iniciar Sesión</button>
        )}
      </div>
      <div
        style={{ gap: "0.2rem", cursor: "pointer" }}
        className="menu-hamburgesa"
        onClick={handleClick}
      >
        <MenuOpenIcon style={{ width: '30px', height: '30px' }} />
      </div>
      <Popover
      style={{boxShadow:'none'}}
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        PaperProps={{ style: { boxShadow: 'none' } }}
      >
        <div style={{padding:'4px',background:'#F9F0E6'}}>
          <ul style={{ listStyleType: 'none', padding: '0' }}>
            <li
              onClick={() => setMenu("Home")}
              className={menu === "Home" ? "active" : ""}
            >
              <Link className="link" to={"/"}>
                Home
              </Link>
            </li>
            <li
              onClick={() => setMenu("Promociones")}
              className={menu === "Promociones" ? "active" : ""}
            >
              <Link className="link" to={"/promociones"}>
                Promociones
              </Link>
            </li>
            {isLoggedIn && cliente && (
              <li
                onClick={() => setMenu("Pedidos")}
                className={menu === "Pedidos" ? "active" : ""}
              >
                <Link className="link" to={"/pedidos"}>
                  Pedidos
                </Link>
              </li>
            )}
            <li className="carrito-navBar">
              <div
                onClick={() => setMenu("Carrito")}
                className={`carrito ${menu === "Carrito" ? "active" : ""}`}
              >
                <Link className="link" to={"/cart"}>
                  Carrito
                </Link>
                <img src={assets.basket_icon} alt="" />
              </div>
              {isLoggedIn && cliente ? (
              <div style={{display:'flex'}}>
                {cliente.userName} 
                <img className="imgCliente" src={cliente.imagenCliente.url}  alt="clienteImg" />
              </div>
              ) : (
              <></>
              )}
              <div className="buttonPopover">
                {isLoggedIn && cliente ? (
                  <>
                  <span className="userName" style={{ color: 'tomato' }}>
        {cliente.userName}
      </span>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                  </>
                ) : (
                  <button onClick={() => setShowLogin(true)}>Iniciar Sesión</button>
                )}
              </div>
            </li>
            <li>
  
            </li>
          </ul>
        </div>
      </Popover>
    </div>
  );
};
