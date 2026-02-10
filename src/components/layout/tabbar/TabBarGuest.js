import { NavLink } from "react-router-dom";

import HomeIcon from '../../../assets/icon-home.svg';
// import SearchIcon from '../../../assets/icon-search.svg';
import QnaIcon from '../../../assets/icon-question.svg'
import ArchiveIcon from '../../../assets/icon-archive.svg';
import LoginIcon from '../../../assets/icon-login.svg';

import '../../styles/tabbar.scss';

const TabBarGuest = () => {
  return (
    <nav className="tabbar guest">

      <NavLink to="/" className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
        <img src={HomeIcon} alt="홈" />
        <span>Home</span>
      </NavLink>
      <NavLink to="/archive" className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
        <img src={ArchiveIcon} alt="아카이브" />
        <span>Archive</span>
      </NavLink>
      <NavLink to="/qna" className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
        <img src={QnaIcon} alt="검색" />
        <span>Q&#x0026;A</span>
      </NavLink>
      <NavLink to="/login" className={({ isActive }) => isActive ? 'tab-item active' : 'tab-item'}>
        <img src={LoginIcon} alt="로그인으로 바로가기" />
        <span>Login</span>
      </NavLink>
    </nav>
  );
};

export default TabBarGuest;
