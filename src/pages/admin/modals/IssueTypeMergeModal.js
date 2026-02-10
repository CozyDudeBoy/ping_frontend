import { useEffect, useMemo, useState } from "react";

export default function IssueTypeMergeModal({
  source,
  candidates = [],
  onClose,
  onSubmit,
}) {
  // ✅ Hook은 항상 최상단
  const [targetId, setTargetId] = useState(null);

  // ✅ source/candidates 변경 시 target 초기화
  useEffect(() => {
    setTargetId(candidates?.[0]?.id ?? null);
  }, [source?.id, candidates]);

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKeyDown);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  // ✅ Hook이지만 source 없어도 안전하게 동작하도록 작성
  const target = useMemo(() => {
    const tid = Number(targetId);
    if (!tid) return null;
    return (candidates || []).find((c) => Number(c.id) === tid) || null;
  }, [candidates, targetId]);

  const canSubmit = Boolean(source?.id) && Boolean(targetId) && candidates.length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onSubmit?.({ sourceId: source.id, targetId: Number(targetId) });
  };

  // ✅ 여기서 return (Hook들 다 호출한 뒤)
  if (!source) return null;

  return (
    <div className="issue-modal__overlay" onMouseDown={onClose}>
      <div
        className="issue-modal issue-modal--merge"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="issue-modal__head">
          <div>
            <div className="issue-modal__title">문제 유형 병합</div>
            <div className="issue-modal__subtitle">기존 유형을 다른 유형으로 합칩니다</div>
          </div>
          <button className="issue-modal__close" onClick={onClose} type="button">
            ✕
          </button>
        </div>

        <div className="issue-modal__body">
          <div className="merge-box">
            <div className="merge-row">
              <div className="merge-label">병합할 유형</div>
              <div className="merge-value">
                <strong>{source.name}</strong>
                <span className="merge-sub">{source.groupKo ?? "테마"}</span>
              </div>
            </div>

            <div className="merge-row">
              <div className="merge-label">대상 유형 선택</div>

              {candidates.length === 0 ? (
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  병합 가능한 대상이 없습니다. (같은 테마의 활성 유형이 필요합니다)
                </div>
              ) : (
                <select
                  className="im-select"
                  value={targetId ?? ""}
                  onChange={(e) => setTargetId(e.target.value)}
                >
                  {candidates.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.groupKo ?? "테마"})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="merge-warning">
              ⚠ 병합하면 <strong>{source.name}</strong>은(는) 비활성화되고,
              사용 데이터(사용 빈도/연결)는 <strong>{target?.name || "선택한 대상"}</strong>으로 합쳐집니다.
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
            disabled={!canSubmit}
            type="button"
          >
            병합 적용
          </button>
        </div>
      </div>
    </div>
  );
}
