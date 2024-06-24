import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { LoginPopup } from "../components/userInterface/LoginPopup/LoginPopup";

import { Home } from "../components/Screens/Home/Home";
import { Articulos } from "../components/Screens/Articulos/Articulos";
import { Pedidos } from "../components/Screens/Pedidos/Pedidos";
import { DomicilioPopup } from "../components/userInterface/DomicilioPopup/DomicilioPopup";
import Promociones from "../components/Screens/Promociones/Promociones";
import CartMP2Promo from "../components/Screens/Cart/CartMP2Promo";
import { NavbarPrueba } from "../components/userInterface/Navbar/NavbarPrueba";

export const AppRouter = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showDomicilio, setShowDomicilio] = useState(false);
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      {showDomicilio ? (
        <DomicilioPopup setShowDomicilio={setShowDomicilio} />
      ) : (
        <></>
      )}
      <div className="app">
        <NavbarPrueba setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articulos" element={<Articulos />} />
          <Route
            path="/cart"
            element={<CartMP2Promo setShowDomicilio={setShowDomicilio} />}
          />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/promociones" element={<Promociones />} />
        </Routes>
      </div>
    </>
  );
};
