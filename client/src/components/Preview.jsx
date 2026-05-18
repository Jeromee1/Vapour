"use client";

import { useState } from "react";
import { PlayIcon } from "@heroicons/react/24/solid";
import FavoriteButton from "./FavoriteButton";

export default function Preview({ game }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const previews = [game.image?.subImg1, game.image?.subImg2, game.image?.subImg3, game.image?.subImg4]
    .filter(Boolean)
    .map((preview) => `${API_URL}/${preview}`);

  const [showing, setShowing] = useState(game.video ? game.video : previews[0] || "/placeholderImage.png");

  function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  function getYouTubeThumbnail(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    const videoId = match && match[2].length === 11 ? match[2] : null;

    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    return;
  }

  return (
    <>
      <div className="h-[45vh] w-full relative bg-gray-600">
        {showing.includes("youtube.com") || showing.includes("youtu.be") ? (
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeId(
              showing
            )}?autoplay=1&mute=1&rel=0&modestbranding=1&controls=1&disablekb=1&fs=0&iv_load_policy=3&playsinline=1`}
            className="absolute h-full w-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen={false}
            title="Game trailer"
          />
        ) : (
          <img
            src={showing}
            className="absolute h-full w-full object-cover"
            alt="Game preview"
            onError={(e) => {
              e.target.src = "/placeholderImage.png";
            }}
          />
        )}
      </div>
      <div
        className="overflow-x-auto h-[100px] flex items-center p-3 gap-3"
        style={{ backgroundColor: "rgb(10, 0, 50)" }}
      >
        {game.video ? (
          <img
            src={getYouTubeThumbnail(game.video)}
            alt="YouTube video thumbnail"
            className=" max-h-full object-contain pb-2 hover:scale-105 transition-all duration-200 ease-in-out hover:shadow-[0_4px_8px_rgba(255,255,255,0.3)] cursor-pointer"
            onClick={() => setShowing(game.video)}
          />
        ) : null}
        {previews.length > 0 ? (
          previews.map((preview, i) => (
            <img
              src={preview}
              key={i}
              alt={`Preview ${i + 1}`}
              className="max-h-full object-contain pb-2 hover:scale-105 transition-all duration-200 ease-in-out hover:shadow-[0_4px_8px_rgba(255,255,255,0.3)] cursor-pointer"
              onClick={() => setShowing(preview)}
            />
          ))
        ) : (
          <h2 className="text-center w-full text-gray-500">No Previews Available</h2>
        )}
      </div>
    </>
  );
}
