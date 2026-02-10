import { Outlet } from 'react-router-dom';
import MyPageTabs from './MyPageTabs';  // 마이페이지 상단 메뉴
import MyPageHeader from './MyPageHeader';

import '../styles/mypage.scss';

const MyPageLayout = () => {
  return (

    <main className="container" >
      <section className="mypage-layout">
        {/* 마이페이지메뉴 */}
        <MyPageTabs />
        {/* 프로필 카드 */}
        <MyPageHeader />   

        {/*  페이지별로 바뀌는 영역: 디자인 핀, 피드백, 프로필 */}
        <Outlet />
      </section>
    </main>
  );
};

export default MyPageLayout;
