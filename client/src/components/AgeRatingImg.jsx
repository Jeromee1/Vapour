"use client";

import { useState, useEffect } from "react";

export default function AgeRatingImg({ game }) {
  const ageRatingImg = {
    0: "/ratingRP.jpeg", // RP
    1: "/ratingE.jpeg", // E
    2: "/ratingE10.jpeg", // E10+
    3: "/ratingT.jpeg", // T
    4: "/ratingM.png", // M
    5: "/ratingAO.png", // AO
  };

  const [ageRating, setAgeRating] = useState(ageRatingImg[0]);

  useEffect(() => {
    const ratingImage = ageRatingImg[game.age] || ageRatingImg[0];
    setAgeRating(ratingImage);
  }, [game.age]);

  return (
    <div className="h-[100px] w-[65px]">
      <img src={ageRating} alt={`Age rating: ${game.age}`} className="h-full w-full object-cover" />
    </div>
  );
}
