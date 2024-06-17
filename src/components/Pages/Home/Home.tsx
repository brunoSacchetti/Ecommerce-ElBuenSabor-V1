import React from "react";
import { Header } from "../../ui/Header/Header";
import { Categories } from "../Categories/Categories";
import "./Home.css"
import { Footer } from "../../ui/Footer/Footer";
export const Home = () => {
  return (
    <div>
      <Header />
      <Categories />
      <Footer/>
    </div>
  );
};
