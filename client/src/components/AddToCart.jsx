"use client";

import { useState, useEffect } from "react";
import { pushToCart } from "@/api/cartApi";
import { fetchCart } from "@/api/cartApi";
import { toast } from "react-toastify";
import { getMyUser } from "@/api/usersApi";

export default function AddToCart({ game }) {
  const [cart, setCart] = useState();
  const [user, setUser] = useState();
  const [isInCart, setIsInCart] = useState(false);

  const fetchData = async () => {
    try {
      const userData = await getMyUser();
      setUser(userData);

      const cartData = await fetchCart();
      setCart(cartData);
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
        setCart(null);
        console.warn("User not logged in.");
      } else {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (cart) {
      const cartCheck = cart?.items?.some((item) => item.game && item.game._id === game._id);
      setIsInCart(cartCheck);
    }
  }, [cart, game]);

  if (!user) {
    return null;
  }

  const isOwned = user?.ownedGames?.some((ownedGames) => ownedGames.includes(game._id));

  const handleClick = async () => {
    try {
      const result = await pushToCart(game._id);
      if (result.success) {
        await fetchData();
        toast.success("Game added to Cart", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
        });
      } else {
        toast.error(result.msg || "Something went wrong", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
        });
      }
    } catch (e) {
      console.error("Catch block error:", e);
      toast.error("Something went wrong", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 1000,
      });
    }
  };

  if (!game.isActive)
    return (
      <button
        onClick={() =>
          toast.error("Game is not for sale right now", {
            theme: "dark",
            position: "bottom-right",
            autoClose: 1000,
          })
        }
        className="w-24 h-8 text-xs bg-gray-600 p-1 m-1 rounded-xs"
      >
        Add To Cart
      </button>
    );

  if (isInCart)
    return (
      <button
        onClick={() =>
          toast.error("Game is already in cart", {
            theme: "dark",
            position: "bottom-right",
            autoClose: 1000,
          })
        }
        className="w-24 h-8 text-xs bg-gray-600 p-1 m-1 rounded-xs"
      >
        Add To Cart
      </button>
    );

  if (isOwned)
    return (
      <button
        onClick={() =>
          toast.error("You already own this game", {
            theme: "dark",
            position: "bottom-right",
            autoClose: 1000,
          })
        }
        className="w-24 h-8 text-xs bg-gray-600 p-1 m-1 rounded-xs"
      >
        Add To Cart
      </button>
    );

  return (
    <button
      onClick={handleClick}
      className="w-24 h-8 text-xs bg-gradient-to-l from-[rgb(0,130,15)] to-[rgb(0,161,32)] p-1 m-1 rounded-xs"
    >
      Add To Cart
    </button>
  );
}
