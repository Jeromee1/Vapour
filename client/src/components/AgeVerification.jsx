"use client";

import { useState, useEffect } from "react";
import { getMyUser } from "@/api/usersApi";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

export default function AgeVerification({ game }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [birthDay, setBirthDay] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [verified, setVerified] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await getMyUser();
      if (data) {
        setUser(data);
      }
    } catch (e) {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (game?.age === 5) {
      fetchUser();
    }
  }, [game]);

  const showPopup = game?.age === 5 && !verified;

  useEffect(() => {
    window.scrollTo(0, 0);

    const shouldShow = game?.age === 5 && !verified;

    if (shouldShow) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [game, verified]);

  useEffect(() => {
    if (game?.age === 5 && user?.age >= 18) {
      setVerified(true);
    }
  }, [user, game]);

  const verifyVerify = () => {
    if (!birthDay || !birthMonth || !birthYear)
      return toast("Please select age", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 1000,
        type: "error",
      });

    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age >= 18) {
      setVerified(true);
      document.body.style.overflow = "";
    } else {
      setShowWarning(true);
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className={`h-[90vh] w-[100vw] justify-center items-center ${showPopup ? "flex" : "hidden"}`}>
      <div className="relative flex flex-col justify-center items-center w-200 h-100 rounded-md gap-2 border border-gray-500">
        <div className="w-60 h-30 sm:w-70 sm:h-40 absolute -top-5 sm:-top-12 rounded-md overflow-hidden shadow-lg">
          <img
            src={game?.image.thumbnail ? `${API_URL}/${game.image.thumbnail}` : "/placeholderImage.png"}
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="!text-white text-center text-sm uppercase sm:w-130 mt-20 mb-4">
          This game may contain content not appropriate for all ages, or may not be appropriate for viewing at work.
        </h2>
        <div
          className="flex flex-col py-4 gap-2 rounded-lg px-4 sm:px-[20%]"
          style={{ backgroundColor: "rgb(10,0,50)" }}
        >
          <h2 className="!text-gray-300 text-xs text-center">Please enter your birth date to continue:</h2>
          <div className="flex gap-1">
            <select
              value={birthDay}
              onChange={(e) => setBirthDay(e.target.value)}
              className="px-2 py-1 rounded-xs bg-purple-950 text-sm"
            >
              <option value="" disabled>
                Day
              </option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>

            <select
              value={birthMonth}
              onChange={(e) => setBirthMonth(e.target.value)}
              className="px-2 py-1 rounded-xs bg-purple-950 text-sm"
            >
              <option value="" disabled>
                Month
              </option>
              {[
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ].map((month, index) => (
                <option key={index + 1} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>

            <select
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              className="px-2 py-1 rounded-xs bg-purple-950 text-sm"
            >
              <option value="" disabled>
                Year
              </option>
              {Array.from({ length: 124 }, (_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          {showWarning && (
            <h2 className="!text-red-800 text-xs text-center w-full">You must be 18 or older to view this page.</h2>
          )}
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={verifyVerify} className="w-25 py-1 bg-purple-900 hover:bg-purple-800 rounded-sm">
            View Page
          </button>
          <a href="/" className="w-25 py-1 bg-purple-900 hover:bg-purple-800 rounded-sm text-center">
            Cancel
          </a>
        </div>
      </div>
    </div>
  );
}
