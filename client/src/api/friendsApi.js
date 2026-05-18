import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchFriendRequestsOut = async () => {
  const { data } = await axios.get(`${API_URL}/friends/requestsOut`, { withCredentials: true });
  return data;
};

export const fetchFriendRequestsIn = async () => {
  const { data } = await axios.get(`${API_URL}/friends/requestsIn`, { withCredentials: true });
  return data;
};

export const sendFriendRequest = async (userId) => {
  const { data } = await axios.post(`${API_URL}/friends`, { userId }, { withCredentials: true });
  return data;
};

export const statusFriendRequest = async (requestId, response) => {
  try {
    const { data } = await axios.delete(`${API_URL}/friends/${requestId}`, {
      data: { requestStatus: response },
      withCredentials: true,
    });
    return data;
  } catch (e) {
    console.error("Friend request update failed", e);
  }
};

export const removeFriend = async (friendId) => {
  const { data } = await axios.patch(`${API_URL}/friends/${friendId}`, {}, { withCredentials: true });
  return data;
};
