import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
// import qnaData from './qna.json';
import '../styles/qna.scss';
import axios from 'axios';


function Question() {
  const [items, setItems] = useState([]);
  const [openNo, setOpenNo] = useState(null);
  const [visibleCount, setVisibleCount] = useState(5);
  // 답변 ref 저장용
  const answerRefs = useRef({});

  useEffect(() => {
    axios
      .get('http://localhost:9070/qna/questions')
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, [])

  const handleToggle = (no) => {
    setOpenNo((prev) => (prev === no ? null : no));
  };

  return (
    <main className="qna container">
      <section className="grid">
        <div className="top-text col-12">
          <h2>질문과 답변</h2>
          <p>
            디자인의 맥락을 이해하고, 질문과 답변으로 더 나은 피드백을
            만들어가세요.
          </p>
          <div className='col-12 qna-form_btn'>
            <Link to='/qna/form'>질문하러가기</Link>
          </div>
        </div>

        <div className="qna-table-wrap col-full">
          <table className="qna-table">
            <thead>
              <tr>
                <th>No.</th>
                <th>제목</th>
                <th>작성자</th>
                <th>날짜</th>
              </tr>
            </thead>

            <tbody>
              {items.slice(0, visibleCount).map((item, index) => {
                const isOpen = openNo === item.no;
                // const answerEl = answerRefs.current[item.no];

                return (
                  <React.Fragment key={item.no}>
                    {/* 질문 행 */}
                    <tr
                      className={`qna-row ${isOpen ? 'open' : ''}`}
                      onClick={
                        () =>
                          // handleToggle(item.no)
                          setOpenNo(isOpen ? null : item.no)
                      }
                    >
                      <td>{items.length - index}</td>
                      <td className="title-cell">
                        {item.title}
                        <span
                          className={`arrow ${isOpen ? 'open' : ''}`}
                        >▼</span>
                      </td>
                      <td>{item.author}</td>
                      <td>{item.date.slice(0, 10)}</td>
                    </tr>

                    {/* 답변 행 (항상 렌더링) */}
                    <tr className={`qna-answer-row ${isOpen ? 'open' : ''}`}>
                      <td colSpan={4}>
                        <div
                          ref={(el) =>
                            (answerRefs.current[item.no] = el)
                          }
                          className="qna-answer"
                          style={{
                            maxHeight: isOpen
                              ? `${answerRefs.current[item.no]?.scrollHeight}px`
                              : '0px',
                          }}
                        >
                          <div className='qna-answer-inner'>
                            {
                              item.answer ? `A. ${item.answer}` : '답변 대기중입니다.'
                            }

                          </div>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {/* 더보기 버튼 */}
          <button
            type="button"
            className="btn_more"
            onClick={() => {
              if (visibleCount >= items.length) {
                alert('마지막 질문까지 모두 확인하였습니다.');
                return;
              }
              setVisibleCount((p) => p + 5)
            }}
          >
            더보기
          </button>
        </div>
      </section>
    </main>
  );
}

export default Question;
