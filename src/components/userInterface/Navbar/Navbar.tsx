import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../../assets/assets";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/userSlice";
import { useAppSelector } from "../../../hooks/redux";
import { Popover, Typography } from "@mui/material";
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

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handlePopoverMouseEnter = () => {
    // Mantener el popover abierto cuando el ratón entra en el popover
    setAnchorEl(anchorEl);
  };

  const handlePopoverMouseLeave = () => {
    // Cerrar el popover cuando el ratón sale del popover
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'mouse-over-popover' : undefined;
  
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
              {" "}
              Pedidos
            </Link>
          </li>
        ) : (
          <></>
        )}
        <div className="carrito-navBar">
          <li
            onClick={() => setMenu("Carrito")}
            className={`carrito ${menu === "Carrito" ? "active" : ""}`}
          >
            <Link className="link" to={"/cart"}>
              Carrito
            </Link>
            <img src={assets.basket_icon} alt="" />
          </li>
        </div>
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
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <MenuOpenIcon style={{ width: '30px', height: '30px' }} />
      </div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          pointerEvents: 'auto', // Asegurarse de que los eventos del ratón se manejen correctamente
        }}
        disableRestoreFocus
        onMouseEnter={handlePopoverMouseEnter}
        onMouseLeave={handlePopoverMouseLeave}
      >
        <Typography sx={{ p: 0.5 }}>
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
            {isLoggedIn && cliente ? (
              <li
                onClick={() => setMenu("Pedidos")}
                className={menu === "Pedidos" ? "active" : ""}
              >
                <Link className="link" to={"/pedidos"}>
                  {" "}
                  Pedidos
                </Link>
              </li>
            ) : (
              <></>
            )}
            <div className="carrito-navBar">
              <li
                onClick={() => setMenu("Carrito")}
                className={`carrito ${menu === "Carrito" ? "active" : ""}`}
              >
                <Link className="link" to={"/cart"}>
                  Carrito
                </Link>
                <img src={assets.basket_icon} alt="" />
              </li>
              <div className="buttonPopover">
                {isLoggedIn && cliente ? (
                  <>
                    <span className="userName">{cliente.userName}</span>
                    <button onClick={handleLogout}>Cerrar Sesión</button>
                  </>
                ) : (
                  <button onClick={() => setShowLogin(true)}>Iniciar Sesión</button>
                )}
              </div>
            </div>
          </ul>
        </Typography>
      </Popover>
    </div>
  );
};
