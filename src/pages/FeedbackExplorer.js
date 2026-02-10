import React, { useEffect, useMemo, useState } from 'react';
import FeedbackCard from './FeedbackCard';
import arrow from "../assets/arrow_right.svg";

const PAGE_SIZE = 4;

function FeedbackExplorer() {
  const [categories, setCategories] = useState({});
  const [feedbacks, setFeedbacks] = useState([]); // 🔥 핵심
  const [activeMain, setActiveMain] = useState('전체');
  const [activeSub, setActiveSub] = useState('전체');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  /* ===============================
     카테고리 DB 로딩
  =============================== */
  useEffect(() => {
    fetch('http://localhost:9070/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('카테고리 로딩 실패:', err));
  }, []);

  /* ===============================
     게시물 DB 로딩
  =============================== */
  useEffect(() => {
    fetch('http://localhost:9070/api/posts')
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .catch(err => console.error('게시물 로딩 실패:', err));
  }, []);

  /* ===============================
     메인 카테고리 클릭
  =============================== */
  const handleMainClick = (main) => {
    setActiveMain(main);
    setActiveSub('전체');
  };

  /* ===============================
     피드백 필터링
  =============================== */
  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((fb) => {
      const mainMatch = activeMain === '전체' || fb.mainType === activeMain;
      const subMatch = activeSub === '전체' || fb.subType === activeSub;
      return mainMatch && subMatch;
    });
  }, [feedbacks, activeMain, activeSub]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [activeMain, activeSub]);

  /* ===============================
     더보기 처리
  =============================== */
  const visibleFeedbacks = useMemo(() => {
    return filteredFeedbacks.slice(0, visibleCount);
  }, [filteredFeedbacks, visibleCount]);

  const canLoadMore = visibleCount < filteredFeedbacks.length;

  return (
    <section className="main_feedback-explorer container">
      <div className="grid">
        {/* ===============================
            좌측 카테고리 탐색
        =============================== */}
        <aside className="explorer_aside col-4">
          <h2>문제 유형별 탐색</h2>
          <p>카테고리 별 피드백 아카이브를 확인해 보세요.</p>

          <ul className="menu_list">
            {Object.entries(categories).map(([main, subs]) => {
              const isOpen = activeMain === main;

              return (
                <li key={main} className={`main_item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className={`menu_btn ${isOpen ? 'is-active' : ''}`}
                    onClick={() => handleMainClick(main)}
                  >
                    {main}
                    {isOpen && (
                      <img src={arrow} alt="arrow" className="menu_arrow" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="active_panel">
                      <div className="active_panel_head"></div>

                      <div className="chip_row">
                        <button
                          type="button"
                          className={`chip ${activeSub === '전체' ? 'is-active' : ''}`}
                          onClick={() => setActiveSub('전체')}
                        >
                          전체
                          {activeSub === '전체' && (
                            <img src={arrow} alt="arrow" className="chip_arrow" />
                          )}
                        </button>

                        {subs.map((sub) => (
                          <button
                            key={sub}
                            type="button"
                            className={`chip ${activeSub === sub ? 'is-active' : ''}`}
                            onClick={() => setActiveSub(sub)}
                          >
                            {sub}
                            {activeSub === sub && (
                              <img src={arrow} alt="arrow" className="chip_arrow" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* ===============================
            우측 카드 리스트
        =============================== */}
        <div className="feedbackcons col-8">
          <div className="cards">
            {visibleFeedbacks.length > 0 ? (
              visibleFeedbacks.map((fb) => (
                <FeedbackCard key={`${fb.id}-${fb.subType}-${fb.mainType}`} data={fb} />

              ))
            ) : (
              <p className="empty">데이터가 없습니다.</p>
            )}
          </div>

          {canLoadMore && (
            <div className="more_wrap">
              <button
                type="button"
                className="btn_more"
                onClick={() => setVisibleCount(v => v + PAGE_SIZE)}
              >
                더보기
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeedbackExplorer;
