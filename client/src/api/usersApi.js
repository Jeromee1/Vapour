import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const register = async (user) => {
  const { data } = await axios.post(`${API_URL}/users/register`, user);
  return data;
};

export const login = async (user) => {
  try {
    let { data } = await axios.post(`${API_URL}/users/login`, user, {
      withCredentials: true,
    });
    return { success: true, data };
  } catch (e) {
    return { success: false, msg: e.response?.data.msg || "Something went wrong" };
  }
};

export const updateUser = async (userData) => {
  const formData = new FormData();

  formData.append("fullname", userData.fullname);
  formData.append("username", userData.username);
  formData.append("bio", userData.bio);
  formData.append("age", userData.age);
  if (userData.pfp instanceof File) {
    formData.append("pfp", userData.pfp);
  }

  const { data } = await axios.put(`${API_URL}/users`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getMyUser = async () => {
  const { data } = await axios.get(`${API_URL}/users/me`, { withCredentials: true });
  return data;
};

export const getUser = async (id) => {
  const { data } = await axios.get(`${API_URL}/users/${id}`);
  return data;
};

export const getAllUsers = async () => {
  const { data } = await axios.get(`${API_URL}/users`);
  return data;
};

export const removeCookie = async () => {
  let { data } = await axios.post(`${API_URL}/users/logout`, null, {
    withCredentials: true,
  });
  return data;
};

export const fetchDevelopedGames = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/users/me`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("Error fetching games:", error);
  }
};
