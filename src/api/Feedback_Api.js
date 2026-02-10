import Api from "./Api";

export const getFeedbackDetail = (answer_no) =>
  Api.get(`/api/feedback/${answer_no}`);

export const updateFeedback = (answer_no, answer_content) =>
  Api.put(`/api/feedback/${answer_no}`, { answer_content });

export const deleteFeedback = (answer_no) =>
  Api.delete(`/api/feedback/${answer_no}`);

