import { useEffect } from "react";
import axios from "axios";

export default function UserModal({ user, onClose, onDeleted }) {
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

  /* ===============================
     🔥 영구 비활성화 (삭제)
     =============================== */
  const handleDeactivate = async () => {
    const ok = window.confirm(
      `${user.name} (${user.email}) 계정을 영구 비활성화 하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );
    if (!ok) return;

    try {
      await axios.delete(`http://localhost:9070/admin/users/${user.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // 부모(AdminUsers)에 삭제 완료 알림
      onDeleted?.(user.id);
      onClose();
    } catch (err) {
      console.error("회원 삭제 실패", err);
      alert("회원 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="user-modal__overlay" onMouseDown={onClose}>
      <div className="user-modal" onMouseDown={(e) => e.stopPropagation()}>
        {/* head */}
        <div className="user-modal__head">
          <div>
            <div className="user-modal__title">사용자 상세 정보</div>
            <div className="user-modal__subtitle">
              효율적인 중재를 위한 종합 정보
            </div>
          </div>
          <button
            type="button"
            className="user-modal__close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* body */}
        <div className="user-modal__body">
          {/* top profile */}
          <div className="user-profile">
            <div className="user-profile__avatar">
              {user.name.slice(0, 1)}
            </div>

            <div className="user-profile__info">
              <div className="user-profile__name-row">
                <div className="user-profile__name">{user.name}</div>
                <span className="user-profile__status">
                  <span className="user-status-pill">
                    {user.status === "active" ? "활성" : user.status}
                  </span>
                </span>
              </div>

              <div className="user-profile__email">{user.email}</div>

              <div className="user-profile__meta">
                <span>가입: {user.joinDate}</span>
                <span>마지막 활동: {user.lastActive}</span>
                <span>활동 {user.activeDays}일</span>
              </div>
            </div>
          </div>

          <div className="user-divider" />

          {/* activity stats */}
          <div className="user-section-title">활동 통계</div>
          <div className="user-stats">
            <div className="user-stat-card">
              <div className="user-stat-card__num">{user.designs}</div>
              <div className="user-stat-card__label">업로드한 디자인</div>
              <span className="user-stat-pill green">활발</span>
            </div>
            <div className="user-stat-card">
              <div className="user-stat-card__num">{user.pins}</div>
              <div className="user-stat-card__label">생성한 핀</div>
            </div>
            <div className="user-stat-card">
              <div className="user-stat-card__num">{user.comments}</div>
              <div className="user-stat-card__label">작성한 댓글</div>
            </div>
            <div className="user-stat-card">
              <div className="user-stat-card__num">1.0</div>
              <div className="user-stat-card__label">일평균 활동</div>
            </div>
          </div>

          {/* moderation info */}
          <div className="user-moderation">
            <div className="user-moderation__title">⚠ 중재 정보</div>
            <div className="user-moderation__row">
              <div className="muted">신고한 횟수</div>
              <div className="user-moderation__num">{user.reports}</div>
            </div>
          </div>

          {/* recent activity */}
          <div className="user-section-title">최근 활동</div>
          <div className="user-recent">
            {(user.recent || []).map((r, idx) => (
              <div className="user-recent-item" key={idx}>
                <div
                  className={`user-recent-icon user-recent-icon--${r.type}`}
                />
                <div className="user-recent-text">
                  <div className="user-recent-title">{r.title}</div>
                  <div className="user-recent-date">{r.date}</div>
                </div>
                <div className="user-recent-open">↗</div>
              </div>
            ))}
          </div>

          {/* admin actions */}
          <div className="user-section-title">관리자 액션</div>
          <div className="user-actions">
            <button className="user-action-btn">🛡 경고 발송</button>
            <button className="user-action-btn">⛔ 일시 정지</button>
            <button className="user-action-btn">✉ 이메일 보내기</button>
            <button
              className="user-action-btn danger"
              onClick={handleDeactivate}
            >
              🚫 영구 비활성화
            </button>
          </div>
        </div>

        {/* foot */}
        <div className="user-modal__foot">
          <button className="user-modal__foot-btn" onClick={onClose}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
