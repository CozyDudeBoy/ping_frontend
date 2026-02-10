import { useLocation } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

import TabBarGuest from './TabBarGuest';
import TabBarUser from './TabBarUser';





const TabBar = () => {
  const isLogin = useAuth();
  const location = useLocation();

  const isMain = location.pathname === '/';

  // 로그인 전 + 메인
  if (!isLogin && isMain) {
    return <TabBarGuest />;
  }

  // 로그인 전 + 서브
  if (!isLogin) {
    return <TabBarGuest  />;
  }

  // 로그인 후
  return <TabBarUser />;
};

export default TabBar;
