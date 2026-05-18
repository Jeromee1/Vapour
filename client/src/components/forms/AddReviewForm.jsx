"use client";

import { useState } from "react";
import { addReview } from "@/api/reviewsAPi";
import { toast } from "react-toastify";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";

export default function AddReviewForm({ game, user, fetchReviews }) {
  const isOwned = user?.ownedGames.includes(game._id);
  const hasReviewed = user?.reviews?.some((review) => review.game === game._id);

  if (!isOwned || hasReviewed) {
    return null;
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [recommend, setRecommend] = useState(null);
  const [comment, setComment] = useState("");

  const handleChange = (e) => {
    setComment(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addReview(game._id, {
        recommended: recommend,
        message: comment,
      });

      window.location.reload();

      if (recommend === null) {
        toast("No", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
          type: "error",
        });
      }

      toast("Review added", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 500,
      });
    } catch (e) {
      toast("Could not add review", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 1000,
        type: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 w-full" style={{ backgroundColor: "rgb(10,0,50)" }}>
      <h2>Write a review for {game.title}</h2>
      <p className="!text-gray-400 text-xs">
        Please describe what you liked or disliked about this game and whether you recommend it to others.
      </p>
      <div className="flex flex-col w-full p-5">
        <div className="flex flex-col items-center sm:items-start sm:flex-row gap-8">
          <div className="w-25 h-25 border-1 border-blue-400 flex-shrink-0">
            <img
              src={user?.pfp ? `${API_URL}/${user.pfp}` : "/Placeholder.jpg"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col w-full">
            <textarea type="text" name="message" onChange={handleChange} className="w-full h-40 bg-gray-800 p-2" />

            <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row justify-between w-full pt-6 sm:p-6 pb-0">
              <div className="flex flex-col gap-1">
                <h2 className="!text-gray-400 text-xs">Do you recommend this game?</h2>
                <div className="flex gap-2 justify-center sm:px-2">
                  <button
                    type="button"
                    onClick={() => setRecommend(true)}
                    className={`flex gap-2 py-1 px-2 w-full hover:!bg-purple-700 rounded-xs ${
                      recommend === true && "!bg-purple-700"
                    }`}
                    style={{ backgroundColor: "rgb(50,0,150)", color: "rgb(160,120,250)" }}
                  >
                    <HandThumbUpIcon className="size-6" fill="rgb(160,120,250)" />
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommend(false)}
                    className={`flex gap-2 py-1 px-2 w-full hover:!bg-purple-700 rounded-xs ${
                      recommend === false && "!bg-purple-700"
                    }`}
                    style={{ backgroundColor: "rgb(50,0,150)", color: "rgb(160,120,250)" }}
                  >
                    <HandThumbDownIcon className="size-6" fill="rgb(160,120,250)" />
                    No
                  </button>
                </div>
              </div>

              {recommend === null ? (
                <button
                  type="button"
                  onClick={() =>
                    toast("Please select one", {
                      theme: "dark",
                      position: "bottom-right",
                      autoClose: 1000,
                      type: "error",
                    })
                  }
                  className="my-2 bg-gradient-to-t from-[rgb(50,50,50)] to-[rgb(100,100,100)] px-4 py-2 border-2 border-purple-950 rounded-md"
                >
                  Post Review
                </button>
              ) : (
                <button
                  type="submit"
                  className="my-2 bg-gradient-to-t from-[rgb(60,0,150)] to-[rgb(100,0,220)] px-4 py-2 border-2 border-purple-950 rounded-md hover:from-[rgb(80,0,200)] hover:to-[rgb(140,0,250)]"
                >
                  Post Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
