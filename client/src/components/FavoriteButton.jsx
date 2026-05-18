"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateFavorites } from "@/api/favoriteApi";

export default function FavoriteButton({ game }) {
  const { user, loading } = useAuth();
  const [isFav, setIsFav] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && user && game?.favorites) {
      const userFavorite = game.favorites.some((fav) => fav.user === user._id || fav.user?._id === user._id);
      setIsFav(userFavorite);
    } else {
      setIsFav(false);
    }
  }, [user, loading, game?.favorites]);

  useEffect(() => {
    tippy("#favoriteIcon", {
      content: "Favorite",
      placement: "right",
    });
  });

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || isUpdating) return;

    const wasFav = isFav;
    setIsFav(!wasFav);
    setIsUpdating(true);

    try {
      await updateFavorites(game._id);
      if (wasFav) {
        toast("Removed from Favorites", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 2000,
        });
      } else {
        toast("Added to Favorites", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast("Failed to Favorite");
      setIsFav(wasFav);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    user && (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        onClick={handleClick}
        id="favoriteIcon"
        className={`size-6 cursor-pointer transition-colors duration-200 ${isFav ? "fill-red-500" : "fill-gray-500"} ${
          isUpdating ? "opacity-70" : ""
        }`}
      >
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
      </svg>
    )
  );
}
