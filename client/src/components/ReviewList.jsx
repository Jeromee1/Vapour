"use client";

import { useState, useEffect } from "react";
import { getReviews } from "@/api/reviewsAPi";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/solid";
import { getMyUser } from "@/api/usersApi";
import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";
import tippy from "tippy.js";
import AddReviewForm from "@/components/forms/AddReviewForm";
import { deleteReview } from "@/api/reviewsAPi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function ReviewList({ game }) {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);

  const fetchUser = async () => {
    try {
      const data = await getMyUser();
      setUser(data || null);
    } catch (err) {
      setUser(null);
      console.warn("User not logged in or error fetching user:", err);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const data = await getReviews(game._id);
      setReviews(data || []);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setReviews([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
    fetchUser();
  }, []);

  useEffect(() => {
    tippy("#developerIcon", {
      content: "Developer",
    });
  }, []);

  const handleDelete = async (revId) => {
    if (!user) return;

    const result = await Swal.fire({
      text: "Are you sure you want to delete your review?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "gray",
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "!border-t-2 !border-b-2 !border-purple-500 !bg-gray-900/80 !h-40 !text-white",
      },
    });

    if (result.isConfirmed) {
      const result2 = await Swal.fire({
        text: "Are you sure you sure?",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonColor: "rgb(150,0,0)",
        cancelButtonColor: "gray",
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        customClass: {
          popup: "!border-t-2 !border-b-2 !border-purple-500 !bg-gray-900/80 !h-40 !text-white",
        },
      });

      if (result2.isConfirmed) {
        try {
          await deleteReview(revId);
          toast("Review deleted", {
            theme: "dark",
            position: "bottom-right",
            autoClose: 500,
          });
          window.location.reload();
        } catch (e) {
          toast("Failed to delete review :(", {
            type: "error",
            theme: "dark",
            position: "bottom-right",
            autoClose: 1000,
          });
        }
      }
    }
  };

  const summary = reviews.reduce(
    (acc, review) => {
      if (review.recommended === true) {
        acc.positive++;
      } else {
        acc.negative++;
      }
      return acc;
    },
    { positive: 0, negative: 0 }
  );

  let overall = "";
  const total = summary.positive + summary.negative;
  const positiveRatio = total > 0 ? summary.positive / total : 0;

  if (positiveRatio >= 0.7) {
    overall = "Positive";
  } else if (positiveRatio <= 0.3) {
    overall = "Negative";
  } else {
    overall = "Mixed";
  }

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (loading) {
    return <h2>Loading Reviews...</h2>;
  }

  return (
    <div className="flex flex-col gap-2 mb-2">
      <AddReviewForm game={game} user={user} fetchReviews={fetchReviews} />
      <div className="flex flex-col-reverse md:flex-row w-full gap-2">
        <div className="flex flex-col gap-2 w-full md:w-[65%]">
          {reviews.map((review) => (
            <div key={review._id} className="p-2 flex" style={{ backgroundColor: "rgb(10, 0, 50)" }}>
              <div className="flex flex-col justify-between w-[35%]">
                <div className="flex flex-col sm:flex-row w-full">
                  <div className="h-10 w-10 border-1 border-gray-400 mr-2">
                    <img
                      src={review.user?.pfp ? `${API_URL}/${review.user.pfp}` : "/Placeholder.jpg"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <a
                    href={`/users/${review.user?._id}`}
                    className="!text-gray-300 hover:underline hover:!text-gray-200 flex"
                  >
                    {review.user?.username || "Unknown User"}
                    {review.user?._id === game.developer._id && (
                      <WrenchScrewdriverIcon className="size-4 m-1" fill="gray" id="developerIcon" />
                    )}
                  </a>
                </div>
                {user && review.user?._id === user._id ? (
                  <div className="flex flex-col gap-2 w-15">
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="bg-gray-700 rounded-xs px-2 py-1 text-xs w-full hover:bg-gray-600"
                    >
                      Delete
                    </button>
                  </div>
                ) : null}
              </div>
              <div className="w-[65%] pb-5">
                <div className="flex items-center">
                  {review.recommended ? (
                    <>
                      <div className="h-10 w-10">
                        <HandThumbUpIcon className="bg-[#19425D] w-full h-full" fill="#61B5E7" />
                      </div>
                      <div className="p-2 w-full" style={{ backgroundColor: "#121A24" }}>
                        <h2 className="!text-gray-300">Recommended</h2>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="h-10 w-10">
                        <HandThumbDownIcon className="bg-[#512026] w-full h-full" fill="#E16263" />
                      </div>
                      <div className="p-2 w-full" style={{ backgroundColor: "#121A24" }}>
                        <h2 className="!text-gray-300">Not Recommended</h2>
                      </div>
                    </>
                  )}
                </div>
                <h2 className="!text-gray-500 text-xs py-2 uppercase">
                  Posted{" "}
                  {review.created_at
                    ? new Date(review.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric" })
                    : "Unknown date"}
                </h2>
                <p className="text-xs !text-gray-400 break-words">{review.message || ""}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full md:w-[35%] h-full p-2" style={{ backgroundColor: "rgb(10, 0, 50)" }}>
          <div className="flex flex-col bg-gradient-to-r from-[rgb(50,0,120)] to-[rgb(80,0,180)] p-2">
            <h2>Overall Reviews</h2>
            <div className="flex">
              {reviews.length < 1 ? (
                <h2 className="text-sm">No reviews yet.</h2>
              ) : (
                <>
                  {overall === "Positive" ? (
                    <div className="!text-[#009e2f] font-bold">{overall}</div>
                  ) : overall === "Mixed" ? (
                    <div className="!text-[#A8926A] font-bold">{overall}</div>
                  ) : overall === "Negative" ? (
                    <div className="!text-[#512026] font-bold">{overall}</div>
                  ) : null}
                  <h2 className="ml-2 !text-gray-400 flex items-center text-xs">({reviews.length} reviews)</h2>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
