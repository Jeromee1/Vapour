"use client";

import { useState, useEffect } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import DevelopedGames from "@/components/DevelopedGames";
import { fetchDevelopedGames } from "@/api/usersApi";
import { fetchAllGames } from "@/api/gamesApi";
import { ToastContainer } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";

export default function Developer() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (user.role < 1) {
      router.push("/");
    }
  }, [user, router]);

  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (user) {
      try {
        setLoading(true);
        const userData = await fetchDevelopedGames();
        setGames(userData?.developedGames || []);
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load games");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="p-10 mx-20">
        <h2 className="text-3xl mb-6">Developer Dashboard</h2>
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div
              className="p-6 hidden lg:flex flex-col rounded-sm w-full"
              style={{ backgroundColor: "rgb(10, 0, 50)" }}
            >
              <a
                href="/developer/addGame"
                className="flex items-center ml-auto bg-purple-800 hover:bg-purple-700 rounded-md mb-2 py-2 px-4"
              >
                <PlusIcon className="w-5 h-5" />
                Add Game
              </a>
              <DevelopedGames games={games} fetchData={fetchData} />
            </div>
            <h2 className="block lg:hidden">
              Please use a{" "}
              <a href="https://en.wikipedia.org/wiki/Desktop_computer" className="!text-blue-400 hover:underline">
                Desktop
              </a>{" "}
              to access this feature.
            </h2>
          </>
        )}
      </div>
      <ToastContainer />
    </>
  );
}
