import Api from "./Api";

// --- 다른 어드민 페이지에서 쓰는 것들 ---
export const getPosts = () => Api.get("/admin/posts");

export const fetchIssueTypes = (groupNo = "all", status = "all") =>
  Api.get("/admin/categories", { params: { groupNo, status } });

export const createIssueType = ({ group_no, category_name }) =>
  Api.post("/admin/categories", { group_no, category_name });

export const updateIssueType = (categoryNo, { group_no, category_name }) =>
  Api.put(`/admin/categories/${categoryNo}`, { group_no, category_name });

export const setIssueTypeActive = (categoryNo, is_active) =>
  Api.patch(`/admin/categories/${categoryNo}/status`, { is_active });

export const mergeIssueTypes = (from_category_no, to_category_no) =>
  Api.post("/admin/categories/merge", { from_category_no, to_category_no });
