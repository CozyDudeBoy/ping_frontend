import React, { useEffect, useState } from 'react';
import '../styles/upload.scss';
import upload from "../../assets/icon-upload.svg";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Upload(props) {

  // 선택된 문제유형 클래스 변경을 위한 함수 설정 
  const [categories, setCategories] = useState({}); // API 원본
  const [selectedIssues, setSelectedIssues] = useState([]); // 문자열 배열

  // 페이지간 이동을 위한 url관리
  const navigate = useNavigate();

  //린 
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  /* ===============================
     🔹 카테고리 데이터 로딩
     =============================== */
  useEffect(() => {
    axios
      .get('http://localhost:9070/api/categories')
      .then(res => {
        console.log('카테고리 응답:', res.data);
        setCategories(res.data);
      })
      .catch(err => {
        console.error('카테고리 로딩 실패', err);
      });
  }, []);

  // 클릭 핸들러 함수 설정 
  const handleCategoryClick = (issue) => {
    // 이미 선택된 경우 -> 해제 
    if (selectedIssues.includes(issue)) {
      setSelectedIssues(
        selectedIssues.filter(i => i !== issue)
      );
      return;
    }

    // 최대 3개만 선택할수 있게 제한 해주기
    if (selectedIssues.length >= 3) {
      alert('최대 3개까지만 선택할 수 있습니다.');
      return;
    }

    // 새로 선택 
    setSelectedIssues([...selectedIssues, issue]);
  };

  // 린 2/3 수정 pineditor 에 값만 넘기고 db에 최종 저장은 Pineditor에서 
  // const handleNext = async (e) => {
  //   e.preventDefault();

  //   if (!file) {
  //     alert('이미지를 업로드해주세요.');
  //     return;
  //   }

  //   if (!title.trim()) {
  //     alert('제목을 입력해주세요.');
  //     return;
  //   }

  //   try {
  //     const formData = new FormData();
  //     formData.append('image', file);
  //     formData.append('title', title);
  //     formData.append('desc', desc);

  //     // 🔹 문자열 기반 문제유형 전달
  //     formData.append(
  //       'issues',
  //       JSON.stringify(selectedIssues)
  //     );

  //     const res = await axios.post(
  //       'http://localhost:9070/api/posts',
  //       formData,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem('token')}`,
  //           'Content-Type': 'multipart/form-data',
  //         },
  //       }
  //     );

  //     const { postNo, imageNo, imagePath } = res.data;

  //     // 👉 PinEditor로 이동 (🔥 title 반드시 넘김)
  //     navigate('/upload/pineditor', {
  //       state: {
  //         postNo,
  //         imageNo,
  //         imagePath,
  //         issues: selectedIssues,
  //         title, // ✅ 이게 빠져 있었음
  //       },
  //     });

  //   } catch (err) {
  //     console.error(err);
  //     alert('업로드 실패');
  //   }
  // };
  const handleNext = async (e) => {
    e.preventDefault();

    if (!file) {
      alert('이미지를 업로드 해주세요.');
      return;
    }

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (selectedIssues.length === 0) {
      alert('최소 1개의 문제 유형을 선택해 주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('desc', desc);
    formData.append('issues', JSON.stringify(selectedIssues));

    try {
      const res = await axios.post(
        'http://localhost:9070/api/posts',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      navigate('/upload/pineditor', {
        state: {
          postNo: res.data.postNo,
          imageNo: res.data.imageNo,
          imagePath: res.data.imagePath, title,
          issues: selectedIssues,
        },
      });
    } catch (err) {
      console.error(err);
      alert('업로드 중 오류가 발생하였습니다.');
    }
  };

  return (
    <main className='upload container'>
      <section className='grid'>
        {/* 상단 타이틀  */}
        <div className="upload_header col-6">
          <h2>디자인 업로드</h2>
          <p>
            작업을 공유하고 커뮤니티로부터 맥락있는 피드백을 받으세요
          </p>
        </div>

        {/* 폼 영역 */}
        <form className="upload_form col-6">

          {/* 이미지 업로드 안내 영역 */}
          <div className="upload_dropzone" role='button' tabIndex={0}>
            <div className="upload_dropzoneInner">
              <div className="upload_icon" aria-hidden="true">
                <img src={upload} alt="이미지 아이콘" />
              </div>

              <p className="upload_dropText">
                <strong>클릭하여 업로드 </strong>
                <span>또는 드래그 앤 드롭 </span>
              </p>

              <p className="upload_dropHint">
                PNG, JPG, PDF 형식 최대 500KB
              </p>
            </div>

            <input
              type="file"
              className="upload_file"
              accept='.png,.jpg,.jpeg,.pdf'
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>

          {/* 제목 */}
          <div className="upload_field">
            <label htmlFor="title" className='upload_label'>제목</label>
            <input
              type="text"
              className="upload_input"
              id="title"
              placeholder='디자인에 명확한 제목을 입력하세요'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* 설명 */}
          <div className="upload_field">
            <label htmlFor="desc" className="upload_label">설명</label>
            <textarea
              className="upload_textarea"
              id='desc'
              rows={4}
              placeholder='어떤 문제를 해결하려 하나요? 어떤 피드백을 원하시나요?'
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
          </div>

          {/* 문제유형 선택 */}
          <div className="upload_field">
            <div className="upload_row">
              <label className="upload_label">문제 유형 선택</label>
              <span className="upload_counter">
                {selectedIssues.length} / 3 selected
              </span>
            </div>

            <p className="upload_helper">
              최대 3개까지 선택하여 어떤 측면의 피드백이 필요한지 알려주세요
            </p>

            <div className="upload_issueBox">
              {Object.entries(categories).map(([groupName, items]) => (
                <div className="upload_issueGroup" key={groupName}>
                  <h4 className="upload_groupTitle">{groupName}</h4>

                  <div className="upload_chips">
                    {items.map(item => (
                      <button
                        key={`${groupName}-${item}`}
                        type="button"
                        className={`upload_chip ${selectedIssues.includes(item) ? 'active' : ''
                          }`}
                        onClick={() => handleCategoryClick(item)}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단 안내 박스 */}
          <div className="upload_note">
            <h4 className="upload_noteTitle">다음 단계</h4>
            <p className="upload_noteText">
              다음 화면에서 디자인에 핀을 추가하여 피드백이 필요한 부분을 명확이 표시할 수 있습니다.
            </p>
          </div>

          {/* 다음 버튼 */}
          <button
            type="button"
            className="upload_next"
            onClick={handleNext}
          >
            다음: 핀 설정 및 미리보기
          </button>
        </form>
      </section>
    </main>
  );
}

export default Upload;