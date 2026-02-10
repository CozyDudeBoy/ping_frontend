import React, { useState } from 'react'; // ✅ useState 추가
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/auth.scss';
import Select from './Select';
import eye from "../../assets/icon-eye.svg";

function Signup() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  // ======================
  // form state
  // ======================
  const [form, setForm] = useState({
    user_id: "",
    user_nickname: "",
    user_pw: "",
    user_pw_confirm: "",
    user_intro: "",
    user_grade: "GENERAL",
  });

  const [error, setError] = useState("");

  // ======================
  // 공통 input change
  // ======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  // ======================
  // 경력 UI → ENUM 매핑
  // (label이 오든 ENUM이 오든 둘 다 처리)
  // ======================
  const gradeMap = {
    "0~3년": "GENERAL",
    "3~7년": "BASIC",
    "7년 이상": "PRO",
    "GENERAL": "GENERAL",
    "BASIC": "BASIC",
    "PRO": "PRO",
  };

  const handleGradeSelect = (value) => {
    setForm(prev => ({
      ...prev,
      user_grade: gradeMap[value] || "GENERAL",
    }));
  };

  // ======================
  // submit
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.user_id.trim()) {
      return setError("아이디를 입력해 주세요.");
    }
    if (!form.user_nickname.trim()) {
      return setError("닉네임을 입력해 주세요.");
    }
    if (!form.user_pw) {
      return setError("비밀번호를 입력해 주세요.");
    }
    if (form.user_pw !== form.user_pw_confirm) {
      return setError("비밀번호 확인이 일치하지 않습니다.");
    }

    try {
      const payload = {
        user_id: form.user_id.trim(),
        user_nickname: form.user_nickname.trim(),
        user_pw: form.user_pw,
        user_intro: form.user_intro,
        user_grade: form.user_grade,
      };

      const res = await axios.post(
        "http://localhost:9070/api/auth/signup",
        payload
      );

      console.log("회원가입 성공:", res.data);
      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      navigate('/login');

    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
        "회원가입 실패. 아이디 또는 닉네임 중복."
      );
    }
  };

  // ======================
  // render
  // ======================
  return (
    <section className='signup_section container auth'>
      <div className="grid">
        <div className="col-4">
          <h2>JOIN</h2>

          <div className="divider">
            <span>SNS로 가입하기</span>
          </div>

          <ul className="social-login">
            <li>
              <Link to="/auth/naver">
                <img src={process.env.PUBLIC_URL + '/images/naver.jpg'} alt="네이버" />
              </Link>
            </li>
            <li>
              <Link to="/auth/kakao">
                <img src={process.env.PUBLIC_URL + '/images/kakao.jpg'} alt="카카오" />
              </Link>
            </li>
            <li>
              <Link to="/auth/google">
                <img src={process.env.PUBLIC_URL + '/images/google.jpg'} alt="구글" />
              </Link>
            </li>
          </ul>

          <div className="divider">
            <span>이메일로 가입하기</span>
          </div>

          {error && <p className="form-error">{error}</p>}

          <form className='join_form' onSubmit={handleSubmit}>
            {/* 아이디 */}
            <div className='form-group'>
              <label htmlFor="id">아이디</label>
              <input
                type="text"
                name="user_id"
                id="id"
                placeholder='아이디를 입력하세요.'
                value={form.user_id}
                onChange={handleChange}
                required
              />
            </div>

            {/* 닉네임 */}
            <div className='form-group'>
              <label htmlFor="nickname">닉네임</label>
              <input
                type="text"
                name="user_nickname"
                id="nickname"
                placeholder='닉네임을 입력하세요.'
                value={form.user_nickname}
                onChange={handleChange}
                required
              />
            </div>

            {/* 비밀번호 */}
            <div className='form-group'>
              <label htmlFor="password">비밀번호</label>
              <div className="password-wrapper">
                <input
                  type={show ? "text" : "password"}
                  name="user_pw"
                  id="password"
                  placeholder="비밀번호를 입력하세요."
                  value={form.user_pw}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="eye-btn"
                  onMouseDown={() => setShow(true)}
                  onMouseUp={() => setShow(false)}
                  onMouseLeave={() => setShow(false)}
                  onTouchStart={() => setShow(true)}
                  onTouchEnd={() => setShow(false)}
                >
                  <img src={eye} alt="eye" className="eye" />
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div className='form-group'>
              <label htmlFor="passwordConfirm">비밀번호 확인</label>
              <input
                type="password"
                name="user_pw_confirm"
                id="passwordConfirm"
                placeholder="비밀번호를 다시 입력하세요."
                value={form.user_pw_confirm}
                onChange={handleChange}
                required
              />
            </div>

            {/* 자기소개 */}
            <div className='form-group'>
              <label htmlFor="intro">자기소개</label>
              <input
                type="text"
                name="user_intro"
                id="intro"
                placeholder='자기소개를 입력해주세요.'
                value={form.user_intro}
                onChange={handleChange}
              />
            </div>

            {/* 경력 */}
            <div className='form-group'>
              <label>경력</label>
              <Select
                placeholder="경력을 선택하세요"
                options={["0~3년", "3~7년", "7년 이상"]}
                onChange={handleGradeSelect}
              />
            </div>

            <button type="submit">회원 가입</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Signup;