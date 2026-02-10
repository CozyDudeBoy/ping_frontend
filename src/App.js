import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

// 스타일가이드
import './styles/base.scss';  //초기화 및 기본 스타일 가이드

// 컴포넌트

// import TabBarUser from './components/layout/tabbar/TabBarUser';
import TabBar from './components/layout/tabbar/TabBar';
import Header from "./components/layout/header/Header";

import Footer from './components/layout/Footer';


// 페이지
import Main from './pages/Main';
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Detail from './pages/design/Detail';
import Upload from "./pages/upload/Upload";
import Archive from './pages/design/Archive';
import PinEditor from "./pages/upload/PinEditor";

// 마이페이지
import MyPageLayout from './pages/mypage/MyPageLayout';
import MyDesigns from './pages/mypage/MyDesigns';
import MyPins from './pages/mypage/MyPins';
import MyFeedback from './pages/mypage/MyFeedback';
import FeedbackDetail from "./pages/mypage/FeedbackDetail";
import MyProfile from './pages/mypage/MyProfile';
import MyAlarm from './pages/mypage/MyAlarm';

// 관리자 페이지
import AdminLayout from './pages/admin/AdminLayout';
import AdminDesign from './pages/admin/pages/AdminDesign';
import AdminPins from './pages/admin/pages/AdminPins';
import AdminComments from './pages/admin/pages/AdminComments';
import AdminUsers from './pages/admin/pages/AdminUsers';
import AdminIssueTypes from './pages/admin/pages/AdminIssueTypes';
import Question from "./pages/questions/Question";
import QuestionForm from "./pages/questions/QuestionForm";


function App() {
  return (
    < >
      <BrowserRouter>

        {/* 헤더 */}

        <Header />

        <Routes>

          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<Upload />} />
          <Route path='/detail/:id' element={<Detail />} />
          <Route path='/archive' element={<Archive />} />
          <Route path="/upload/pineditor" element={<PinEditor />} />
          <Route path='/qna' element={<Question/>} />
          <Route path='/qna/form' element={<QuestionForm/>} />

          {/* 마이페이지 레이아웃 */}
          <Route path="/mypage" element={<MyPageLayout />}>
            <Route index element={<MyDesigns />} />
            <Route path="designs/:id" element={<Detail />} />
            <Route path="pins" element={<MyPins />} />
            <Route path="feedback" element={<MyFeedback />} />
            <Route path="/mypage/feedback/:answer_no" element={<FeedbackDetail />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="alarm" element={<MyAlarm />} />
          </Route>
          
          {/* 관리자 레이아웃 */}
          <Route path="/admin" element={<AdminLayout />}>
            {/*  /admin -> /admin/design 로 URL을 바꿔줌 */}
            <Route index element={<Navigate to="design" replace />} />
            <Route path="design" element={<AdminDesign />} />
            <Route path="pins" element={<AdminPins />} />
            <Route path="comments" element={<AdminComments />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="issue" element={<AdminIssueTypes />} />
          </Route>
        </Routes>

        {/* 모바일 탭바 */}
        <TabBar />

        {/* 푸터 */}
        <Footer />



      </BrowserRouter>
    </>
  );
}

export default App;
