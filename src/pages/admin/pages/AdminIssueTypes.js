import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import AdminSearchBar from "../components/AdminSearchBar";

import IssueTypeCreateModal from "../modals/IssueTypeCreateModal";
import IssueTypeEditModal from "../modals/IssueTypeEditModal";
import IssueTypeMergeModal from "../modals/IssueTypeMergeModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

import {
  fetchIssueTypes,
  createIssueType,
  updateIssueType,
  setIssueTypeActive,
  mergeIssueTypes,
} from "../../../api/Admin_Api";

import { ISSUE_TAXONOMY } from "../data/issueTaxonomy";

export default function AdminIssueTypes() {
  const [q, setQ] = useState("");
  const [theme, setTheme] = useState("all");   // "all" | "정보구조" | ...
  const [status, setStatus] = useState("all"); // "all" | "active" | "inactive"

  // ⋮ 메뉴
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // 모달 상태
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [mergeTarget, setMergeTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 서버 데이터
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  const GROUPNO_TO_COLOR = {
    1: "green",   // 정보구조
    2: "blue",    // 인터랙션
    3: "purple",  // 사용성
    4: "red",     // 비주얼 디자인
  };
  // ====== 테마(한글) <-> group_no 매핑 ======
  const THEME_TO_GROUPNO = useMemo(
    () => ({
      "정보구조": 1,
      "인터랙션": 2,
      "사용성": 3,
      "비주얼 디자인": 4,
    }),
    []
  );

  const GROUPNO_TO_THEME = useMemo(
    () => ({
      1: "정보구조",
      2: "인터랙션",
      3: "사용성",
      4: "비주얼 디자인",
    }),
    []
  );

  // ISSUE_TAXONOMY groupKey -> group_no 매핑 (네 taxonomy 키가 다르면 여기만 맞추면 됨)
  const GROUPKEY_TO_GROUPNO = useMemo(
    () => ({
      information_structure: 1,
      interaction: 2,
      usability: 3,
      visual_design: 4,
    }),
    []
  );

  const GROUPNO_TO_GROUPKEY = useMemo(
    () => ({
      1: "information_structure",
      2: "interaction",
      3: "usability",
      4: "visual_design",
    }),
    []
  );

  // 서버 row -> UI type 변환
  const mapRowToType = useCallback(
    (r) => {
      const group_no = Number(r.group_no);
      const groupKey = GROUPNO_TO_GROUPKEY[group_no] || "usability";
      const groupKo = GROUPNO_TO_THEME[group_no] || "기타";

      return {
        id: r.category_no,
        group_no,
        groupKey,
        groupLabel: "",
        groupKo,
        name: r.category_name,
        nameEn: "",
        desc: "", // 지금 DB에 desc 없으니 빈값
        createdAt: r.created_at,
        usageCount: Number(r.usage_count || 0),
        isActive: Number(r.is_active) === 1,
      };
    },
    [GROUPNO_TO_GROUPKEY, GROUPNO_TO_THEME]
  );

  // 목록 로드
  const loadTypes = useCallback(async () => {
    setLoading(true);
    try {
      const groupNoParam = theme === "all" ? "all" : (THEME_TO_GROUPNO[theme] || "all");
      const res = await fetchIssueTypes(groupNoParam, status);
      const rows = res.data || [];
      setTypes(rows.map(mapRowToType));
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "문제 유형을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, [theme, status, THEME_TO_GROUPNO, mapRowToType]);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  // 메뉴 바깥 클릭 닫기
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

  // actions
  const openEdit = (t) => {
    setEditTarget(t);
    setOpenMenuId(null);
  };

  const openMerge = (t) => {
    setMergeTarget(t);
    setOpenMenuId(null);
  };

  const openDelete = (t) => {
    setDeleteTarget(t);
    setOpenMenuId(null);
  };

  // 서버 반영: 비활성/활성 토글
  const toggleActive = async (t) => {
    try {
      await setIssueTypeActive(t.id, t.isActive ? 0 : 1);
      await loadTypes();
    } catch (e) {
      alert(e?.response?.data?.message || "상태 변경 실패");
    } finally {
      setOpenMenuId(null);
    }
  };

  // Create
  const onCreate = async ({ name, desc, groupNo }) => {
    try {
      const group_no = Number(groupNo);
      if (!group_no) throw new Error("테마(groupNo) 값이 올바르지 않습니다.");

      await createIssueType({
        group_no,
        category_name: (name || "").trim(),
      });

      await loadTypes();
      setIsCreateOpen(false);
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "추가 실패");
    }
  };

  // Edit
  const onEditSave = async ({ id, name, desc, groupKey }) => {
    try {
      const group_no = GROUPKEY_TO_GROUPNO[groupKey];
      if (!group_no) throw new Error("테마(groupKey) 매핑이 올바르지 않습니다.");

      await updateIssueType(id, {
        group_no,
        category_name: (name || "").trim(),
      });

      await loadTypes();
      setEditTarget(null);
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "수정 실패");
    }
  };

  // Merge
  const onMergeApply = async ({ sourceId, targetId }) => {
    try {
      await mergeIssueTypes(sourceId, targetId);
      await loadTypes();
      setMergeTarget(null);
    } catch (e) {
      alert(e?.response?.data?.message || "병합 실패");
    }
  };

  // 상단 통계
  const stats = useMemo(() => {
    const totalTypes = types.length;
    const activeTypes = types.filter((t) => t.isActive).length;
    const totalUsage = types.reduce((sum, t) => sum + (t.usageCount || 0), 0);
    const pinnedCount = 121; // TODO: 나중에 API로 연결
    return { totalTypes, activeTypes, totalUsage, pinnedCount };
  }, [types]);

  // 그룹별 분포(상단 막대) - usageCount가 0이라면 0%로 보일 수 있음(정상)
  const groupDist = useMemo(() => {
    // group_no 1~4 고정
    const groups = [
      { group_no: 1, label: "정보구조" },
      { group_no: 2, label: "인터랙션" },
      { group_no: 3, label: "사용성" },
      { group_no: 4, label: "비주얼 디자인" },
    ];

    const byGroup = groups.map((g) => {
      const list = types.filter((t) => t.group_no === g.group_no && t.isActive);
      const count = list.reduce((s, t) => s + (t.usageCount || 0), 0);

      return {
        group_no: g.group_no,
        label: g.label,
        count,
        color: GROUPNO_TO_COLOR[g.group_no] || "blue",
      };
    });

    const total = byGroup.reduce((s, x) => s + x.count, 0) || 1;

    return byGroup.map((x) => ({
      ...x,
      percent: Math.round((x.count / total) * 1000) / 10,
    }));
  }, [types]);


  // 검색/필터 (키워드는 프런트에서, theme/status는 서버에서도 걸리지만 안전하게 한번 더)
  const filtered = useMemo(() => {
    let result = types;

    const keyword = q.trim().toLowerCase();
    if (keyword) {
      result = result.filter(
        (t) =>
          (t.name || "").toLowerCase().includes(keyword) ||
          (t.desc || "").toLowerCase().includes(keyword) ||
          (t.groupKo || "").toLowerCase().includes(keyword)
      );
    }

    if (theme !== "all") {
      result = result.filter((t) => t.groupKo === theme);
    }

    if (status !== "all") {
      const isActive = status === "active";
      result = result.filter((t) => t.isActive === isActive);
    }

    return result;
  }, [q, types, theme, status]);

  return (
    <section className="admin-page issue-page">
      {/* 헤더 카드 */}
      <div className="admin-card issue-head">
        <div>
          <h2>문제 유형 관리</h2>
          <p>일관되고 의미있는 문제 분류 체계를 유지합니다</p>
        </div>

        <button type="button" className="issue-primary" onClick={() => setIsCreateOpen(true)}>
          + 새 문제 유형
        </button>
      </div>

      {/* 상단 통계 */}
      <div className="issue-stats">
        <div className="issue-stat">
          <div className="issue-stat__label">전체 유형</div>
          <div className="issue-stat__value">{stats.totalTypes}</div>
        </div>
        <div className="issue-stat">
          <div className="issue-stat__label">활성 유형</div>
          <div className="issue-stat__value green">{stats.activeTypes}</div>
        </div>
        <div className="issue-stat">
          <div className="issue-stat__label">총 사용 횟수</div>
          <div className="issue-stat__value">{stats.totalUsage.toLocaleString()}</div>
        </div>
        <div className="issue-stat">
          <div className="issue-stat__label">핀즈 사용</div>
          <div className="issue-stat__value">{stats.pinnedCount}</div>
        </div>
      </div>

      {/* 테마 사용 분포(막대) */}
      <div className="admin-card issue-dist">
        <div className="issue-dist__title">테마별 사용 분포</div>

        <div className="issue-bars">
          {groupDist.map((g) => (
            <div key={g.group_no} className="issue-bar">
              <div className="issue-bar__left">
                <span className={`issue-dot issue-dot--${g.color}`} />
                <span className="issue-bar__label">{g.label}</span>
              </div>

              <div className="issue-bar__track">
                <div className={`issue-bar__fill issue-bar__fill--${g.color}`} style={{ width: `${g.percent}%` }} />
              </div>

              <div className="issue-bar__right">
                <span className="issue-bar__count">{g.count.toLocaleString()} 사용</span>
                <span className="issue-bar__pct">{g.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 검색 */}
      <div className="admin-card admin-card--search-bar">
        <AdminSearchBar value={q} onChange={setQ} placeholder="문제 유형 검색..." />

        <div className="admin-select-wrapper">
          <select className="admin-select" value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="all">모든 테마</option>
            <option value="정보구조">정보구조</option>
            <option value="인터랙션">인터랙션</option>
            <option value="사용성">사용성</option>
            <option value="비주얼 디자인">비주얼 디자인</option>
          </select>
          <span className="admin-select-arrow">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        <div className="admin-select-wrapper">
          <select className="admin-select" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="all">모든 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성</option>
          </select>
          <span className="admin-select-arrow">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {/* 로딩 표시(간단) */}
        {loading && <div style={{ marginLeft: "auto", fontSize: 12, color: "#6b7280" }}>불러오는 중...</div>}
      </div>

      {/* 리스트 */}
      <div className="issue-list">
        {filtered.map((t) => (
          <div
            key={t.id}
            className={`issue-item ${t.isActive ? "" : "is-inactive"} ${openMenuId === t.id ? "is-menu-open" : ""}`}
          >
            <div className={`issue-accent issue-accent--${GROUPNO_TO_COLOR[t.group_no] || "blue"}`} />

            <div className="issue-item__body">
              <div className="issue-item__top">
                <div className="issue-item__title">{t.name}</div>

                <div className="issue-item__menuWrap">
                  <button
                    type="button"
                    className="icon-btn issue-menu-btn"
                    onClick={() => toggleMenu(t.id)}
                    aria-label="메뉴"
                  >
                    ⋮
                  </button>

                  {openMenuId === t.id && (
                    <div className="issue-menu" ref={menuRef}>
                      <button className="issue-menu__item" onClick={() => openEdit(t)}>
                        ✏ 편집
                      </button>
                      <button className="issue-menu__item" onClick={() => openMerge(t)}>
                        ⤴ 병합
                      </button>
                      <button className="issue-menu__item danger" onClick={() => openDelete(t)}>
                        🗑 삭제(비활성)
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="issue-item__meta">
                <span
                  className={`issue-pill issue-pill--${GROUPNO_TO_COLOR[t.group_no] || "blue"}`}
                >
                  {t.groupKo}
                </span>
                <span className="issue-muted">작성자: 관리자 · {t.createdAt}</span>
              </div>

              <div className="issue-item__desc">{t.desc || "—"}</div>

              <div className="issue-item__usage">
                <div className="issue-usage__label">사용 빈도</div>
                <div className="issue-usage__track">
                  <div
                    className={`issue-usage__fill issue-usage__fill--${GROUPNO_TO_COLOR[t.group_no] || "blue"}`}
                    style={{ width: `${Math.min(100, (t.usageCount / 300) * 100)}%` }}
                  />
                </div>

                <div className="issue-usage__right">
                  <span className="issue-usage__count">{t.usageCount}회</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: 18, color: "#6b7280" }}>표시할 문제 유형이 없습니다.</div>
        )}
      </div>

      {/* Create */}
      {isCreateOpen && (
        <IssueTypeCreateModal
          taxonomy={ISSUE_TAXONOMY}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={onCreate}
        />
      )}

      {/* Edit */}
      {editTarget && (
        <IssueTypeEditModal taxonomy={ISSUE_TAXONOMY} item={editTarget} onClose={() => setEditTarget(null)} onSubmit={onEditSave} />
      )}

      {/* Merge */}
      {mergeTarget && (
        <IssueTypeMergeModal
          taxonomy={ISSUE_TAXONOMY}
          source={mergeTarget}
          candidates={
            mergeTarget
              ? types.filter(
                (x) => x.id !== mergeTarget.id && x.isActive && x.groupKo === mergeTarget.groupKo
              )
              : []
          }
          onClose={() => setMergeTarget(null)}
          onSubmit={onMergeApply}
        />
      )}

      {/* Delete(비활성) */}
      {deleteTarget && (
        <ConfirmDeleteModal
          title="비활성 처리하시겠습니까?"
          message={`"${deleteTarget.name}" 유형을 비활성 처리합니다.`}
          confirmText="비활성"
          cancelText="취소"
          onConfirm={async () => {
            try {
              await setIssueTypeActive(deleteTarget.id, 0);
              await loadTypes();
            } catch (e) {
              alert(e?.response?.data?.message || "처리 실패");
            } finally {
              setDeleteTarget(null);
            }
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </section>
  );
}
