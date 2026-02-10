import React, { useEffect, useMemo, useRef, useState } from "react";
import Api from "../../api/Api";

import IconEdit2 from "../../assets/icon-edit-2.svg";
import IconId from "../../assets/icon-user.svg";     // 없으면 IconEdit2로 교체 가능
import IconEdit from "../../assets/icon-edit.svg";   // 아바타 위 작은 편집 아이콘

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function MyPageHeader() {
  const [profile, setProfile] = useState(null);

  // 아바타 업로드 상태
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Api 인스턴스의 baseURL(=http://localhost:9070)
  const API_BASE = Api.defaults.baseURL || "http://localhost:9070";
  const DEFAULT_AVATAR = `${API_BASE}/uploads/default.png`;

  // 1) 프로필 조회: /users/me 로 통일
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await Api.get("/api/users/me");
        setProfile(res.data);
      } catch (err) {
        console.error("프로필 불러오기 실패:", err);
      }
    };
    fetchProfile();
  }, []);

  // 2) 선택한 파일이 있으면 미리보기 URL 생성
  const previewUrl = useMemo(() => {
    if (!selectedFile) return null;
    return URL.createObjectURL(selectedFile);
  }, [selectedFile]);

  // 3) 메모리 누수 방지
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!profile) return <div className="mypage-header">불러오는 중...</div>;

  // 4) 아바타 URL 안전하게 만들기
  const resolveAvatarSrc = () => {
    if (previewUrl) return previewUrl;

    const img = profile.user_image?.trim();

    // ✅ 값이 없으면 서버 default.png
    if (!img) return DEFAULT_AVATAR;

    if (img.startsWith("http")) return img;

    if (img.startsWith("/")) return `${API_BASE}${img}`;

    return `${API_BASE}/uploads/${img}`;
  };

  const avatarSrc = resolveAvatarSrc();

  const openFilePicker = () => fileInputRef.current?.click();

  const onKeyDownAvatar = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openFilePicker();
    }
  };

  const onSelectFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 타입 검사
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 선택할 수 있어요.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    // 용량 검사
    if (file.size > MAX_FILE_SIZE) {
      alert("이미지는 5MB 이하만 가능해요.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setSelectedFile(file);
    setSaveError("");
  };

  const cancelAvatarChange = () => {
    setSelectedFile(null);
    setSaveError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const saveAvatar = async () => {
    if (!selectedFile) return;

    try {
      setSaving(true);
      setSaveError("");

      const formData = new FormData();
      formData.append("avatar", selectedFile);

      // ✅ 토큰은 Api 인터셉터가 자동 첨부
      const res = await Api.put("/api/users/profile/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newImage = res.data?.user_image;

      // 프로필 갱신
      setProfile((prev) => ({
        ...prev,
        user_image: newImage || prev.user_image,
      }));

      // 선택 상태 초기화
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (e) {
      console.error(e);
      setSaveError(e?.response?.data?.message || "아바타 저장 실패");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mypage-header">
      <div className="profile-left">
        <div
          className="avatar"
          role="button"
          tabIndex={0}
          onClick={openFilePicker}
          onKeyDown={onKeyDownAvatar}
          aria-label="프로필 이미지 변경"
        >
          <img
            src={avatarSrc}
            alt="프로필"
            onError={(e) => {
              // ✅ 무한 루프 완전 방지
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_AVATAR;
            }}
          />
          <div className="avatar-edit" aria-hidden="true">
            <img src={IconEdit} alt="" />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            hidden
          />
        </div>

        {/* 파일 선택했을 때만 저장/취소 UI */}
        {selectedFile && (
          <div className="avatar-actions">
            <button className="btn btn-save" onClick={saveAvatar} disabled={saving}>
              {saving ? "저장중..." : "저장"}
            </button>
            <button className="btn btn-cancel" onClick={cancelAvatarChange} disabled={saving}>
              취소
            </button>
            {saveError && <p className="form-error">{saveError}</p>}
          </div>
        )}
      </div>

      <div className="profile-right">
        <div className="name-row">
          <h2>{profile.user_nickname}</h2>
          <span className="badge">{profile.user_grade}</span>
        </div>

        <p className="job">{profile.user_intro || "아직 소개가 없어요"}</p>

        <div className="info-row">
          {/* 아이디 표시 */}
          <div className="info-item">
            <span className="icon">
              <img src={IconId || IconEdit2} alt="아이디" />
            </span>
            <span>{profile.user_id}</span>
          </div>

          {/* 가입일 */}
          <div className="info-item">
            <span className="icon">
              <img src={IconEdit2} alt="가입일" />
            </span>
            <span>{profile.create_datetime?.slice(0, 10)}</span>
          </div>
        </div>
      </div>

      <div className="profile-action"></div>
    </section>
  );
}
