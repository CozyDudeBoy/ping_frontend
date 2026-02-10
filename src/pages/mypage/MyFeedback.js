import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import IconMessage from "../../assets/icon-message.svg";
import { getMyFeedback } from "../../api/MyPage_Api";

const API_BASE = "http://localhost:9070";

const formatDate = (datetime) => {
  if (!datetime) return "";
  const d = new Date(datetime);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
};

const MyFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const res = await getMyFeedback();

        // 백엔드: 배열 그대로 내려주는 구조
        const rows = Array.isArray(res.data) ? res.data : [];
        if (!mounted) return;

        setFeedbacks(rows);
      } catch (err) {
        console.error("마이피드백 불러오기 실패:", err);
        if (!mounted) return;
        setFeedbacks([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="my-feedback">
      {/* 타이틀 */}
      <div className="mypage-section-header">
        <h2>My Feedback</h2>
        <p>
          내가 남긴 피드백을 한눈에 보고, 다시 확인할 수 있는 공간입니다.
        </p>
      </div>

      {/* 요약 */}
      <div className="feedback-summary">
        <img src={IconMessage} alt="댓글" />
        <span>
          {loading
            ? "불러오는 중..."
            : `총 ${feedbacks.length}개의 피드백을 남겼습니다`}
        </span>
      </div>

      {/* 로딩 */}
      {loading && <div style={{ padding: 12 }}>피드백을 불러오는 중...</div>}

      {/* 빈 상태 */}
      {!loading && feedbacks.length === 0 && (
        <div style={{ padding: 12 }}>아직 남긴 피드백이 없습니다.</div>
      )}

      {/* 리스트 */}
      {!loading && feedbacks.length > 0 && (
        <div className="feedback-list">
          {feedbacks.map((item) => (
            <Link
              key={item.answer_no}
              to={`/mypage/feedback/${item.answer_no}`}   // ✅ 핵심
              className="feedback-item"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {/* 썸네일 */}
              {item.image_path ? (
                <img
                  src={`${API_BASE}${item.image_path}`}
                  alt="썸네일"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 120,
                    height: 90,
                    borderRadius: 12,
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#999",
                    fontSize: 12,
                  }}
                >
                  No Image
                </div>
              )}

              <div className="content">
                {/* 메타 */}
                <div className="meta">
                  <span className="date">
                    {formatDate(item.answer_datetime)}
                  </span>
                </div>

                {/* 게시물 제목 */}
                <h3>{item.post_title}</h3>

                {/* 질문 */}
                <div className="question">
                  <span className="label">질문</span>
                  <p>{item.question_content}</p>
                </div>

                {/* 내 피드백 */}
                <div className="my-feedback-text">
                  <span className="label">
                    <img src={IconMessage} alt="댓글" />
                    <strong>내 피드백</strong>
                  </span>
                  <p>{item.answer_content}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyFeedback;
