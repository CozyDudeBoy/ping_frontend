import React, { useState } from 'react';

const MyAlarm = () => {
  const [filter, setFilter] = useState('all');

  const alarm = [
    {
      id: 1,
      type: 'feedback',
      title: '박민준님이 내 질문에 피드백을 남겼습니다.',
      related: '대시보드 리디자인 - 데이터 시각화',
      isRead: false,
      date: '2026. 1. 14.',
    },
    {
      id: 2,
      type: 'comment',
      title: '내 핀에 새로운 댓글이 달렸습니다.',
      related: '버튼을 가장자리에 얼마나 떨어뜨려야 할까요?',
      isRead: true,
      date: '2026. 1. 13.',
    },
  ];

  return (
    <section className="my-alarm">
      {/* 타이틀 */}
      <div className="mypage-section-header">
        <h2>알림</h2>
        <p>내 활동과 관련된 최신 소식</p>
      </div>

      {/* 필터 */}
      <div className="alarm-filter">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          전체 2개
        </button>
        <button
          className={filter === 'unread' ? 'active unread' : 'unread'}
          onClick={() => setFilter('unread')}
        >
          안 읽음 1개
        </button>
      </div>

      {/* 알림 리스트 */}
      <div className="alarm-list">
        {alarm.map((item) => (
          <div
            key={item.id}
            className={`alarm-item ${item.isRead ? 'read' : 'unread'}`}
          >
            <div className="alarm-dot" />

            <div className="alarm-content">
              <h3>{item.title}</h3>

              <p className="related">
                {item.related}
              </p>

              <div className="alarm-info">
                <span>{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MyAlarm;
