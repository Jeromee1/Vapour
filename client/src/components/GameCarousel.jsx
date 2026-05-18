"use client";

import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function GameCarousel({ games }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const featured = (games || []).filter((game) => game.featured === true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carousel = featured[carouselIndex] || null;

  const getCarouselThumbnail = (carouselItem) => {
    if (!carouselItem?.image?.thumbnail) return "/placeholderImage.png";
    return `${API_URL}/${carouselItem.image.thumbnail}`;
  };

  const [carouselPreview, setCarouselPreview] = useState(() => getCarouselThumbnail(carousel));

  useEffect(() => {
    setCarouselPreview(getCarouselThumbnail(carousel));
  }, [carousel]);

  const handleMouseEnter = (preview) => {
    setCarouselPreview(preview);
  };

  const handleMouseLeave = () => {
    const defaultThumbnail = getCarouselThumbnail(carousel);
    setCarouselPreview(defaultThumbnail);
  };

  if (!featured.length) {
    return (
      <div className="p-4">
        <h2>No featured games</h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-center gap-2">
      <button
        className="hidden md:block rounded-md py-2 h-full transform hover:scale-110 transition duration-200 ease-in-out hover:!bg-gray-700"
        style={{ backgroundColor: "rgb(50, 50, 50)" }}
        onClick={() => setCarouselIndex((prev) => Math.max(prev - 1, 0))}
      >
        <ChevronLeftIcon height={40} width={40} />
      </button>
      <a href={`/games/${carousel._id}`} key={carousel._id} className="w-full">
        <div className="py-4 flex flex-col md:flex-row h-[550px] md:h-[400px]">
          <div className="relative w-full md:w-[70%] h-[400px] md:h-full bg-gray-600 overflow-hidden">
            <img
              src={carouselPreview}
              alt={`${carousel.title || "Game"} thumbnail`}
              className="absolute h-full w-full object-cover"
              style={{ maxHeight: "100%" }}
            />
          </div>
          <div className="w-full md:w-[30%] flex flex-col p-2" style={{ backgroundColor: "rgb(35, 35, 35)" }}>
            <h2 className="text-3xl !text-white line-clamp-1">{carousel.title}</h2>
            <div className="flex flex-col py-4">
              <div className="flex justify-center h-[80px] sm:h-[60px]">
                <img
                  src={carousel.image?.subImg1 ? `${API_URL}/${carousel.image.subImg1}` : "/placeholderImage.png"}
                  alt="Sub Image 1"
                  className="object-cover w-[48%] h-full pr-1 pb-1"
                  onMouseEnter={() =>
                    handleMouseEnter(
                      carousel.image?.subImg1 ? `${API_URL}/${carousel.image.subImg1}` : "/placeholderImage.png"
                    )
                  }
                  onMouseLeave={handleMouseLeave}
                />
                <img
                  src={carousel.image?.subImg2 ? `${API_URL}/${carousel.image.subImg2}` : "/placeholderImage.png"}
                  alt="Sub Image 2"
                  className="object-cover w-[48%] h-full pl-1 pb-1"
                  onMouseEnter={() =>
                    handleMouseEnter(
                      carousel.image?.subImg2 ? `${API_URL}/${carousel.image.subImg2}` : "/placeholderImage.png"
                    )
                  }
                  onMouseLeave={handleMouseLeave}
                />
              </div>
              <div className="flex justify-center h-[80px] sm:h-[60px]">
                <img
                  src={carousel.image?.subImg3 ? `${API_URL}/${carousel.image.subImg3}` : "/placeholderImage.png"}
                  alt="Sub Image 3"
                  className="object-cover w-[48%] h-full pr-1 pt-1"
                  onMouseEnter={() =>
                    handleMouseEnter(
                      carousel.image?.subImg3 ? `${API_URL}/${carousel.image.subImg3}` : "/placeholderImage.png"
                    )
                  }
                  onMouseLeave={handleMouseLeave}
                />
                <img
                  src={carousel.image?.subImg4 ? `${API_URL}/${carousel.image.subImg4}` : "/placeholderImage.png"}
                  alt="Sub Image 4"
                  className="object-cover w-[48%] h-full pl-1 pt-1"
                  onMouseEnter={() =>
                    handleMouseEnter(
                      carousel.image?.subImg4 ? `${API_URL}/${carousel.image.subImg4}` : "/placeholderImage.png"
                    )
                  }
                  onMouseLeave={handleMouseLeave}
                />
              </div>
            </div>
            <h2 className="text-2xl">{carousel.isActive ? "Now Available" : "Coming Soon"}</h2>
            <div className="flex justify-between mt-auto h-[60px] overflow-y-hidden">
              <div className="hidden md:flex mt-auto gap-1 flex-wrap overflow-y-hidden w-50">
                {carousel.genre?.map((genre) => (
                  <h2
                    href={`/categories/${genre.toLowerCase()}`}
                    key={genre}
                    className="rounded-sm p-1 bg-gray-600 text-xs"
                  >
                    {genre}
                  </h2>
                ))}
              </div>
              <h2 className="sm:w-50 text-center my-auto">
                {carousel.price != 0 ? `RM ${carousel.price.toFixed(2)}` : "Free"}
              </h2>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-2">
          {featured.map((whiteThing, i) => (
            <div
              key={i}
              className={carouselIndex === i ? "bg-gray-300" : "bg-gray-600"}
              style={{ height: "5px", width: "20px" }}
            ></div>
          ))}
        </div>
      </a>
      <div className="flex md:hidden justify-around w-full">
        <button
          className="flex justify-center items-center rounded-md py-2 w-[60px] h-[50px] transform hover:scale-110 transition duration-200 ease-in-out hover:!bg-purple-800"
          style={{ backgroundColor: "rgb(50, 0, 100)" }}
          onClick={() => setCarouselIndex((prev) => Math.max(prev - 1, 0))}
        >
          <ChevronLeftIcon height={30} width={40} />
        </button>
        <button
          className="flex justify-center items-center rounded-md py-2 w-[60px] h-[50px] transform hover:scale-110 transition duration-200 ease-in-out hover:!bg-purple-800"
          style={{ backgroundColor: "rgb(50, 0, 100)" }}
          onClick={() => setCarouselIndex((prev) => Math.min(prev + 1, featured.length - 1))}
        >
          <ChevronRightIcon height={30} width={40} />
        </button>
      </div>
      <button
        className="hidden md:block rounded-md py-2 h-full transform hover:scale-110 transition duration-200 ease-in-out hover:!bg-gray-700"
        style={{ backgroundColor: "rgb(50, 50, 50)" }}
        onClick={() => setCarouselIndex((prev) => Math.min(prev + 1, featured.length - 1))}
      >
        <ChevronRightIcon height={40} width={40} />
      </button>
    </div>
  );
}
