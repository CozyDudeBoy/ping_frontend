import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminTabs from './AdminTabs';
import AdminHeader from "./components/AdminHeader";

import '../styles/admin.scss';

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("관리자 로그인이 필요합니다.");
        navigate("/login");
        return;
      }

      try {
        // JWT Payload 디코딩 (Base64Url -> Base64 -> JSON)
        const payloadBase64 = token.split('.')[1];
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);

        // 관리자 권한 체크: user_id가 'admin' 이거나 user_role이 'ADMIN'
        if (payload.user_id !== 'admin' && payload.user_role !== 'ADMIN') {
          alert("접근 권한이 없습니다.");
          navigate("/");
        }
      } catch (error) {
        console.error("인증 확인 실패:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    checkAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="admin">
      <AdminHeader onLogout={handleLogout} />
      <AdminTabs />
      <main className="admin__main">
        <Outlet />
      </main>
    </div>
  );
}