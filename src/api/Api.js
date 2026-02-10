import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:9070",
  timeout: 15000,
});

// 요청마다 Bearer 토큰 자동 첨부
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 공통 처리 (선택)
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // 필요 시 로그아웃 처리
      // localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default Api;
