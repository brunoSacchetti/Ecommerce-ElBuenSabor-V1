import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import { LoginPopup } from "../components/ui/LoginPopup/LoginPopup";
import { Navbar } from "../components/ui/Navbar/Navbar";
import { Home } from "../components/pages/Home/Home";

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
