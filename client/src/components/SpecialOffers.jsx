"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import tippy from "tippy.js";

export default function SpecialOffers({ games }) {
  const saleGames = (games || []).filter((game) => game.onSale > 0);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const tooltipInstances = useRef([]);

  useEffect(() => {
    const elements = document.querySelectorAll(".game-tooltip");

    tooltipInstances.current = Array.from(elements).map((element, index) => {
      const game = saleGames[index];
      return tippy(element, {
        content: `
          <div class="hidden md:flex flex-col w-[280px]">
            <h2 class="font-bold text-lg">${game.title}</h2>
            <h2 class="text-sm">Released: ${new Date(game.releaseDate).toLocaleDateString("en-US")}</h2>
            <div class="w-full h-full py-1">
              <img src=${
                game.image?.thumbnail ? `${API_URL}/${game.image.subImg1}` : "/placeholderImage.png"
              } class="w-full h-full object-cover" />
            </div>
            <div class="flex flex-col justify-between my-1 p-1 text-xs" style="background-color: rgb(35,35,35)"}}>
             <h2>Overall User Reviews:</h2>
             <h2>(${game.reviews.length} reviews)</h2>
            </div>
          </div>
        `,
        trigger: "mouseenter focus",
        allowHTML: true,
        interactive: true,
        theme: "dark",
        delay: [100, 0],
      });
    });

    return () => {
      tooltipInstances.current.forEach((instance) => instance.destroy());
    };
  }, [saleGames]);

  if (saleGames.length === 0) {
    return <h2 className="text-center py-8">No special offers available</h2>;
  }

  return (
    <div className="w-full overflow-x-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {saleGames.map((game) => (
        <a
          key={game._id}
          href={`/games/${game._id}`}
          className="w-full h-full bg-gray-700 game-tooltip hover:bg-gray-600 transition-colors"
        >
          <div className="w-full h-48 relative">
            <img
              src={game.image?.thumbnail ? `${API_URL}/${game.image.thumbnail}` : "/placeholderImage.png"}
              className="w-full h-full object-cover"
              alt={game.title}
            />
            <div className="absolute bottom-0 w-full h-12 bg-[rgb(35,35,35)] flex items-center justify-end px-4">
              <span className="font-bold">{game.onSale}% OFF</span>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
