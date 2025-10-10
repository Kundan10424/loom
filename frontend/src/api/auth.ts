import axiosInstance from "./axiosInstance";

interface SignupData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

// Normal Signup
export const signupUser = (data: SignupData) =>
  axiosInstance.post("/auth/signup", data);

// Normal Login
export const loginUser = (data: LoginData) =>
  axiosInstance.post("/auth/login", data);
