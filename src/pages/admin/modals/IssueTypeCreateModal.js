import { useEffect, useMemo, useState } from "react";

export default function IssueTypeCreateModal({ taxonomy = [], onClose, onSubmit }) {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  // ✅ ISSUE_TAXONOMY는 group_no가 없고 groupKey가 있으니 매핑으로 처리
  const GROUPKEY_TO_GROUPNO = useMemo(
    () => ({
      information_structure: 1,
      interaction: 2,
      usability: 3,
      visual_design: 4,
    }),
    []
  );

  const getGroupNo = (g) =>
    Number(g?.group_no ?? g?.groupNo ?? GROUPKEY_TO_GROUPNO[g?.groupKey] ?? 1);

  // ✅ groupNo(숫자)로 관리 (DB랑 동일)
  const [groupNo, setGroupNo] = useState(() => {
    const first = taxonomy?.[0];
    const gn = getGroupNo(first);
    return Number.isNaN(gn) ? 1 : gn;
  });

  // ESC 닫기 + 바디 스크롤 잠금 + taxonomy 들어오면 기본 선택 보정
  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKeyDown);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // taxonomy가 나중에 들어오면 기본 선택값 보정
    if ((!groupNo || Number.isNaN(Number(groupNo))) && taxonomy?.length) {
      const first = taxonomy[0];
      const gn = getGroupNo(first);
      setGroupNo(Number.isNaN(gn) ? 1 : gn);
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClose, taxonomy]);

  // ✅ 선택된 그룹(표시용)
  const selectedGroup = useMemo(() => {
    return taxonomy.find((g) => getGroupNo(g) === Number(groupNo));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxonomy, groupNo]);

  // 미리보기(설명은 DB에 없지만 UI용)
  const preview = {
    title: name || "문제 유형 이름",
    sub: desc || "문제 유형 설명이 여기에 표시됩니다",
  };

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const gn = Number(groupNo);
    if (!gn || Number.isNaN(gn)) return;

    onSubmit?.({
      name: trimmed,
      desc: desc.trim(),
      groupNo: gn, // ✅ 부모(AdminIssueTypes.js)의 onCreate가 groupNo로 받음
    });
  };

  return (
    <div className="issue-modal__overlay" onClick={onClose}>
      <div className="issue-modal" onClick={(e) => e.stopPropagation()}>
        <div className="issue-modal__head">
          <div>
            <div className="issue-modal__title">새 문제 유형 추가</div>
            <div className="issue-modal__subtitle">의미있고 일관된 문제 분류 체계 유지</div>
          </div>
          <button className="issue-modal__close" onClick={onClose} type="button" aria-label="닫기">
            ✕
          </button>
        </div>

        <div className="issue-modal__body">
          <div className="im-field">
            <div className="im-label">문제 유형 이름</div>
            <input
              className="im-input"
              placeholder="예: 정보 위계"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              autoFocus
            />
          </div>

          <div className="im-field">
            <div className="im-label">설명</div>
            <textarea
              className="im-textarea"
              placeholder="이 문제 유형이 다루는 디자인 이슈를 설명하세요..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              maxLength={300}
            />
          </div>

          <div className="im-field">
            <div className="im-label">테마</div>

            {/* 2x2 버튼 */}
            <div className="im-theme-grid">
              {taxonomy.map((g) => {
                const gNo = getGroupNo(g);
                const isActive = Number(groupNo) === gNo;

                // groupKo가 없으면 groupLabel/group_name 등으로 표시
                const label = g.groupKo ?? g.group_name ?? g.groupLabel ?? "테마";

                return (
                  <button
                    type="button"
                    key={g.groupKey || gNo} // ✅ NaN 방지
                    className={`im-theme-btn ${isActive ? "is-active" : ""}`}
                    onClick={() => setGroupNo(gNo)}
                  >
                    <span className="im-dot" />
                    {label}
                    {isActive && <span className="im-check">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="im-preview">
            <div className="im-preview__title">미리보기</div>
            <div className="im-preview__card">
              <span className="im-preview__dot" />
              <div>
                <div className="im-preview__name">{preview.title}</div>
                <div className="im-preview__desc">{preview.sub}</div>

                {selectedGroup && (
                  <div style={{ marginTop: 6, fontSize: 12, color: "#6b7280" }}>
                    테마: {selectedGroup.groupKo ?? selectedGroup.group_name ?? selectedGroup.groupLabel}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="issue-modal__foot">
          <button className="im-btn" onClick={onClose} type="button">
            취소
          </button>
          <button
            className="im-btn im-btn--primary"
            onClick={submit}
            disabled={!name.trim()}
            type="button"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
}
