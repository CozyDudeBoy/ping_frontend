import React from 'react';

export default function AdminHeader({ onLogout }) {
  return (
    <header className="admin-header">
      <div className="admin-header__left">
        <h1 className="admin-header__title">관리자 대시보드</h1>
        <p className="admin-header__desc">ping 커뮤니티 관리</p>
      </div>

      <div className="admin-header__right">
        <button type="button" className="admin-btn admin-btn--ghost">
          관리자
        </button>
        <button type="button" className="admin-btn" onClick={onLogout}>
          로그아웃
        </button>
      </div>
    </header>
  );
}
