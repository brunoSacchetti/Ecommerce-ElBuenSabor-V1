import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { LoginPopup } from "../components/ui/LoginPopup/LoginPopup";
import { Navbar } from "../components/ui/Navbar/Navbar";
import { Home } from "../components/pages/Home/Home";
import { Articulos } from "../components/pages/Articulos/Articulos";
import { Pedidos } from "../components/pages/Pedidos/Pedidos";
import { DomicilioPopup } from "../components/ui/DomicilioPopup/DomicilioPopup";
import Promociones from "../components/pages/Promociones/Promociones";
import CartMP2Promo from "../components/pages/Cart/CartMP2Promo";



export const AppRouter = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showDomicilio, setShowDomicilio] = useState(false);
  return (
    <>
     
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      {showDomicilio ? <DomicilioPopup setShowDomicilio={setShowDomicilio} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articulos" element={<Articulos/>} />
          <Route path="/cart" element={<CartMP2Promo setShowDomicilio={setShowDomicilio}/>} />
          <Route path="/pedidos" element={ <Pedidos/>} />
          <Route path="/promociones" element={<Promociones/>} />
        </Routes>
      </div>
    </>
  );
};
