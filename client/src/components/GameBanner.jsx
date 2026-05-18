"use client";

import { useEffect } from "react";

export default function GameBanner({ games = [] }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const banner = games.find((game) => game?.featuredOnBanner === true);

  const purple = ["rgb(10, 0, 20)", "rgb(50, 0, 120)", "rgb(10, 0, 10)"];
  const red = ["rgb(20, 0, 0)", "rgb(100, 0, 0)", "rgb(20, 0, 0)"];
  const green = ["rgb(0, 20, 0)", "rgb(0, 80, 0)", "rgb(0, 20, 0)"];
  const blue = ["rgb(0, 20, 30)", "rgb(0, 30, 80)", "rgb(0, 20, 30)"];
  const orange = ["rgb(10, 5, 0)", "rgb(120, 70, 0)", "rgb(10, 5, 0)"];
  const light = ["rgb(80, 80, 80)", "rgb(150, 150, 150)", "rgb(80, 80, 80)"];
  const dark = ["rgb(0, 0, 0)", "rgb(50, 50, 50)", "rgb(0, 0, 0)"];

  const themes = [purple, red, green, blue, orange, light, dark];

  useEffect(() => {
    if (banner?.theme) {
      const root = document.documentElement;
      root.style.setProperty("--color1", themes[banner.theme][0]);
      root.style.setProperty("--color2", themes[banner.theme][1]);
      root.style.setProperty("--color3", themes[banner.theme][2]);

      return () => {
        root.style.removeProperty("--color1");
        root.style.removeProperty("--color2");
        root.style.removeProperty("--color3");
      };
    }
  }, [banner]);

  if (!banner) {
    return null;
  }

  const bannerImg = banner?.image?.banner;
  const imgSrc = bannerImg ? `${API_URL}/${bannerImg}` : "/BannerPlaceholder.jpg";

  return (
    <div className={`banner relative bg-gray-500 w-[100vw] h-100 p-0 border-b-4 border-black`}>
      <a href={`/games/${banner._id}`} className="banner_overlay absolute z-1 h-full"></a>
      <img src={imgSrc} alt={banner.title || "Game banner"} className="w-full h-full object-cover" />
    </div>
  );
}
