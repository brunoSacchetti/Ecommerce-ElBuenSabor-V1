import "./Header.css";



interface HeaderProps {
  onButtonClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onButtonClick }) => {
  return (
    <div className='header'>
      <div className="headers-content">
        <h2>Ordena tus comidas favoritas</h2>
        <p>Bienvenido a nuestro restaurante, donde cada platillo es una obra de arte culinaria. Disfruta de una experiencia gastronómica única, con ingredientes frescos y recetas tradicionales que te harán sentir como en casa. ¡Descubre nuestro menú y déjate sorprender!</p>
        <button onClick={onButtonClick}>View Menu</button>
      </div>
    </div>
  );
};