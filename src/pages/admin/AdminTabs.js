import { NavLink } from "react-router-dom";

export default function AdminTabs() {
  const tabs = [
    { to: "/admin/design", label: "디자인" },
    { to: "/admin/pins", label: "핀 & 질문" },
    { to: "/admin/comments", label: "댓글" },
    { to: "/admin/users", label: "사용자" },
    { to: "/admin/issue", label: "문제 유형 관리" },
  ];

  return (
    <nav className="admin-tabs">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          className={({ isActive }) =>
            isActive ? "admin-tabs__item active" : "admin-tabs__item"
          }
        >
          {t.label}
        </NavLink>
      ))}
    </nav>
  );
}
