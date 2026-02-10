import '../styles/detail.scss';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import backIcon from '../../assets/icon-chevron-left.svg';
import CloseIcon from '../../assets/icon-x.svg';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.locale('ko');

function Detail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [pins, setPins] = useState([]);
  const [selectedPin, setSelectedPin] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [post, setPost] = useState(null);

  // 모바일 댓글 모달
  const [isOpen, setIsOpen] = useState(false);

  // 비 로그인시 댓글 입력 막기 
  const isLogin = !!localStorage.getItem('token');

  // 핀 답변 상태 (DB)
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState('');

  // 개인 메모 (로컬) -- 기능 disabled
  // const [memo, setMemo] = useState([]);
  // const [memoText, setMemoText] = useState('');

  /* ===============================
    상세 데이터 로딩
     =============================== */
  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:9070/api/designs/${id}`)
      .then(res => {
        const serverPins = res.data.pins || [];
        setPins(serverPins);
        setSelectedPin(serverPins[0] || null);
        setImageUrl(res.data.imageUrl || '');
        setPost(res.data.post || null);

        // 첫 핀 자동 선택 시 답변도 불러오기
        if (serverPins.length > 0) {
          fetchAnswers(serverPins[0].pin_no);
        }
      })
      .catch(err => {
        console.error('❌ Detail fetch error:', err);
      });
  }, [id]);

  /* ================================== 
    조회수 증가
  ================================ */
  useEffect(()=>{
    if(!id) return;

    axios.post(`http://localhost:9070/api/posts/${id}/view`)
    .catch(err=>{
      console.error('조회수 증가 실패:', err);
    });
  }, [id]);

  /* ===============================
    핀 답변 조회
     =============================== */
  const fetchAnswers = async (pinNo) => {
    try {
      const res = await axios.get(
        `http://localhost:9070/api/pins/${pinNo}/answers`
      );
      setAnswers(res.data);
    } catch (err) {
      console.error('❌ 답변 조회 실패', err);
      setAnswers([]);
    }
  };

  /* ===============================
    핀 클릭
     =============================== */
  const handlePinClick = (pin) => {
    setSelectedPin(pin);
    fetchAnswers(pin.pin_no);

    if (window.innerWidth <= 1023) {
      setIsOpen(true);
    }
  };

  /* ===============================
    답변 작성
     =============================== */
  const handleAddAnswer = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('로그인 후 이용 가능합니다');
      navigate('/login');
      return;
    }

    if (!selectedPin) return;
    if (!answerText.trim()) return;

    await axios.post(
      `http://localhost:9070/api/pins/${selectedPin.pin_no}/answers`,
      { content: answerText },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setAnswerText('');
    fetchAnswers(selectedPin.pin_no);
  };


  /* ===============================
    개인 메모 (로컬) -- 기능 disabled
     =============================== */
  // const handleAddMemo = () => {
  //   if (!memoText.trim()) return;

  //   const newMemo = {
  //     id: Date.now(),
  //     content: memoText,
  //     date: new Date().toLocaleDateString('ko-KR', {
  //       month: 'long',
  //       day: 'numeric',
  //     }),
  //   };

  //   setMemo(prev => [...prev, newMemo]);
  //   setMemoText('');
  // };

  return (
    <section className="detail container">
      <article className="detail_box grid">

        {/* 왼쪽 이미지 영역 */}
        <div className="detail-box_left col-8">
          <button onClick={() => navigate(-1)} className="back_btn">
            <img src={backIcon} alt="뒤로가기" />뒤로 가기
          </button>

          <div className="left-inner">
            <span className="user-badge">
              <img
                src={
                  post?.user_image
                    ? `http://localhost:9070${post.user_image}`
                    : `${process.env.PUBLIC_URL}/images/default.png`
                }
                alt="프로필"
              />
              <strong>{post?.user_nickname || '익명'}</strong>
            </span>

            <h2>{post?.post_title}</h2>
            <p>{post?.post_content}</p>

            <div className="img_box">
              <div className="image_wrap">
                {imageUrl && (
                  <img
                    src={`http://localhost:9070${imageUrl}`}
                    alt="상세 이미지"
                  />
                )}

                {pins.map((pin, index) => (
                  <div
                    key={pin.pin_no}
                    className={`pin_marker ${selectedPin?.pin_no === pin.pin_no ? 'active' : ''
                      }`}
                    style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                    onClick={() => handlePinClick(pin)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* 모바일 영역 모달버튼 */}
            <button
              className="mobile-comment-btn"
              onClick={() => setIsOpen(true)}
            >
              질문 / 댓글 보기
            </button>
          </div>
        </div>

        {/* 오른쪽 답변 영역 */}
        <div className="detail-box_right col-4 hidden">
          <div className="sticky-inner">
            <p className="pin-label">
              <span className="pin-badge">
                {selectedPin
                  ? pins.findIndex(p => p.pin_no === selectedPin.pin_no) + 1
                  : '-'}
              </span>
              Pin Question
            </p>

            <hr />
            <span className='selected-pin_qna'>{selectedPin?.question || '핀을 선택해주세요'}</span>
            <hr />

            <div className="box-right_card">
              <ul>
                <li>
                  Community Replies <span>({answers.length})</span>
                </li>

                {answers.length === 0 && (
                  <li className="empty">아직 댓글이 없습니다.</li>
                )}

                {answers.map(a => (
                  <li key={a.answer_no}>
                    <strong>{a.user_nickname}</strong>
                    <br />
                    {dayjs(a.create_datetime).format('YYYY.MM.DD HH:mm')}
                    <br />
                    {a.answer_content}
                  </li>
                ))}
              </ul>

              <textarea
                className="card-box"
                disabled={!isLogin}
                placeholder={
                  isLogin
                    ? '공개 댓글을 작성하세요'
                    : '로그인 후 댓글 작성이 가능합니다'
                }
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
              />

              <button onClick={handleAddAnswer}>댓글 게시</button>
              <hr />
            </div>

            <div className="box-right_memo">
              <p>My Memo (Private)</p>
              {/* {memo.map(m => (
                <div key={m.id}>
                  {m.content}
                  <br />
                  <span>{m.date}</span>
                </div>
              ))} */}

              <textarea
                className="card-box"
                placeholder="이 질문에 대한 개인 메모"
                disabled
              //value={memoText}
              //onChange={(e) => setMemoText(e.target.value)}
              />

              <button
              // onClick={handleAddMemo}
              >
                메모 저장
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* 모바일 모달 */}
      <div
        className={`modal-dim ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className="modal-wrapper"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="detail-modal">
            <button className="close_btn" onClick={() => setIsOpen(false)}>
              <img src={CloseIcon} alt="닫기" />
            </button>
            <div className="detail-box_right">
              <div className="sticky-inner">
                <p className="pin-label">
                  <span className="pin-badge">
                    {selectedPin
                      ? pins.findIndex(p => p.pin_no === selectedPin.pin_no) + 1
                      : '-'}
                  </span>
                  Pin Question
                </p>

                <hr />
                <span className='selected-pin_qna'>{selectedPin?.question || '핀을 선택해주세요'}</span>
                <hr />

                <div className="box-right_card">
                  <ul>
                    <li>
                      Community Replies <span>({answers.length})</span>
                    </li>

                    {answers.length === 0 && (
                      <li className="empty">아직 댓글이 없습니다.</li>
                    )}

                    {answers.map(a => (
                      <li key={a.answer_no}>
                        <strong>{a.user_nickname}</strong>
                        <br />
                        <span>
                          {dayjs(a.create_datetime).format('YYYY.MM.DD HH:mm')}
                        </span>
                        <br />
                        {a.answer_content}
                      </li>
                    ))}
                  </ul>

                  <textarea
                    className="card-box"
                    disabled={!isLogin}
                    placeholder={
                      isLogin
                        ? '공개 댓글을 작성하세요'
                        : '로그인 후 댓글 작성이 가능합니다'
                    }
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                  />

                  <button 
                    onClick={handleAddAnswer}>댓글 게시</button>
                  <hr />
                </div>

                <div className="box-right_memo">
                  <p>My Memo (Private)</p>
                  {/* {memo.map(m => (
                    <div key={m.id}>
                      {m.content}
                      <br />
                      <span>{m.date}</span>
                    </div>
                  ))} */}

                  <textarea
                    className="card-box"
                    placeholder="이 질문에 대한 개인 메모"
                    disabled
                  //value={memoText}
                  //onChange={(e) => setMemoText(e.target.value)}
                  />

                  <button 
                  // onClick={handleAddMemo}
                  >
                    메모 저장
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
}

export default Detail;