import Api from "./Api";

export const login = (payload) =>
  Api.post("/auth/login", payload);

export const signup = (payload) =>
  Api.post("/auth/signup", payload);
