import eye from "../assets/icon-eye.svg";
import comments from "../assets/icon-edit.svg";
import defaultPost from "../assets/default_post.png"; // ✅ 추가
import { Link } from "react-router-dom";

// 날짜 포맷 함수
const formatDate = (dateString) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\.$/, "");
};

export default function DesignItem({
  item,
  linkable = true,
  onClick,
}) {
  const content = (
    <article className="design-item">
      <div className="thumb-wrap" style={{ "--ratio": item.ratio }}>
        <img
          className="thumb"
          src={item.image || defaultPost}
          alt={item.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultPost;
          }}
        />
      </div>

      <div className="meta">
        <h3>{item.title}</h3>
        <p className="date">{formatDate(item.date)}</p>

        <div className="icons">
          <span>
            <img src={eye} alt="조회수 아이콘" />
            {item.viewCount ?? 0}
          </span>

          <span>
            <img src={comments} alt="질문 아이콘" />
            {item.question_count ?? 0}
          </span>
        </div>
      </div>
    </article>
  );

  if (!linkable) return content;

  return (
    <Link
      to={`/detail/${item.id}`}
      className="design-item-link"
      onClick={onClick}
    >
      {content}
    </Link>
  );
}
