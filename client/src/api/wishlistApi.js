import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getUserWishlist = async (userId) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const { data } = await axios.get(`${API_URL}/wishlist/${userId}`);
    return data;
  } catch (error) {
    console.error("Cannot get Wishlist:", error.message);
    throw error;
  }
};

export const updateWishlist = async (gameId) => {
  try {
    const { data } = await axios.put(`${API_URL}/wishlist`, { gameId }, { withCredentials: true });
    return data;
  } catch (e) {
    return { success: false, msg: e.response?.data.msg || "Cannot update Wishlist" };
  }
};
