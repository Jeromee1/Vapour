import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchFavoriteGames = async () => {
    try {
        const {data} = await axios.get(`${API_URL}/favorites`)
    } catch (e) {
        return { success: false, msg: e.response?.data.msg || "Cannot fetch Favorites" };
    }
}

export const updateFavorites = async (gameId) => {
  try {
    const { data } = await axios.put(`${API_URL}/favorites`, { gameId }, { withCredentials: true });
    return { success: true, data };
  } catch (e) {
    return { success: false, msg: e.response?.data.msg || "Cannot update Favorites" };
  }
};
