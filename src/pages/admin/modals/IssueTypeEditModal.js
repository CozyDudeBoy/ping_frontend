import { useEffect, useMemo, useState } from "react";

export default function IssueTypeEditModal({ taxonomy = [], item, onClose, onSubmit }) {
  // item: { id, name, desc, groupKey, groupKo ... }
  const [name, setName] = useState(item?.name || "");
  const [desc, setDesc] = useState(item?.desc || "");

  // ✅ Edit는 groupKey로 관리 (부모가 group_no로 변환해서 서버로 보냄)
  const [groupKey, setGroupKey] = useState(() => {
    // item.groupKey가 있으면 그걸 우선
    if (item?.groupKey) return item.groupKey;

    // 혹시 groupKo만 있고 groupKey가 없으면 taxonomy에서 역매칭
    if (item?.groupKo && taxonomy?.length) {
      const found = taxonomy.find((g) => g.groupKo === item.groupKo);
      if (found?.groupKey) return found.groupKey;
    }

    // fallback: taxonomy 첫번째
    return taxonomy?.[0]?.groupKey || "usability";
  });

  // ESC 닫기 + 바디 스크롤 잠금 + item/taxonomy 변경되면 state 동기화
  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKeyDown);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // item 바뀌면 입력값 동기화
    setName(item?.name || "");
    setDesc(item?.desc || "");

    if (item?.groupKey) {
      setGroupKey(item.groupKey);
    } else if (item?.groupKo && taxonomy?.length) {
      const found = taxonomy.find((g) => g.groupKo === item.groupKo);
      setGroupKey(found?.groupKey || taxonomy?.[0]?.groupKey || "usability");
    } else {
      setGroupKey(taxonomy?.[0]?.groupKey || "usability");
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [onClose, item, taxonomy]);

  const selectedGroup = useMemo(() => {
    return taxonomy.find((g) => g.groupKey === groupKey);
  }, [taxonomy, groupKey]);

  const preview = {
    title: name || "문제 유형 이름",
    sub: desc || "문제 유형 설명이 여기에 표시됩니다",
  };

  const submit = () => {
    const trimmed = (name || "").trim();
    if (!trimmed) return;
    if (!item?.id) return;

    onSubmit?.({
      id: item.id,
      name: trimmed,
      desc: (desc || "").trim(),
      groupKey, // ✅ 부모(AdminIssueTypes)가 group_no로 변환해줌
    });
  };

  const labelFor = (g) => g.groupKo ?? g.group_name ?? g.groupLabel ?? "테마";

  return (
    <div className="issue-modal__overlay" onClick={onClose}>
      <div className="issue-modal" onClick={(e) => e.stopPropagation()}>
        <div className="issue-modal__head">
          <div>
            <div className="issue-modal__title">문제 유형 편집</div>
            <div className="issue-modal__subtitle">이름/설명/테마를 수정합니다</div>
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

            <div className="im-theme-grid">
              {taxonomy.map((g) => {
                const isActive = g.groupKey === groupKey;

                return (
                  <button
                    type="button"
                    key={g.groupKey}
                    className={`im-theme-btn ${isActive ? "is-active" : ""}`}
                    onClick={() => setGroupKey(g.groupKey)}
                  >
                    <span className="im-dot" />
                    {labelFor(g)}
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
                    테마: {labelFor(selectedGroup)}
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
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

