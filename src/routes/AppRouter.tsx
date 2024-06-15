import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { LoginPopup } from "../components/ui/LoginPopup/LoginPopup";
import { Navbar } from "../components/ui/Navbar/Navbar";
import { Home } from "../components/pages/Home/Home";
import { Articulos } from "../components/pages/Articulos/Articulos";
import Cart from "../components/pages/Cart/Cart";
import { Pedidos } from "../components/pages/Pedidos/Pedidos";


export const AppRouter = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articulos" element={<Articulos/>} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/pedidos" element={ <Pedidos/>} />
        </Routes>
      </div>
    </>
  );
};
