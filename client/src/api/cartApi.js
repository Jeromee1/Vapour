import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCart = async () => {
  const { data } = await axios.get(`${API_URL}/cart`, {
    withCredentials: true,
  });
  return data;
};

export const pushToCart = async (gameId) => {
  try {
    const { data } = await axios.post(`${API_URL}/cart`, { gameId }, { withCredentials: true });
    return { success: true, data };
  } catch (e) {
    return { success: false, msg: e.response?.data.msg || "Cannot add to cart" };
  }
};

export const deleteCartItem = async (gameId) => {
  try {
    let { data } = await axios.delete(`${API_URL}/cart/${gameId}`, {
      withCredentials: true,
    });
    return data;
  } catch (e) {
    return {
      msg: "Failed to delete cart item",
      error: e.response?.data?.message || e.message,
    };
  }
};

export const deleteCart = async () => {
  try {
    await axios.delete(`${API_URL}/cart`, { withCredentials: true });
    return;
  } catch (e) {
    return { msg: "delete died" };
  }
};

export const cartCheckout = async () => {
  try {
    const { data } = await axios.post(`${API_URL}/orders`, null, {
      withCredentials: true,
    });

    return data;
  } catch (e) {
    return { msg: "Error checking out" };
  }
};
