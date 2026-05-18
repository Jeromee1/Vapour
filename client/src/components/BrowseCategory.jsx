"use client";

import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function BrowseCategory({ games }) {
  const genre = [
    "Action",
    "Adventure",
    "Multiplayer",
    "Indie",
    "Open World",
    "RPG",
    "Sandbox",
    "Simulation",
    "Sports",
    "Strategy",
    "Survival",
    "Horror",
  ];

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [genreImages, setGenreImages] = useState({});

  useEffect(() => {
    const genreMap = {};
    genre.forEach((gen) => {
      const matches = games.filter((g) => g.genre.includes(gen));
      if (matches.length > 0) {
        const rand = matches[Math.floor(Math.random() * matches.length)];
        genreMap[gen] = `${API_URL}/${rand.image.thumbnail}`;
      }
    });
    setGenreImages(genreMap);
  }, [games]);

  const [visibleCount, setVisibleCount] = useState(4);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) setVisibleCount(2);
      else if (window.innerWidth < 1024) setVisibleCount(3);
      else setVisibleCount(4);
      setStartIndex(0);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const next = () => {
    if (startIndex + visibleCount < genre.length) {
      setStartIndex(startIndex + visibleCount);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex(Math.max(0, startIndex - visibleCount));
    }
  };

  const visibleGenres = genre.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="relative w-full flex items-center py-2">
      <button
        onClick={prev}
        disabled={startIndex === 0}
        className={`cursor-pointer bg-gray-700/70 hover:bg-gray-600/70 text-white px-2 rounded-md mx-2 absolute -left-2 z-100 py-4 ${
          startIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <ChevronLeftIcon className="size-6" />
      </button>

      <div className="w-full gap-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 transition-all duration-300">
        {visibleGenres.map((gen) => {
          const imageUrl = genreImages[gen];

          return (
            <a
              key={gen}
              href={`/categories/${gen.trim().replace(/\s+/g, "").toLowerCase()}`}
              className="w-full h-full group"
            >
              <div className="relative aspect-square bg-black rounded-xl overflow-hidden h-full w-full">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    className="w-full h-full object-cover transition-all duration-200 ease-in-out transform group-hover:scale-105"
                  />
                )}
                <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_rgba(0,0,0,0.2),_rgba(0,0,0,0.1),_rgba(0,0,0,0.8))] hover:bg-[radial-gradient(circle_at_top_left,_rgba(0,0,0,0.1),_rgba(0,0,0,0.1),_rgba(0,0,0,0.1),_rgba(0,0,0,0.7))] transition-all duration-500">
                  <h2 className="w-35 absolute bottom-5 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 px-3 py-2 rounded-md text-sm font-bold uppercase !text-gray-300 group-hover:!text-white text-center select-none group-hover:translate-y-1 transition">
                    {gen}
                  </h2>
                </div>
              </div>
            </a>
          );
        })}
      </div>

      <button
        onClick={next}
        disabled={startIndex + visibleCount >= genre.length}
        className={`cursor-pointer bg-gray-700/70 hover:bg-gray-600/70 text-white px-2 rounded-md mx-2 absolute -right-2 z-100 py-4 ${
          startIndex + visibleCount >= genre.length ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <ChevronRightIcon className="size-6" />
      </button>
    </div>
  );
}
