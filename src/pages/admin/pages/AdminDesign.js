import { useEffect, useMemo, useState } from "react";
import AdminSearchBar from "../components/AdminSearchBar";
import StatusBadge from "../components/StatusBadge";
import DesignModal from "../modals/DesignModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import { getPosts } from "../../../api/Admin_Api";

export default function AdminDesign() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'active', 'flagged', 'deleted'

  const [viewItem, setViewItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPosts()
      .then((res) => {
        if (!Array.isArray(res.data)) {
          throw new Error("데이터 형식이 올바르지 않습니다.");
        }
        const mapped = res.data.map((item) => ({
          id: item.id,
          title: item.title,
          author: item.author,
          status: "active",
          pins: item.pins || 0,
          comments: item.comments || 0,
          reports: 0,
          createdAt: item.createdAt,
          issueTypes: [],
        }));
        setRows(mapped);
      })
      .catch((err) => {
        console.error("디자인 목록 로드 실패:", err);
        const serverMsg =
          (err && err.response && err.response.data && err.response.data.message) ||
          (err && err.response && typeof err.response.data === "string" && err.response.data) ||
          err?.message;
        setError(serverMsg || "데이터를 불러오는 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let result = rows;

    // 1. 검색어 필터
    const keyword = q.trim().toLowerCase();
    if (keyword) {
      result = result.filter((r) =>
        r.title.toLowerCase().includes(keyword) ||
        r.author.toLowerCase().includes(keyword)
      );
    }

    // 2. 상태 필터 (statusFilter)
    if (statusFilter !== "all") {
      // active, flagged, deleted 등
      result = result.filter((r) => r.status === statusFilter);
    }

    return result;
  }, [q, rows, statusFilter]);

  // ✅ 모달에서 저장된 값 반영(지금은 로컬 state만 갱신)
  const handleSaveFromModal = ({ id, issueTypes, message }) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, issueTypes, lastMessage: message } : r))
    );
    setViewItem(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteItem) return;
    const targetId = deleteItem.id;
    import("../../../api/Admin_Api").then(({ deletePost }) => {
      deletePost(targetId)
        .then(() => {
          setRows((prev) => prev.filter((r) => r.id !== targetId));
        })
        .catch((err) => {
          const msg =
            (err && err.response && err.response.data && (err.response.data.message || err.response.data.error)) ||
            err?.message ||
            "삭제 실패";
          alert(msg);
        })
        .finally(() => {
          setDeleteItem(null);
        });
    });
  };

  return (
    <section className="admin-page">
      {/* 검색 & 필터 영역 */}
      <div className="admin-card admin-card--search-bar">
        <AdminSearchBar
          value={q}
          onChange={setQ}
          placeholder="디자인 검색..."
        />
        <div className="admin-select-wrapper">
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">모든 상태</option>
            <option value="active">활성화</option>
            <option value="flagged">플래그</option>
            <option value="deleted">삭제됨</option>
          </select>
          <span className="admin-select-arrow">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </div>

      {/* 테이블 영역 */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "40%" }}>디자인</th>
              <th>작성자</th>
              <th>상태</th>
              <th>핀</th>
              <th>댓글</th>
              <th>신고</th>
              <th>생성일</th>
              <th>작업</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="no-result">데이터를 불러오는 중...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="no-result">{error}</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-result">검색 결과가 없습니다.</td>
              </tr>
            ) : (
              filtered.map((row) => (
                <tr key={row.id}>
                  <td className="col-title">
                    <strong className="title">{row.title}</strong>
                  </td>
                  <td>{row.author}</td>
                  <td>
                    <StatusBadge value={row.status} />
                  </td>
                  <td>{row.pins}</td>
                  <td>{row.comments}</td>
                  <td className={row.reports > 0 ? "text-danger" : ""}>{row.reports}</td>
                  <td className="col-date">{row.createdAt}</td>
                  <td className="col-actions">
                    <div className="row-actions">
                      <button
                        type="button"
                        className="icon-btn"
                        aria-label="보기"
                        title="보기"
                        onClick={() => setViewItem(row)}
                      >
                        👁
                      </button>
                      <button
                        type="button"
                        className="icon-btn danger"
                        aria-label="삭제"
                        title="삭제"
                        onClick={() => setDeleteItem(row)}
                      >
                        🗑
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 👁 디자인 검토 모달 */}
      {viewItem && (
        <DesignModal
          item={viewItem}
          onClose={() => setViewItem(null)}
          onSave={handleSaveFromModal}
        />
      )}

      {/* 🗑 삭제 확인 모달 */}
      {deleteItem && (
        <ConfirmDeleteModal
          title="삭제하시겠습니까?"
          message={`"${deleteItem.title}"을(를) 삭제합니다.`}
          confirmText="삭제"
          cancelText="취소"
          onConfirm={handleConfirmDelete}
          onClose={() => setDeleteItem(null)}
        />
      )}
    </section>
  );
}
