// src/pages/mypage/DesignDetail.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Api from "../../api/Api";

export default function DesignDetail() {
  const { id } = useParams();          // ✅ params 이름 맞춤
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await Api.get(`/mypage/designs/${id}`); // ✅ 백엔드랑 매칭
        setData(res.data);
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.message || "상세를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return <p>로딩중...</p>;
  if (error) return <p className="form-error">{error}</p>;
  if (!data) return null;

  return (
    <section className="design-detail">
      <h2>{data.post_title}</h2>
      <p>{data.post_content}</p>
      <p>조회 {data.view_count} · 좋아요 {data.like_count}</p>
      <p>{String(data.create_datetime).slice(0, 10)}</p>
    </section>
  );
}

