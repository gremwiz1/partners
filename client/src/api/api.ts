import axios, { AxiosError } from "axios";
import { UserProfile } from "../utils/type";

const API_BASE_URL = "http://localhost:4000";

export const registerUser = async (userData: UserProfile) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, userData);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axios.get<UserProfile>(`${API_BASE_URL}/profile`);
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateProfile = async (
  userData: UserProfile,
  profilePhotoFile?: File
) => {
  const formData = new FormData();

  Object.keys(userData).forEach((key) => {
    const value = userData[key];
    if (value !== undefined) {
      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else {
        formData.append(key, value);
      }
    }
  });

  if (profilePhotoFile) {
    formData.append("profilePhoto", profilePhotoFile);
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error);
  }
};

const handleAxiosError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    throw new Error((error as AxiosError).message);
  } else {
    throw new Error("Произошла неизвестная ошибка");
  }
};

export const listUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
    throw new Error("Произошла ошибка при запросе списка пользователей");
  }
};

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
