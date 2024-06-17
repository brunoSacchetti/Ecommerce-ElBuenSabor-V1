import { assets } from "../../../assets/assets";
import "./Footer.css";

export const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img src="./POLLOLOGO.png" alt="" style={{height:'200px',width:'200px'}} />
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit
            possimus perferendis placeat vero ad quis dicta distinctio
            consequuntur odit
          </p>
          <div className="footer-social-icons">
            <img src={assets.facebook_icon} alt="" />
            <img src={assets.twitter_icon} alt="" />
            <img src={assets.linkedin_icon} alt="" />
          </div>
        </div>
        <div className="footer-content-center">
            <h2>Compañia</h2>
            <ul>
                <li>Home</li>
                <li>Sobre nosotros</li>
                <li>Privacy policy</li>
            </ul>
        </div>
        <div className="footer-content-right">
            <h2>Contactanos</h2>
            <ul>
                <li>+54-232312332</li>
                <li>Buensabor@gmail.comm</li>
            </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 ¬ BuenSabor.com - All Right Reserved</p>
    </div>
  );
};