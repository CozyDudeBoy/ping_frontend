// src/pages/mypage/FeedbackDetail.js
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import IconMessage from "../../assets/icon-message.svg";
import { getMyFeedbackDetail, updateMyFeedback, deleteMyFeedback } from "../../api/MyPage_Api";
import "../styles/feedbackDetail.scss";

const API_BASE = "http://localhost:9070";

const formatDate = (datetime) => {
  if (!datetime) return "";
  const d = new Date(datetime);
  if (Number.isNaN(d.getTime())) return String(datetime);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
};

export default function FeedbackDetail() {
  const navigate = useNavigate();
  const { answer_no } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 수정 상태
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState("");

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyFeedbackDetail(answer_no);
      setData(res.data);
      setEditText(res.data?.answer_content || "");
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || "피드백을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!answer_no) return;
    fetchDetail();
    // eslint-disable-next-line
  }, [answer_no]);

  const handleSave = async () => {
    try {
      if (!editText.trim()) return alert("내용을 입력해 주세요.");
      await updateMyFeedback(answer_no, editText.trim());
      setEditing(false);
      fetchDetail();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "수정 실패");
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("피드백을 삭제할까요?");
    if (!ok) return;

    try {
      await deleteMyFeedback(answer_no);
      alert("삭제되었습니다.");
      navigate("/mypage/feedback");
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || "삭제 실패");
    }
  };

  if (loading) return <div className="feedback-detail container"><p>로딩중...</p></div>;
  if (error) return <div className="feedback-detail container"><p className="form-error">{error}</p></div>;
  if (!data) return null;

  return (
    <section className="feedback-detail container">
      <div className="feedback-detail__head">
        <button className="back_btn" onClick={() => navigate(-1)}>← 뒤로 가기</button>

        {/* 원하면: 해당 아카이브 디테일로 이동 */}
        <Link className="link-detail" to={`/detail/${data.post_no}`} state={{ pin_no: data.pin_no }}>
          원문 디테일 보기 →
        </Link>
      </div>

      <article className="feedback-card">
        <div className="feedback-card__thumb">
          {data.image_path ? (
            <img src={`${API_BASE}${data.image_path}`} alt="thumb" />
          ) : (
            <div className="thumb-placeholder">No Image</div>
          )}
        </div>

        <div className="feedback-card__body">
          <div className="title-row">
            <h2 className="post-title">{data.post_title}</h2>
            <span className="date">{formatDate(data.answer_datetime)}</span>
          </div>

          <div className="q-block">
            <div className="label">질문</div>
            <p>{data.question_content}</p>
          </div>

          <div className="a-block">
            <div className="label">
              <img src={IconMessage} alt="댓글" />
              <strong>내 피드백</strong>
            </div>

            {!editing ? (
              <p className="answer-text">{data.answer_content}</p>
            ) : (
              <textarea
                className="edit-area"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
            )}

            <div className="btn-row">
              {!editing ? (
                <>
                  <button className="btn primary" onClick={() => setEditing(true)}>수정</button>
                  <button className="btn danger" onClick={handleDelete}>삭제</button>
                </>
              ) : (
                <>
                  <button className="btn primary" onClick={handleSave}>저장</button>
                  <button className="btn ghost" onClick={() => { setEditing(false); setEditText(data.answer_content || ""); }}>
                    취소
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
