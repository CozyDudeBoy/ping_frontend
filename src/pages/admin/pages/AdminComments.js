import { useEffect, useMemo, useRef, useState } from "react";
import AdminSearchBar from "../components/AdminSearchBar";
import StatusBadge from "../components/StatusBadge";
import CommentModal from "../modals/CommentModal";

export default function AdminComments() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const [modalItem, setModalItem] = useState(null);

  // ✅ 더미 데이터
  const [rows, setRows] = useState([
    {
      id: 1,
      user: "최현우",
      status: "active",
      designTitle: "모바일 뱅킹 앱 - 거래 플로우",
      pinQuestion:
        "거래 확인 단계에서 사용자가 금액을 다시 확인할 수 있는 시각적 강조가 충분한가요?",
      comment:
        "거래 확인 화면에서 금액을 더 크게 표시하고, 중요한 정보는 색상으로 강조하는 것은 어떨까요? 사용자의 실수를 줄이는 데 도움이 될 것 같습니다.",
      date: "2026년 1월 17일 오후 07:30",
      thumb: "/images/sample.jpg",
    },
    {
      id: 2,
      user: "spam_user",
      status: "flagged",
      designTitle: "이커머스 제품 페이지",
      pinQuestion: "제품 이미지와 설명 사이의 간격이 너무 좁아서 정보가 답답해 보입니다.",
      comment: "여기 링크 클릭하세요 http://spam-site.com 무료 디자인 팁!",
      date: "2026년 1월 17일 오후 04:20",
      thumb: "/images/sample.jpg",
    },
  ]);

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    return rows.filter((r) => {
      const matchKeyword =
        !keyword ||
        r.user.toLowerCase().includes(keyword) ||
        r.designTitle.toLowerCase().includes(keyword) ||
        r.pinQuestion.toLowerCase().includes(keyword) ||
        r.comment.toLowerCase().includes(keyword);

      const matchStatus =
        status === "all" ||
        (status === "active" && r.status === "active") ||
        (status === "hidden" && r.status === "hidden") ||
        (status === "deleted" && r.status === "deleted");

      return matchKeyword && matchStatus;
    });
  }, [q, status, rows]);

  // ✅ 바깥 클릭 시 메뉴 닫기
  useEffect(() => {
    const onDown = (e) => {
      if (!openMenuId) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setOpenMenuId(null);
    };
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [openMenuId]);

  const toggleMenu = (id) => setOpenMenuId((prev) => (prev === id ? null : id));

  const openCommentModal = (row) => {
    setModalItem(row);
    setOpenMenuId(null);
  };

  // 메뉴 액션들 (일단 UI/상태만)
  const actionPinView = (row) => {
    console.log("핀 보기", row.id);
    setOpenMenuId(null);
  };
  const actionWarn = (row) => {
    setModalItem(row); // 모달에서 경고 발송 섹션 제공
    setOpenMenuId(null);
  };
  const actionRestrict = (row) => {
    setModalItem(row); // 모달에서 제한 적용 섹션 제공
    setOpenMenuId(null);
  };
  const actionDelete = (row) => {
    setModalItem(row); // 모달에서 삭제 섹션 제공
    setOpenMenuId(null);
  };

  return (
    <section className="admin-page">
      {/* 상단 설명 */}
      <div className="admin-card admin-card--header">
        <h2>댓글 검토</h2>
        <p>건설적인 토론 분위기를 유지하고 커뮤니티 가이드라인을 관리합니다</p>
      </div>

      {/* 검색 + 상태 */}
      <div className="admin-card admin-card--search-bar">
        <AdminSearchBar value={q} onChange={setQ} placeholder="댓글 검색..." />

        <div className="admin-select-wrapper">
          <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="hidden">숨김</option>
            <option value="deleted">삭제됨</option>
          </select>
          <span className="admin-select-arrow">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>

      {/* 리스트 */}
      <div className="comment-list">
        {filtered.map((row) => (
          <div key={row.id} className="comment-card">
            <img src={row.thumb} alt="" className="comment-thumb" />

            <div className="comment-body">
              <div className="comment-top">
                <div className="comment-user">
                  <strong>{row.user}</strong>
                  <StatusBadge value={row.status} />
                </div>

                <div className="comment-menu-wrap">
                  <button
                    type="button"
                    className="icon-btn comment-menu-btn"
                    aria-label="메뉴"
                    onClick={() => toggleMenu(row.id)}
                  >
                    ⋮
                  </button>

                  {openMenuId === row.id && (
                    <div className="comment-menu" ref={menuRef}>
                      <button className="comment-menu__item" onClick={() => actionPinView(row)}>
                        👁 핀 보기
                      </button>
                      <button className="comment-menu__item" onClick={() => actionWarn(row)}>
                        🛡 경고 발송
                      </button>
                      <button className="comment-menu__item" onClick={() => actionRestrict(row)}>
                        ⛔ 댓글 제한
                      </button>

                      <div className="comment-menu__divider" />

                      <button
                        className="comment-menu__item comment-menu__item--danger"
                        onClick={() => actionDelete(row)}
                      >
                        🗑 댓글 삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="comment-pin">
                <div className="comment-pin__label">핀 질문</div>
                <div className="comment-pin__text">{row.pinQuestion}</div>
              </div>

              <div className="comment-text">{row.comment}</div>

              <div className="comment-date">{row.date}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {modalItem && (
        <CommentModal
          item={modalItem}
          onClose={() => setModalItem(null)}
          onApply={(payload) => {
            console.log("apply action", payload);
            setModalItem(null);
          }}
        />
      )}
    </section>
  );
}
