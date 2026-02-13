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
     🔥 영구 삭제
  =============================== */
  const handleDeactivate = async () => {
    const ok = window.confirm(
      `${user.user_nickname} (${user.user_id}) 계정을 영구 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`
    );
    if (!ok) return;

    try {
      await axios.delete(
        `https://port-0-ping-backend-mkvwe63p223f9070.sel3.cloudtype.app/api/admin/users/${user.user_no}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // 부모(AdminUsers)에 삭제 완료 알림
      onDeleted?.(user.user_no);
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
          <div className="user-profile">
            <div className="user-profile__avatar">
              {user.user_nickname?.slice(0, 1)}
            </div>

            <div className="user-profile__info">
              <div className="user-profile__name-row">
                <div className="user-profile__name">
                  {user.user_nickname}
                </div>
                <span className="user-profile__status">
                  <span className="user-status-pill">
                    {user.user_role}
                  </span>
                </span>
              </div>

              <div className="user-profile__email">
                ID: {user.user_id}
              </div>

              <div className="user-profile__meta">
                <span>가입: {user.create_datetime}</span>
                <span>디자인 {user.designs}개</span>
                <span>핀 {user.pins}개</span>
                <span>댓글 {user.comments}개</span>
              </div>
            </div>
          </div>

          <div className="user-divider" />

          {/* admin actions */}
          <div className="user-section-title">관리자 액션</div>
          <div className="user-actions">
            <button
              className="user-action-btn danger"
              onClick={handleDeactivate}
            >
              🚫 영구 삭제
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
