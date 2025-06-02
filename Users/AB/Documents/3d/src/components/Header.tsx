import hero1 from '../assets/hero-1.jpg';
import hero2 from '../assets/hero-2.jpg';
import hero3 from '../assets/hero-3.jpg';

const Header = () => {
  return (
    <div>
      <img src={hero1} alt="Hero 1" />
      <img src={hero2} alt="Hero 2" />
      <img src={hero3} alt="Hero 3" />
    </div>
  );
};

export default Header;