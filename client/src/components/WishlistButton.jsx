"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateWishlist } from "@/api/wishlistApi";
import { BookmarkIcon, BookmarkSlashIcon } from "@heroicons/react/24/solid";

export default function WishlistButton({ game }) {
  const { user, loading } = useAuth();
  const [isWish, setIsWish] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!loading && user && game?.wishlist) {
      const userWishlist = game.wishlist.some((wish) => wish.user === user._id || wish.user?._id === user._id);
      setIsWish(userWishlist);
    } else {
      setIsWish(false);
    }
  }, [user, loading, game?.wishlist]);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading || isUpdating) return;

    const wasWish = isWish;
    setIsWish(!wasWish);
    setIsUpdating(true);

    try {
      await updateWishlist(game._id);
      if (wasWish) {
        toast("Removed from Wishlist", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 2000,
        });
      } else {
        toast("Added to Wishlist", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 2000,
        });
      }
    } catch (error) {
      toast("Failed to Wishlist");
      setIsWish(wasWish);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    user && (
      <div className="w-full flex justify-end items-center">
        <button
          className={`${
            !isWish ? "bg-purple-800" : "bg-gray-600"
          } px-2 py-2 rounded-md transition duration-200 ease-in-out h-[40px]`}
          onClick={handleClick}
        >
          {!isWish ? (
            <>
              <h2 className="hidden sm:block">Add to Wishlist</h2>
              <BookmarkIcon className="size-6 block sm:hidden" />
            </>
          ) : (
            <>
              <h2 className="hidden sm:block">Remove to Wishlist</h2>
              <BookmarkIcon className="size-6 block sm:hidden" />
            </>
          )}
        </button>
      </div>
    )
  );
}
