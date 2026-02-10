import { useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

import HeaderUser from './HeaderUser';
import HeaderGuest from './HeaderGuest';

// css
import '../../styles/common.scss';

const Header = () => {
  const isLogin = useAuth();
  const location = useLocation();

  const isMain = location.pathname === '/';

  // 로그인 전 + 메인
  if (!isLogin && isMain) {
    return <HeaderGuest variant="hero" />;
  }

  // 로그인 전 + 서브
  if (!isLogin) {
    return <HeaderGuest variant="default" />;
  }


  // 로그인 후
if (isLogin) {
  return <HeaderUser />;
}
};

export default Header;