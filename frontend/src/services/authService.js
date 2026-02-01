import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // backend base URL
});

export const registerUser = (data) => API.post("/register", data);
export const verifyUser = (data) => API.post("/verify", data);
export const loginUser = (data) => API.post("/login", data);
export const getMe = (token) =>
  API.get("/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
