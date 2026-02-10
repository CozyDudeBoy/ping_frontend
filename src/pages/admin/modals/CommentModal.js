import { useEffect, useState } from "react";

export default function CommentModal({ item, onClose, onApply }) {
  const [warnMsg, setWarnMsg] = useState("");
  const [limitDays, setLimitDays] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(false);

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

  const sendWarn = () => {
    onApply?.({ type: "warn", id: item.id, message: warnMsg });
  };

  const applyLimit = () => {
    onApply?.({ type: "limit", id: item.id, days: Number(limitDays) || 0 });
  };

  const deleteComment = () => {
    onApply?.({ type: "delete", id: item.id });
  };

  return (
    <div className="comment-modal__overlay" onMouseDown={onClose}>
      <div className="comment-modal" onMouseDown={(e) => e.stopPropagation()}>
        {/* head */}
        <div className="comment-modal__head">
          <div>
            <div className="comment-modal__title">댓글 검토</div>
            <div className="comment-modal__subtitle">건설적인 토론 분위기 유지</div>
          </div>

          <button type="button" className="comment-modal__close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* body */}
        <div className="comment-modal__body">
          {/* 디자인 & 핀 */}
          <div className="cm-section">
            <div className="cm-label">디자인 & 핀</div>

            <div className="cm-design-row">
              <img src={item.thumb} alt="" className="cm-thumb" />
              <div className="cm-design-text">
                <div className="cm-design-title">{item.designTitle}</div>
                <div className="cm-pin-q">{item.pinQuestion}</div>
              </div>
            </div>
          </div>

          {/* 작성자 */}
          <div className="cm-section">
            <div className="cm-label">작성자</div>
            <div className="cm-author">{item.user}</div>
          </div>

          {/* 댓글 내용 */}
          <div className="cm-section">
            <div className="cm-label">댓글 내용</div>
            <div className="cm-comment-box">{item.comment}</div>
          </div>

          {/* 경고 발송 */}
          <div className="cm-section cm-card">
            <div className="cm-card__title">
              <span className="cm-ico">🛡</span> 경고 발송
            </div>

            <textarea
              className="cm-textarea"
              placeholder="사용자에게 전송할 경고 메시지를 작성하세요..."
              value={warnMsg}
              onChange={(e) => setWarnMsg(e.target.value)}
            />

            <div className="cm-actions">
              <button
                type="button"
                className="cm-btn cm-btn--warn"
                onClick={sendWarn}
                disabled={!warnMsg.trim()}
              >
                🛡 경고 전송
              </button>
            </div>
          </div>

          {/* 댓글 작성 제한 */}
          <div className="cm-section cm-card">
            <div className="cm-card__title">
              <span className="cm-ico">⛔</span> 댓글 작성 제한
            </div>

            <div className="cm-limit-row">
              <input
                className="cm-input"
                value={limitDays}
                onChange={(e) => setLimitDays(e.target.value)}
                placeholder="예: 7"
              />
              <button type="button" className="cm-btn cm-btn--limit" onClick={applyLimit}>
                제한 적용
              </button>
            </div>

            <div className="cm-hint">이 사용자는 선택한 기간 동안 댓글을 작성할 수 없습니다.</div>
          </div>

          {/* 댓글 삭제 (Danger Zone) */}
          <div className="cm-section cm-danger">
            <div className="cm-card__title danger">
              <span className="cm-ico">🗑</span> 댓글 삭제
            </div>
            <div className="cm-hint danger">
              이 작업은 취소할 수 없습니다. 댓글이 영구적으로 삭제됩니다.
            </div>

            <button
              type="button"
              className="cm-btn cm-btn--delete"
              onClick={() => setDeleteConfirm(true)}
            >
              댓글 삭제
            </button>

            {deleteConfirm && (
              <div className="cm-confirm">
                <div className="cm-confirm__text">정말 삭제할까요?</div>
                <div className="cm-confirm__actions">
                  <button type="button" className="cm-btn" onClick={() => setDeleteConfirm(false)}>
                    취소
                  </button>
                  <button type="button" className="cm-btn cm-btn--delete" onClick={deleteComment}>
                    삭제
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* foot */}
        <div className="comment-modal__foot">
          <button type="button" className="comment-modal__foot-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
