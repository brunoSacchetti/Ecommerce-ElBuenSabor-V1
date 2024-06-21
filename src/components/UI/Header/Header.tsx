import "./Header.css";



interface HeaderProps {
  onButtonClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onButtonClick }) => {
  return (
    <div className='header'>
      <div className="headers-content">
        <h2>Ordena tus comidas favoritas</h2>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis a ullam repudiandae. Illum sed est ipsa consequatur optio culpa esse quasi quisquam! Ullam quaerat possimus cumque, cupiditate in iure sunt?</p>
        <button onClick={onButtonClick}>View Menu</button>
      </div>
    </div>
  );
};