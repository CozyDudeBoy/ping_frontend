import ModalBase from "../components/ModalBase";

export default function ConfirmDeleteModal({
  title = "삭제하시겠습니까?",
  message = "삭제하면 되돌릴 수 없습니다.",
  confirmText = "삭제",
  cancelText = "취소",
  onConfirm,
  onClose,
}) {
  
  return (
    <ModalBase
      title={title}
      onClose={onClose}
      footer={
        <div className="cdm-actions">
          <button type="button" className="cdm-btn" onClick={onClose}>
            {cancelText}
          </button>
          <button type="button" className="cdm-btn cdm-btn--danger" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="cdm-text">{message}</p>
    </ModalBase>
  );
}
