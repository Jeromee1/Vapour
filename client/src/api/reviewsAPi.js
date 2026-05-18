import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getReviews = async (gameId) => {
  try {
    const { data } = await axios.get(`${API_URL}/reviews/${gameId}`);
    return data;
  } catch (e) {
    console.error("Failed to fetch reviews", e);
  }
};

export const addReview = async (gameId, formData) => {
  try {
    const { data } = await axios.post(`${API_URL}/reviews/${gameId}`, formData, { withCredentials: true });
    return data;
  } catch (e) {
    console.error("Failed to add review", e);
  }
};

export const deleteReview = async (revId) => {
  try {
    const { data } = await axios.delete(`${API_URL}/reviews/${revId}`, { withCredentials: true });
    return data;
  } catch (e) {
    console.error("Failed to delete review", e);
  }
};
