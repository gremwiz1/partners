import axios, { AxiosError } from "axios";
import { UserProfile } from "../utils/type";
import { API_BASE_URL } from "../utils/const";

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

export const registerUser = async (
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
    const response = await axios.post(`${API_BASE_URL}/register`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
    const response = await axios.get<UserProfile>(`${API_BASE_URL}/account`);
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
    const response = await axios.put(`${API_BASE_URL}/account`, formData, {
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
    const response = await axios.get(`${API_BASE_URL}/people`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
    throw new Error("Произошла ошибка при запросе списка пользователей");
  }
};
