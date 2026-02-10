import React from 'react';
import { useNavigate } from 'react-router-dom';

function FeedbackAchive(props) {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('로그인 후 이용 가능합니다');
      navigate('/login');
      return;
    }

    navigate('/upload');
  };

  return (
    <article
      className='main_feedback-archive container'
      style={{ backgroundImage: 'url("/images/main_feedbackachive.png")' }}
    >
      <div className="grid">
        <div className="col-12">
          <img
            src={process.env.PUBLIC_URL + '/images/main_bigpin.png'}
            alt="핀 이미지"
          />
          <h2>
            나만의 피드백 아카이브를 <span className="tab-br"></span>
            만들어 보세요.
          </h2>

          <button
            type="button"
            className="upload-btn"
            onClick={handleUploadClick}
          >
            디자인 올리기
          </button>
        </div>
      </div>
    </article>
  );
}

export default FeedbackAchive;
