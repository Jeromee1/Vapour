"use client";

import { useEffect, useState } from "react";

export default function WishlistList({ wishlist }) {
  const [games, setGames] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const validItems = wishlist?.filter((item) => item?.game != null) || [];
    setGames(validItems);
  }, [wishlist]);

  if (!wishlist || wishlist.length === 0) return <h2>No wishlist found.</h2>;
  if (games.length === 0) return <h2>No games in wishlist.</h2>;

  return (
    <div className="flex flex-col gap-y-2">
      {games.map((item) => (
        <a
          href={`/games/${item.game._id}`}
          key={item.game._id}
          className="flex p-2 h-[150px] border-1 border-gray-500 bg-gray-600/70 rounded-sm"
        >
          <div className="h-full w-[250px] hidden lg:block">
            <img
              src={item.game?.image?.thumbnail ? `${API_URL}/${item.game.image.thumbnail}` : "/Placeholder.jpg"}
              className="h-full w-full object-cover"
              alt={item.game?.title || "Game image"}
            />
          </div>
          <div className="w-full flex">
            <div className="flex flex-col justify-between w-[70%] px-2 md:px-4">
              <h2 className="text-2xl line-clamp-2">{item.game?.title || "Unknown Title"}</h2>
              <div className="hidden sm:flex gap-1">
                {item.game?.genre?.map((gen) => (
                  <div key={gen} className="px-2 py-1 rounded-sm border-1 border-gray-500 text-xs">
                    {gen}
                  </div>
                ))}
              </div>
              <div className="flex sm:hidden">
                {item.game?.onSale != 0 ? (
                  <>
                    <div className="w-15 h-10 bg-green-800 flex justify-center items-center font-bold !text-green-300">
                      -{item.game.onSale}%
                    </div>
                    <div className="w-30 h-10 bg-gray-800 flex flex-col justify-center items-center text-xs">
                      <span className="line-through !text-gray-400">RM {item.game.price}</span>
                      RM {(item.game.price * (1 - item.game.onSale / 100)).toFixed(2)}
                    </div>
                  </>
                ) : (
                  <div className="w-30 h-10 bg-gray-800 flex justify-center items-center">
                    RM {item.game?.price || "N/A"}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between w-[30%]">
              <div className="hidden sm:flex h-full items-center">
                {item.game?.onSale != 0 ? (
                  <>
                    <div className="w-15 h-10 bg-green-800 flex justify-center items-center font-bold !text-green-300">
                      -{item.game.onSale}%
                    </div>
                    <div className="w-30 h-10 bg-gray-800 flex flex-col justify-center items-center text-xs">
                      <span className="line-through !text-gray-400">RM {item.game.price}</span>
                      RM {(item.game.price * (1 - item.game.onSale / 100)).toFixed(2)}
                    </div>
                  </>
                ) : (
                  <div className="w-30 h-10 bg-gray-800 flex justify-center items-center">
                    RM {item.game?.price || "N/A"}
                  </div>
                )}
              </div>
              <p>Wishlist since: {new Date(item.wishlistSince).toLocaleDateString()}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
