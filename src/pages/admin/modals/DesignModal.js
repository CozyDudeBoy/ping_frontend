import { useMemo, useState } from "react";
import ModalBase from "../components/ModalBase";

export default function DesignModal({ item, onClose, onSave }) {
  const ISSUE_GROUPS = useMemo(
    () => [
      {
        title: "INFORMATION STRUCTURE",
        items: ["정보구조", "네비게이션 구조", "콘텐츠 조직", "라벨링"],
      },
      {
        title: "INTERACTION",
        items: ["사용자 흐름", "피드백/응답", "제스처/동작", "마이크로 인터렉션"],
      },
      {
        title: "USABILITY",
        items: ["접근성", "가독성", "오류방지", "일관성"],
      },
      {
        title: "VISUAL DESIGN",
        items: ["레이아웃/그리드", "타이포그래피", "색상사용", "여백/간격", "시각적 위계"],
      },
    ],
    []
  );

  const [selected, setSelected] = useState(item?.issueTypes || []);
  const [message, setMessage] = useState(item?.lastMessage || "");

  const MAX_SELECT = 3;

  const togglePill = (label) => {
    setSelected((prev) => {
      const exists = prev.includes(label);
      if (exists) return prev.filter((x) => x !== label);
      if (prev.length >= MAX_SELECT) return prev;
      return [...prev, label];
    });
  };

  const handleSendRequest = () => {
    // TODO: 디자이너에게 수정요청 API
    console.log("send request", { id: item?.id, selected, message });
  };

  const handleSave = () => {
    onSave?.({ id: item?.id, issueTypes: selected, message });
    // ✅ 저장하면 닫힘
    onClose?.();
  };

  return (
    <ModalBase
      title="디자인 검토"
      onClose={onClose}
      footer={
        <div className="dm-footer">
          <button className="dm-btn dm-btn--ghost" type="button" onClick={onClose}>
            취소
          </button>
          <button className="dm-btn dm-btn--primary" type="button" onClick={handleSave}>
            변경사항 저장
          </button>
        </div>
      }
    >
      <div className="dm-subtitle">문제 기반 피드백과의 정렬 확인</div>

      {item?.title && <div className="dm-design-title">{item.title}</div>}

      {/* 문제 유형 */}
      <section className="dm-section">
        <div className="dm-section__head">
          <div className="dm-section__title">
            <span className="dm-section__icon">✎</span>
            문제 유형
          </div>
          <div className="dm-section__meta">선택됨: {selected.length}개</div>
        </div>

        <div className="pill-groups">
          {ISSUE_GROUPS.map((g) => (
            <div key={g.title} className="pill-group">
              <div className="pill-group__title">{g.title}</div>

              <div className="pill-group__items">
                {g.items.map((label) => {
                  const isOn = selected.includes(label);
                  return (
                    <button
                      key={label}
                      type="button"
                      className={isOn ? "pill pill--on" : "pill"}
                      onClick={() => togglePill(label)}
                      title={selected.length >= MAX_SELECT && !isOn ? "최대 3개까지 선택" : ""}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="pill-hint">최대 3개까지 선택할 수 있습니다.</div>
      </section>

      {/* 수정 요청 메시지 */}
      <section className="dm-section">
        <div className="dm-section__head">
          <div className="dm-section__title">
            <span className="dm-section__icon">✈</span>
            수정 요청 메시지
          </div>
        </div>

        <textarea
          className="dm-textarea"
          placeholder="디자이너에게 수정 사항을 요청하는 메시지를 작성하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <div className="dm-send">
          <button
            type="button"
            className="dm-btn dm-btn--soft"
            onClick={handleSendRequest}
            disabled={selected.length === 0 && !message.trim()}
          >
            ✈ 수정 요청 전송
          </button>
        </div>
      </section>
    </ModalBase>
  );
}
