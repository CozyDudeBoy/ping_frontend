import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.scss';
import eye from "../../assets/icon-eye.svg";
import axios from 'axios';

function Login(props) {
  // 페이지간 이동을 위한 navigate 선언 
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  // 입력한 값을 담기 위한 form 선언
  const [form, setForm] = useState({
    user_id:'',
    user_pw: '',
  });

  const handleChange =(e)=>{
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost:9070/api/auth/login',
        form
      );

      // JsonWebToken 저장
      localStorage.setItem('token', res.data.token);

      alert('로그인 성공');
      window.location.href = '/';
    } catch (err) {
      alert(err.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <section className='login_section container auth'>
      <div className="grid">
        <div className="col-4 ">
          <h2>LOGIN</h2>

          <ul className="social-login">
            <li><Link to="/auth/naver"><img src={process.env.PUBLIC_URL + '/images/naver.jpg'} alt="네이버" /></Link></li>
            <li><Link to="/auth/kakao"><img src={process.env.PUBLIC_URL + '/images/kakao.jpg'} alt="카카오"/></Link></li>
            <li><Link to="/auth/google"><img src={process.env.PUBLIC_URL + '/images/google.jpg'} alt="구글"/></Link></li>
          </ul>

          <form className='login_form' onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor="id">아이디</label>
              <input type="text" name="user_id" id="id" placeholder='아이디를 입력하세요.' value={form.user_id} onChange={handleChange} required />
            </div>

            <div className='form-group'>
              <label htmlFor="password">비밀번호</label>

              <div className="password-wrapper">
                <input
                  type={show ? "text" : "password"}   // ✅ 여기!
                  name="user_pw"
                  id="password"
                  placeholder="비밀번호를 입력하세요."
                  value={form.user_pw}
                  onChange={handleChange}
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
                  <img
        src={eye} alt="eye" className="eye"
      />
                </button>
              </div>
            </div>

            <Link to="/find-account">아이디/비밀번호 찾기</Link>
            <button type="submit">로그인</button>
          </form>

          <div className="login_bottom">
            <p>신규 사용자인가요?</p>
            <Link to="/signup">회원가입</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
