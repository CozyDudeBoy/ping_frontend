import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/pinEditor.scss';
import left from '../../assets/icon-chevron-left.svg';
import axios from 'axios';

function PinEditor() {
  /* ===============================
    상태
  =============================== */
  const [pins, setPins] = useState([]);
  const [activePinId, setActivePinId] = useState(null);
  const imgRef = useRef(null);
  const [post, setPost] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Upload에서 넘어온 값
  const {
    postNo,
    imageNo,
    imagePath,
    issues = [],     // 게시물 카테고리 (최대 3개)
    title,           // ⭕ 업로드에서 입력한 제목
  } = location.state || {};

  /* ===============================
    게시물 정보 조회 (새로고침 대비)
  =============================== */
  useEffect(() => {
    if (!postNo) return;

    axios.get(`http://localhost:9070/api/designs/${postNo}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        setPost(res.data);
      })
      .catch(err => console.error(err));
  }, [postNo]);

  /* ===============================
    핀 추가
  =============================== */
  const handleAddPin = (e) => {
    if (!imgRef.current) return;

    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (x < 0 || x > 100 || y < 0 || y > 100) return;

    const newPin = {
      id: Date.now(),
      x,
      y,
      question: '',
      issue: '',        // 🔥 단수로 통일
    };

    setPins(prev => [...prev, newPin]);
    setActivePinId(newPin.id);
  };

  const activePin = pins.find(pin => pin.id === activePinId);
  const hasPin = pins.length > 0;

  /* ===============================
    핀 삭제
  =============================== */
  const handleDeletePin = () => {
    if (!activePinId) return;

    if (!window.confirm('이 핀을 삭제할까요?')) return;

    setPins(prev => prev.filter(pin => pin.id !== activePinId));
    setActivePinId(null);
  };

  /* ===============================
    핀 전체 저장 (완료 버튼)
  =============================== */
  const handleComplete = async () => {
    if (!postNo) {
      alert('게시물 정보가 없습니다.');
      return;
    }

    if (pins.length === 0) {
      alert('최소 1개의 핀을 추가하세요.');
      return;
    }

    // 유효성 검사
    for (const pin of pins) {
      if (!pin.question.trim() || !pin.issue) {
        alert('모든 핀에 질문과 문제 유형을 선택하세요.');
        return;
      }
    }

    try {
      for (const pin of pins) {
        await axios.post(
          'http://localhost:9070/api/pins',
          {
            postNo,
            imageNo,
            x: pin.x,
            y: pin.y,
            question: pin.question,
            issue: pin.issue,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
      }

      navigate(`/detail/${postNo}`);
    } catch (err) {
      console.error(err);
      alert('핀 저장 실패');
    }
  };

  /* ===============================
    렌더
  =============================== */
  return (
    <main className="pineditor container">
      <div className="grid pineditor_root">

        {/* 헤더 */}
        <div className="pineditor_header col-12">
          <div className="p_header_left">
            <button className="p_header_back" onClick={() => navigate(-1)}>
              <img src={left} alt="뒤로" />
              <span>뒤로</span>
            </button>

            <div className="p_header_title">
              <h1 className="p_title_text">
                {title || post?.post_title || '게시물 제목'}
              </h1>
              <p className="p_title_sub">{pins.length}개의 핀</p>
            </div>
          </div>
        </div>

        <div className="pineditor_body col-12">
          <div className="grid">

            {/* 캔버스 */}
            <section className="pineditor_canvas col-8">
              <div className="canvas_outer">
                <div className="canvas_image_wrap">
                  <img
                    ref={imgRef}
                    src={`http://localhost:9070${imagePath}`}
                    alt="업로드 이미지"
                    className="canvas_image"
                    draggable={false}
                    onClick={handleAddPin}
                  />

                  {pins.map((pin, index) => (
                    <div
                      key={pin.id}
                      className={`pin_marker ${pin.id === activePinId ? 'active' : ''}`}
                      style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePinId(pin.id);
                      }}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* 사이드바 */}
            <aside className="pineditor_sidebar col-4">

              <div className="sidebar_header">
                <h2>Pin Question</h2>
                {activePin && (
                  <button className="btn_pin_delete" onClick={handleDeletePin}>
                    삭제
                  </button>
                )}
              </div>

              <div className="sidebar_content">
                {!hasPin && (
                  <div className="pineditor_guide">
                    <p>이미지 위에 핀을 찍어</p>
                    <p>질문 위치를 선택하세요</p>
                  </div>
                )}

                {activePin && (
                  <>
                    {/* 질문 */}
                    <div className="form_group">
                      <label>질문 *</label>
                      <textarea
                        value={activePin.question}
                        onChange={(e) => {
                          setPins(prev =>
                            prev.map(pin =>
                              pin.id === activePin.id
                                ? { ...pin, question: e.target.value }
                                : pin
                            )
                          );
                        }}
                      />
                    </div>

                    {/* 문제 유형 */}
                    <div className="form_group">
                      <label>문제 유형 *</label>
                      <div className="tag_box">
                        {issues.map(issue => (
                          <button
                            key={issue}
                            type="button"
                            className={`tag ${activePin.issue === issue ? 'active' : ''}`}
                            onClick={() => {
                              setPins(prev =>
                                prev.map(pin =>
                                  pin.id === activePin.id
                                    ? { ...pin, issue }
                                    : pin
                                )
                              );
                            }}
                          >
                            {issue}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="sidebar_footer">
                <button
                  className="btn_submit"
                  onClick={handleComplete}
                  disabled={pins.length === 0}
                >
                  핀 게시물 업로드
                </button>
              </div>

            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

export default PinEditor;
