import { Route, Routes } from "react-router-dom";
import { Home } from "../components/Pages/Home/Home";
import { Navbar } from "../components/UI/Navbar/Navbar";
import { useState } from "react";
import { LoginPopup } from "../components/UI/LoginPopup/LoginPopup";

export const AppRouter = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </>
  );
};
