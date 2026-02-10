import { useEffect } from "react";

export default function PinsModal({ item, onClose, onSend }) {
  // ESC 닫기 + 바디 스크롤 잠금
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);

    // body scroll lock
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const issueType = form.get("issueType");
    const message = form.get("message");

    onSend?.({
      id: item?.id,
      issueType,
      message,
    });
  };

  return (
    <div className="pins-modal__overlay" onMouseDown={onClose}>
      <div className="pins-modal" onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="pins-modal__head">
          <div>
            <div className="pins-modal__title">질문 검토</div>
            <div className="pins-modal__subtitle">질문의 명확성과 문제 유형 확인</div>
          </div>

          <button
            type="button"
            className="pins-modal__close"
            onClick={onClose}
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="pins-modal__body">
          <div className="pins-modal__design">
            <div className="pins-modal__label">디자인</div>
            <div className="pins-modal__design-title">{item?.designTitle || item?.title}</div>
            <div className="pins-modal__author">by {item?.author || "-"}</div>
          </div>

          <div className="pins-modal__block">
            <div className="pins-modal__label">질문</div>
            <div className="pins-modal__question-box">{item?.question || "-"}</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="pins-modal__section">
              <div className="pins-modal__section-title">
                <span className="pins-modal__icon">✎</span>
                문제 유형 수정
              </div>
              <div className="pins-modal__current">
                현재: <strong>{item?.issueType || "정보 위계"}</strong>
              </div>

              <select
                className="pins-modal__select"
                name="issueType"
                defaultValue={item?.issueType || "정보 위계"}
              >
                <option value="정보구조">정보구조</option>
                <option value="네비게이션 구조">네비게이션 구조</option>
                <option value="콘텐츠 조직">콘텐츠 조직</option>
                <option value="라벨링">라벨링</option>

                <option value="사용자 흐름">사용자 흐름</option>
                <option value="피드백/응답">피드백/응답</option>
                <option value="제스처/동작">제스처/동작</option>
                <option value="마이크로 인터렉션">마이크로 인터렉션</option>

                <option value="접근성">접근성</option>
                <option value="가독성">가독성</option>
                <option value="오류방지">오류방지</option>
                <option value="일관성">일관성</option>

                <option value="레이아웃/그리드">레이아웃/그리드</option>
                <option value="타이포그래피">타이포그래피</option>
                <option value="색상사용">색상사용</option>
                <option value="여백/간격">여백/간격</option>
                <option value="시각적 위계">시각적 위계</option>
              </select>
            </div>

            <div className="pins-modal__section">
              <div className="pins-modal__section-title edit">
                <span className="pins-modal__icon">✎</span>
                질문 수정 요청
              </div>

              <textarea
                className="pins-modal__textarea"
                name="message"
                placeholder="더 명확한 질문을 위한 제안을 작성하세요..."
                defaultValue=""
              />

              <div className="pins-modal__send-row">
                <button type="submit" className="pins-modal__send">
                  수정 요청 전송
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="pins-modal__foot">
          <button type="button" className="pins-modal__foot-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
