import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/qna.scss';

function QuestionForm() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert('제목을 입력해 주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력해 주세요.');
            return;
        }
        try {
            await axios.post(
                'http://localhost:9070/qna/questions',
                { title, content },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(('token'))}`,
                    },
                }
            );

            alert('질문이 등록되었습니다.');
            navigate('/qna');
        } catch (err) {
            console.error(err);
            alert('질문 등록에 실패하였습니다.');
        }
    };

    return (
        <main className='qna-form container'>
            <div className='grid'>
                <div className="col-4">
                    <h2>질문하기</h2>
                    <div className='divider'>
                        <span>궁금하신 부분을 작성해 주세요</span>
                    </div>

                    <form className="qna-form_box" onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor="qna-title">제목</label>
                            <input
                                id='qna-title'
                                placeholder='제목을 입력해 주세요'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor="qna-content">내용</label>
                            <textarea
                                id="qna-content"
                                placeholder='궁금하신 내용을 작성해 주세요'
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={8}
                                required
                            />
                        </div>

                        <button type='submit' className='btn_submit'>
                            작성완료
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default QuestionForm;