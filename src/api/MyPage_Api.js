// src/api/MyPage_Api.js
// src/api/MyPage_Api.js
import Api from "./Api";

export const getMyFeedback = () => Api.get("/api/feedback");
export const getMyFeedbackDetail = (answer_no) => Api.get(`/api/feedback/${answer_no}`);
export const updateMyFeedback = (answer_no, answer_content) =>
  Api.put(`/api/feedback/${answer_no}`, { answer_content });
export const deleteMyFeedback = (answer_no) =>
  Api.delete(`/api/feedback/${answer_no}`);

