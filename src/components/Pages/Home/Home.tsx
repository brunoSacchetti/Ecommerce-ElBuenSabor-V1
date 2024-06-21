
import { Header } from "../../ui/Header/Header";
import { Categories } from "../Categories/Categories";
import "./Home.css"
import { Footer } from "../../ui/Footer/Footer";
import { useRef } from "react";

export const Home: React.FC = () => {
  const exploreMenuRef = useRef<HTMLDivElement | null>(null);

  const scrollToExploreMenu = () => {
    exploreMenuRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div>
      <Header onButtonClick={scrollToExploreMenu} />
      <Categories ref={exploreMenuRef} />
      <Footer />
    </div>
  );
};