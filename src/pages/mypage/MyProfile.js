import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "../auth/Select";

function MyProfile() {
  const navigate = useNavigate();

  const API_BASE = "http://localhost:9070";

  // ======================
  // form state
  // ======================
  const [form, setForm] = useState({
    user_id: "",
    user_nickname: "",
    user_intro: "",
    user_grade: "GENERAL",

    // 비밀번호 (선택)
    current_pw: "",
    new_pw: "",
    new_pw_confirm: "",
  });

  const [originForm, setOriginForm] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ======================
  // 인증 헤더 구성 (Bearer)
  // ======================
  const authConfig = useMemo(() => {
    const token = localStorage.getItem("token");
    return {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    };
  }, []);

  // ======================
  // ENUM 매핑
  // ======================
  const gradeMap = {
    "0~3년": "GENERAL",
    "3~7년": "BASIC",
    "7년 이상": "PRO",
  };

  const gradeLabelMap = {
    GENERAL: "0~3년",
    BASIC: "3~7년",
    PRO: "7년 이상",
  };

  // ======================
  // 최초 데이터 로드
  // ======================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("로그인이 필요합니다. (토큰 없음)");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/api/users/me`, authConfig);

        setForm((prev) => ({
          ...prev,
          user_id: res.data.user_id || "",
          user_nickname: res.data.user_nickname || "",
          user_intro: res.data.user_intro || "",
          user_grade: res.data.user_grade || "GENERAL",
        }));

        setOriginForm({
          user_nickname: res.data.user_nickname || "",
          user_intro: res.data.user_intro || "",
          user_grade: res.data.user_grade || "GENERAL",
        });

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || "프로필 정보를 불러오지 못했습니다.");
        setLoading(false);
      }
    };

    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ======================
  // 공통 change
  // ======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleGradeSelect = (label) => {
    setForm((prev) => ({
      ...prev,
      user_grade: gradeMap[label] || "GENERAL",
    }));
  };

  // ======================
  // 변경 여부 체크
  // ======================
  const isChanged = () => {
    if (!originForm) return false;

    const baseChanged =
      form.user_nickname !== originForm.user_nickname ||
      form.user_intro !== originForm.user_intro ||
      form.user_grade !== originForm.user_grade;

    const pwChanged = !!(form.current_pw || form.new_pw || form.new_pw_confirm);

    return baseChanged || pwChanged;
  };

  // ======================
  // submit
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    if (!form.user_nickname.trim()) {
      return setError("닉네임을 입력해 주세요.");
    }

    // 비밀번호 변경 검증 (선택)
    if (form.current_pw || form.new_pw || form.new_pw_confirm) {
      if (!form.current_pw) return setError("현재 비밀번호를 입력해 주세요.");
      if (!form.new_pw) return setError("새 비밀번호를 입력해 주세요.");
      if (form.new_pw !== form.new_pw_confirm) return setError("새 비밀번호 확인이 일치하지 않습니다.");
    }

    try {
      setSaving(true);

      const payload = {
        user_nickname: form.user_nickname.trim(),
        user_intro: form.user_intro,
        user_grade: form.user_grade,
      };

      // 비밀번호 입력 시만 전송
      if (form.new_pw) {
        payload.current_pw = form.current_pw;
        payload.new_pw = form.new_pw;
      }

      await axios.put(`${API_BASE}/api/users/profile`, payload, authConfig);

      alert("프로필이 수정되었습니다.");

      // 비번 입력칸 비우기
      setForm((prev) => ({
        ...prev,
        current_pw: "",
        new_pw: "",
        new_pw_confirm: "",
      }));

      // origin 갱신
      setOriginForm({
        user_nickname: payload.user_nickname,
        user_intro: payload.user_intro || "",
        user_grade: payload.user_grade || "GENERAL",
      });

      navigate("/mypage");
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "프로필 수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  // ======================
  // 취소
  // ======================
  const handleCancel = () => {
    navigate(-1);
  };

  // ======================
  // 회원 탈퇴
  // ======================
  const handleWithdraw = async () => {
    if (deleting) return;

    const ok = window.confirm(
      "정말 회원 탈퇴할까요?\n탈퇴 시 모든 정보는 삭제되며 복구할 수 없습니다."
    );
    if (!ok) return;

    try {
      setDeleting(true);

      await axios.delete(`${API_BASE}/api/users/me`, authConfig);

      // 토큰 제거
      localStorage.removeItem("token");

      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/"); // 또는 /login
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "회원 탈퇴에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p>로딩중...</p>;

  return (
    <section className="mypage_section container auth">
      <div className="grid">
        <div className="col-4">
          <h2>프로필 수정</h2>

          {error && <p className="form-error">{error}</p>}

          <form onSubmit={handleSubmit} className="join_form">
            {/* 아이디 */}
            <div className="form-group">
              <label>아이디</label>
              <input type="text" value={form.user_id} disabled />
            </div>

            {/* 닉네임 */}
            <div className="form-group">
              <label>닉네임</label>
              <input
                type="text"
                name="user_nickname"
                value={form.user_nickname}
                onChange={handleChange}
              />
            </div>

            {/* 자기소개 */}
            <div className="form-group">
              <label>자기소개</label>
              <input
                type="text"
                name="user_intro"
                value={form.user_intro}
                onChange={handleChange}
              />
            </div>

            {/* 경력 */}
            <div className="form-group">
              <label>경력</label>
              <Select
                placeholder="경력을 선택하세요"
                options={["0~3년", "3~7년", "7년 이상"]}
                defaultValue={gradeLabelMap[form.user_grade] || "0~3년"}
                onChange={handleGradeSelect}
              />
            </div>

            <hr />

            {/* 비밀번호 변경 */}
            <h4>비밀번호 변경 (선택)</h4>

            <div className="form-group">
              <label>현재 비밀번호</label>
              <input
                type="password"
                name="current_pw"
                value={form.current_pw}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>새 비밀번호</label>
              <input
                type="password"
                name="new_pw"
                value={form.new_pw}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>새 비밀번호 확인</label>
              <input
                type="password"
                name="new_pw_confirm"
                value={form.new_pw_confirm}
                onChange={handleChange}
              />
            </div>

            {/* 버튼 */}
            <div className="btn-group">
              <button type="button" className="btn-cancel" onClick={handleCancel}>
                취소
              </button>

              <button type="submit" disabled={!isChanged() || saving}>
                {saving ? "저장중..." : "수정하기"}
              </button>
            </div>
          </form>

          {/* 회원 탈퇴 */}
          <div className="danger-zone">
            <h4>회원 탈퇴</h4>
            <p>탈퇴 시 모든 정보는 삭제되며 복구할 수 없습니다.</p>
            <button className="btn-danger" onClick={handleWithdraw} disabled={deleting}>
              {deleting ? "탈퇴 처리중..." : "회원 탈퇴"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MyProfile;
