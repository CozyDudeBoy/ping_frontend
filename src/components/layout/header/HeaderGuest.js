import { Link } from 'react-router-dom';

// 핑 로고(svg) 가져오기
import Logogray from '../../../assets/Logo_gray.svg';




const HeaderGuest = ({ variant }) => {
  return (
    <header className={`header guest ${variant}`}>

      <div className="header-wrapper">
        <h1>
          <Link to="/" alt="핑로고">
            <img src={Logogray} alt="핑로고" />
          </Link>
        </h1>

        <nav>
          <ul>
            <li>
              <Link to="/archive">Archive</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default HeaderGuest;
