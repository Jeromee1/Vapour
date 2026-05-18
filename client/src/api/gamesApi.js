import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAllGames = async () => {
  try {
    const { data } = (await axios.get(`${API_URL}/games`)) ?? [];
    return data;
  } catch (e) {
    console.error("Failed to fetch games:", e);
    return [];
  }
};

export const fetchGame = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/games/${id}`);
    return data;
  } catch (e) {
    return console.error("Failed to fetch game:", e);
  }
};

export const addGame = async (finalFormData) => {
  try {
    const formData = new FormData();
    formData.append("title", finalFormData.title);
    formData.append("description", finalFormData.description);
    formData.append("genre", finalFormData.genre.join(","));
    formData.append("price", finalFormData.price);
    formData.append("video", finalFormData.video);
    formData.append("age", finalFormData.age);
    formData.append("theme", finalFormData.theme);
    formData.append("banner", finalFormData.banner);
    formData.append("thumbnail", finalFormData.thumbnail);
    formData.append("subImg1", finalFormData.subImg1);
    formData.append("subImg2", finalFormData.subImg2);
    formData.append("subImg3", finalFormData.subImg3);
    formData.append("subImg4", finalFormData.subImg4);

    const { data } = await axios.post(`${API_URL}/games`, formData, {
      withCredentials: true,
    });
    return data;
  } catch (e) {
    return console.error("Failed to add game");
  }
};

export const updateGame = async (updatedFormData, gameId) => {
  try {
    const formData = new FormData();
    formData.append("title", updatedFormData.title);
    formData.append("description", updatedFormData.description);
    formData.append("genre", updatedFormData.genre.join(","));
    formData.append("price", updatedFormData.price);
    formData.append("video", updatedFormData.video);
    formData.append("age", updatedFormData.age);
    formData.append("theme", updatedFormData.theme);
    formData.append("banner", updatedFormData.banner);
    formData.append("thumbnail", updatedFormData.thumbnail);
    formData.append("subImg1", updatedFormData.subImg1);
    formData.append("subImg2", updatedFormData.subImg2);
    formData.append("subImg3", updatedFormData.subImg3);
    formData.append("subImg4", updatedFormData.subImg4);
    formData.append("onSale", updatedFormData.onSale);

    const { data } = await axios.put(`${API_URL}/games/${gameId}`, formData, {
      withCredentials: true,
    });
    return data;
  } catch (e) {
    return console.error("Failed to add game");
  }
};

export const updateStatus = async (gameId, checked) => {
  try {
    const data = await axios.patch(`${API_URL}/games/status/${gameId}`, { checked }, { withCredentials: true });
    return data;
  } catch (e) {
    return console.error("Failed to update status");
  }
};

export const updateAccess = async (gameId, checked) => {
  try {
    const data = await axios.patch(`${API_URL}/games/earlyAccess/${gameId}`, { checked }, { withCredentials: true });
    return data;
  } catch (e) {
    return console.error("Failed to update access");
  }
};

export const deleteGame = async (gameId) => {
  try {
    const data = await axios.delete(`${API_URL}/games/${gameId}`, { withCredentials: true });
    return data;
  } catch (e) {
    return console.error("Failed to delete game");
  }
};

export const featureGame = async (gameId) => {
  try {
    const data = await axios.patch(`${API_URL}/games/featured/${gameId}`, {}, { withCredentials: true });
    return data;
  } catch (e) {
    return console.error("Failed to feature game");
  }
};

export const featureGameBanner = async (gameId) => {
  try {
    const data = await axios.patch(`${API_URL}/games/featuredOnBanner/${gameId}`, {}, { withCredentials: true });
    return data;
  } catch (e) {
    return console.error("Failed to feature game");
  }
};
