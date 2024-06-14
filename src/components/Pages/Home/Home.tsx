import React from "react";
import { Header } from "../../ui/Header/Header";
import { Categories } from "../Categories/Categories";
import "./Home.css"
export const Home = () => {
  return (
    <div>
      <Header />
      <Categories />
    </div>
  );
};
