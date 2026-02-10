import React, { useState } from 'react';

const MyPins = () => {
  const [filter, setFilter] = useState('all');

  const pins = [
    {
      id: 1,
      title:
        '급업률 종합이 아닌 상단에 배치한 이유에 대해 피드백이 필요합니다.',
      category: '모바일 랜딩 · 거래 플로우',
      status: '미해결',
      comments: 2,
      date: '2026. 1. 14.',
    },
    {
      id: 2,
      title:
        '버튼을 가장자리에 얼마나 떨어뜨려야 할지 고민입니다.',
      category: '모바일 랜딩 · 거래 플로우',
      status: '미해결',
      comments: 2,
      date: '2026. 1. 14.',
    },
    {
      id: 3,
      title:
        '카드 스타일 레이아웃과 전체 화면 디자인 중 어떤 것이 더 나을까요?',
      category: '모바일 랜딩 · 거래 플로우',
      status: '미해결',
      comments: 2,
      date: '2026. 1. 14.',
    },
  ];

  return (
    <section className="my-pins">
      {/* 타이틀 */}
      <div className="mypage-section-header">
        <h2>My Pins</h2>
        <p>내가 작성한 질문과 피드백 현황</p>
      </div>

      {/* 상태 필터 */}
      <div className="pin-filter">
        <button
          className={filter === 'open' ? 'active open' : 'open'}
          onClick={() => setFilter('open')}
        >
          미해결 3개
        </button>
        <button
          className={filter === 'discussion' ? 'active discussion' : 'discussion'}
          onClick={() => setFilter('discussion')}
        >
          논의 중 0개
        </button>
        <button
          className={filter === 'done' ? 'active done' : 'done'}
          onClick={() => setFilter('done')}
        >
          해결됨 0개
        </button>
      </div>

      {/* 핀 리스트 */}
      <div className="pin-list">
        {pins.map((pin) => (
          <div className="pin-item" key={pin.id}>
            <div className="pin-status" />

            <div className="pin-content">
              <h3>{pin.title}</h3>
              <div className="pin-meta">
                <span className="category">{pin.category}</span>
                <span className="status">{pin.status}</span>
              </div>

              <div className="pin-info">
                <span>💬 {pin.comments} 답변</span>
                <span>{pin.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyPins;
