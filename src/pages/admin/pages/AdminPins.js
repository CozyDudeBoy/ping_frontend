import { useEffect, useMemo, useRef, useState } from "react";
import AdminSearchBar from "../components/AdminSearchBar";
import StatusBadge from "../components/StatusBadge";
import PinsModal from "../modals/PinsModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

export default function AdminPins() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [issue, setIssue] = useState("all");

  // 어떤 카드의 메뉴가 열렸는지
  const [openMenuId, setOpenMenuId] = useState(null);

  // 모달
  const [reviewItem, setReviewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const menuRef = useRef(null);

  // ✅ 더미 데이터 (API로 교체 예정)
  const [rows, setRows] = useState([
    {
      id: 1,
      designTitle: "모바일 뱅킹 앱 - 거래 플로우",
      question:
        "거래 확인 단계에서 사용자가 금액을 다시 확인할 수 있는 시각적 강조가 충분한가요? 특히 고액 거래 시 실수를 방지하기 위한 디자인적 장치가 필요할 것 같습니다.",
      author: "김서연",
      issueType: "정보 위계",
      status: "active",
      comments: 8,
      date: "2026년 1월 16일 오후 06:30",
      image: "/images/sample.jpg",
      isHidden: false,
      isLocked: false,
    },
    {
      id: 2,
      designTitle: "모바일 뱅킹 앱 - 거래 플로우",
      question:
        "이전 단계로 돌아가는 네비게이션이 명확하지 않습니다. 백 버튼의 위치와 스타일 개선이 필요할까요?",
      author: "김서연",
      issueType: "네비게이션 구조",
      status: "active",
      comments: 3,
      date: "2026년 1월 15일 오후 04:10",
      image: "/images/sample.jpg",
      isHidden: false,
      isLocked: true,
    },
  ]);

  // 상태/문제유형 옵션
  const statusOptions = useMemo(
    () => [
      { value: "all", label: "모든 상태" },
      { value: "active", label: "활성" },
      { value: "hidden", label: "숨김" },
      { value: "deleted", label: "삭제됨" },
    ],
    []
  );

  const issueOptions = useMemo(
    () => [
      "정보구조",
      "네비게이션 구조",
      "콘텐츠 조직",
      "라벨링",
      "사용자 흐름",
      "피드백/응답",
      "제스처/동작",
      "마이크로 인터렉션",
      "접근성",
      "가독성",
      "오류방지",
      "일관성",
      "레이아웃/그리드",
      "타이포그래피",
      "색상사용",
      "여백/간격",
      "시각적 위계",
    ],
    []
  );

  // ✅ 필터링(간단 버전)
  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();

    return rows.filter((r) => {
      const matchKeyword =
        !keyword ||
        r.question.toLowerCase().includes(keyword) ||
        (r.designTitle || "").toLowerCase().includes(keyword) ||
        (r.author || "").toLowerCase().includes(keyword);

      const matchStatus =
        status === "all" ||
        (status === "hidden" && r.isHidden) ||
        (status === "active" && !r.isHidden) ||
        (status === "deleted" && r.status === "deleted"); // 나중에 삭제상태 컬럼 있으면 교체

      const matchIssue = issue === "all" || r.issueType === issue;

      return matchKeyword && matchStatus && matchIssue;
    });
  }, [q, status, issue, rows]);

  // ✅ 바깥 클릭하면 메뉴 닫기
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

  // ===== 메뉴 액션들 =====
  const actionHidePin = (row) => {
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, isHidden: true } : r))
    );
    setOpenMenuId(null);
  };

  const actionToggleLock = (row) => {
    setRows((prev) =>
      prev.map((r) => (r.id === row.id ? { ...r, isLocked: !r.isLocked } : r))
    );
    setOpenMenuId(null);
  };

  const actionReviewQuestion = (row) => {
    setReviewItem(row);
    setOpenMenuId(null);
  };

  const actionAskDelete = (row) => {
    setDeleteItem(row);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (!deleteItem) return;
    // ✅ 실제로는 API 호출 후 목록 갱신
    setRows((prev) => prev.filter((r) => r.id !== deleteItem.id));
    setDeleteItem(null);
  };

  return (
    <section className="admin-page">
      {/* 상단 설명 카드 */}
      <div className="admin-card admin-card--header">
        <h2>핀 & 질문 검토</h2>
        <p>핀의 질문 명확성과 토론 품질을 관리합니다</p>
      </div>

      {/* 검색 + 필터 */}
      <div className="admin-card admin-card--search-bar">
        <AdminSearchBar value={q} onChange={setQ} placeholder="질문 검색..." />

        <div className="admin-select-wrapper">
          <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <span className="admin-select-arrow">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>

        <div className="admin-select-wrapper">
          <select className="admin-select" value={issue} onChange={(e) => setIssue(e.target.value)}>
            <option value="all">사용자 제어</option>
            {issueOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <span className="admin-select-arrow">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>

      {/* 카드 리스트 */}
      <div className="pin-list">
        {filtered.map((row) => (
          <div key={row.id} className="pin-card">
            <img src={row.image} alt="" className="pin-thumb" />

            <div className="pin-body">
              <div className="pin-tags">
                <span className="pin-issue">{row.issueType}</span>
                <StatusBadge value={row.isHidden ? "hidden" : row.status} />
                {row.isLocked && <span className="pin-lock">🔒 댓글 잠금</span>}
              </div>

              <div className="pin-question">{row.question}</div>

              <div className="pin-meta">
                💬 {row.comments} · {row.author} · {row.date}
              </div>
            </div>

            {/* ⋮ 메뉴 */}
            <div className="pin-actions">
              <button
                type="button"
                className="icon-btn pin-menu-btn"
                aria-label="메뉴"
                onClick={() => toggleMenu(row.id)}
              >
                ⋮
              </button>

              {openMenuId === row.id && (
                <div className="pin-menu" ref={menuRef}>
                  <button type="button" className="pin-menu__item" onClick={() => actionHidePin(row)}>
                    👁‍🗨 핀 숨기기
                  </button>

                  <button
                    type="button"
                    className="pin-menu__item"
                    onClick={() => actionToggleLock(row)}
                  >
                    🔒 댓글 잠금
                  </button>

                  <button
                    type="button"
                    className="pin-menu__item"
                    onClick={() => actionReviewQuestion(row)}
                  >
                    ✏ 질문 검토
                  </button>

                  <div className="pin-menu__divider" />

                  <button
                    type="button"
                    className="pin-menu__item pin-menu__item--danger"
                    onClick={() => actionAskDelete(row)}
                  >
                    🗑 핀 삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 질문 검토 모달 */}
      {reviewItem && (
        <PinsModal
          item={reviewItem}
          onClose={() => setReviewItem(null)}
          onSend={(payload) => console.log("send 수정요청", payload)}
        />
      )}

      {/* 삭제 확인 모달 */}
      {deleteItem && (
        <ConfirmDeleteModal
          title="삭제하시겠습니까?"
          message={`"${deleteItem.designTitle}"의 핀을 삭제합니다.`}
          confirmText="삭제"
          cancelText="취소"
          onConfirm={confirmDelete}
          onClose={() => setDeleteItem(null)}
        />
      )}
    </section>
  );
}
