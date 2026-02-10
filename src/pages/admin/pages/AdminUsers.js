import { useEffect, useMemo, useRef, useState } from "react";
import AdminSearchBar from "../components/AdminSearchBar";
import StatusBadge from "../components/StatusBadge";
import UserModal from "../modals/UserModal";
import axios from "axios";


export default function AdminUsers() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     상단 통계
     =============================== */
  const stats = useMemo(() => {
    const total = users.length;
    const active = users.filter((u) => u.status === "active").length;
    const warned = users.filter((u) => u.status === "warned").length;
    const suspended = users.filter((u) => u.status === "suspended").length;
    const high = users.filter((u) => u.activity === "High").length;
    const reported = users.filter((u) => (u.reports || 0) > 0).length;
    return { total, active, warned, suspended, high, reported };
  }, [users]);

  /* ===============================
     검색 필터
     =============================== */
  const filtered = useMemo(() => {
    let result = users;

    const keyword = q.trim().toLowerCase();
    if (keyword) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(keyword) ||
          u.email.toLowerCase().includes(keyword) ||
          u.id.toLowerCase().includes(keyword)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((u) => u.status === statusFilter);
    }

    return result;
  }, [q, statusFilter, users]);

  /* ===============================
     회원 목록 조회 (정규화 포함)
     =============================== */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:9070/admin/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        console.log("ADMIN USERS:", res.data);

        // 🔥 퍼블리싱에 맞게 데이터 정규화
        const normalized = res.data.map((u) => ({
          id: String(u.user_no),
          name: u.user_nickname || u.user_id,
          email: u.user_id,
          role: u.user_grade || "GENERAL",
          status: "active",

          joinDate: new Date(u.create_datetime).toLocaleString("ko-KR"),

          // 🔥 이제 DB에서 오는 실제 값
          designs: u.designs ?? 0,
          pins: u.pins ?? 0,
          comments: u.comments ?? 0,

          // UI 전용 값만 유지
          activity: "Low",
          reports: 0,
        }));

        setUsers(normalized);
      } catch (err) {
        console.error("유저 목록 조회 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  /* ===============================
     바깥 클릭 시 메뉴 닫기
     =============================== */
  useEffect(() => {
    const onDown = (e) => {
      if (!openMenuId) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setOpenMenuId(null);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [openMenuId]);

  const toggleMenu = (id) => {
    setOpenMenuId((prev) => (prev === id ? null : id));
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setOpenMenuId(null);
  };

  return (
    <section className="admin-page">
      {/* 상단 타이틀 */}
      <div className="admin-card admin-card--header">
        <h2>사용자 관리</h2>
        <p>명확하고 데이터 중심적인 중재 효율성</p>
      </div>

      {/* 통계 카드 */}
      <div className="users-stats">
        <div className="users-stat">
          <div className="users-stat__label">전체 사용자</div>
          <div className="users-stat__value">{stats.total}</div>
        </div>
        <div className="users-stat">
          <div className="users-stat__label">활성</div>
          <div className="users-stat__value green">{stats.active}</div>
        </div>
        <div className="users-stat">
          <div className="users-stat__label">경고됨</div>
          <div className="users-stat__value amber">{stats.warned}</div>
        </div>
        <div className="users-stat">
          <div className="users-stat__label">정지됨</div>
          <div className="users-stat__value red">{stats.suspended}</div>
        </div>
        <div className="users-stat">
          <div className="users-stat__label">활발한 활동</div>
          <div className="users-stat__value">{stats.high}</div>
        </div>
        <div className="users-stat">
          <div className="users-stat__label">신고당한 사용자</div>
          <div className="users-stat__value red">{stats.reported}</div>
        </div>
      </div>

      {/* 검색 */}
      <div className="admin-card admin-card--search-bar">
        <AdminSearchBar
          value={q}
          onChange={setQ}
          placeholder="사용자 이름 또는 ID 검색..."
        />

        <div className="admin-select-wrapper">
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="warned">경고됨</option>
            <option value="suspended">정지됨</option>
            <option value="inactive">비활성</option>
          </select>
        </div>
      </div>

      {/* 테이블 */}
      <div className="users-table-wrap">
        {loading ? (
          <div className="admin-empty">불러오는 중...</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>사용자</th>
                <th>가입일</th>
                <th>디자인</th>
                <th>핀</th>
                <th>댓글</th>
                <th>신고당함</th>
                <th>활동</th>
                <th>상태</th>
                <th>작업</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">
                        {u.name.slice(0, 1)}
                      </div>
                      <div className="user-info">
                        <div className="user-name-row">
                          <span className="user-name">{u.name}</span>
                          <span
                            className={`user-chip user-chip--${u.role.toLowerCase()}`}
                          >
                            {u.role}
                          </span>
                        </div>
                        {/* <div className="user-id">{u.id}</div> */}
                      </div>
                    </div>
                  </td>

                  <td className="muted">{u.joinDate}</td>
                  <td className="center">{u.designs}</td>
                  <td className="center">{u.pins}</td>
                  <td className="center">{u.comments}</td>

                  <td className="center">
                    {u.reports > 0 ? (
                      <span className="report-num">{u.reports}</span>
                    ) : (
                      0
                    )}
                  </td>

                  <td>
                    <div
                      className={`activity activity--${u.activity.toLowerCase()}`}
                    >
                      <span className="activity-dot" />
                      {u.activity}
                    </div>
                  </td>

                  <td>
                    <StatusBadge value={u.status} />
                  </td>

                  <td className="center">
                    <div className="users-menu-wrap">
                      <button
                        type="button"
                        className="icon-btn users-menu-btn"
                        onClick={() => toggleMenu(u.id)}
                      >
                        ⋮
                      </button>

                      {openMenuId === u.id && (
                        <div className="users-menu" ref={menuRef}>
                          <button
                            className="users-menu__item"
                            onClick={() => openUserModal(u)}
                          >
                            👤 상세 보기
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 사용자 상세 모달 */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDeleted={(deletedId) => {
            setUsers((prev) => prev.filter((u) => u.id !== deletedId));
            setSelectedUser(null);
          }}
        />
      )}
    </section>
  );
}
