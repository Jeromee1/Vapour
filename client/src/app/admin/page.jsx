"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { fetchAllGames } from "@/api/gamesApi";
import { featureGame, featureGameBanner } from "@/api/gamesApi";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import Spinner from "@/components/Spinner";

export default function Admin() {
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    if (user.role < 2) {
      router.push("/");
    }
  }, [user, router]);

  const [games, setGames] = useState([]);
  const [search, setSearch] = useState("");
  const [showBanner, setShowBanner] = useState([]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredGames = games.filter((game) => game.title.toLowerCase().includes(search.toLowerCase()));

  const fetchGames = async () => {
    if (user) {
      const data = await fetchAllGames();
      if (data) {
        setGames(data);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    setShowBanner(games.filter((game) => game.featuredOnBanner));
  }, [games]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleBannerClick = (e, gameId) => {
    e.preventDefault();

    const element = document.getElementById(gameId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });

      element.classList.add("pulse");

      setTimeout(() => {
        element.classList.remove("pulse");
      }, 1000);
    }
  };

  const handleFeature = async (gameId) => {
    const result = await Swal.fire({
      text: "Are you sure you want to update feature status?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "gray",
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "!border-t-2 !border-b-2 !border-purple-500 !bg-gray-900/80 !h-40 !text-white",
      },
    });

    if (result.isConfirmed) {
      try {
        await featureGame(gameId);
        toast("Feature status updated", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
        });
      } catch (error) {
        toast("Error featuring game", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
          type: "error",
        });
      }
    }
  };

  const handleFeatureBanner = async (gameId) => {
    const result = await Swal.fire({
      text: "Are you sure you want to update the banner?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "gray",
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "!border-t-2 !border-b-2 !border-purple-500 !bg-gray-900/80 !h-40 !text-white",
      },
    });

    if (result.isConfirmed) {
      try {
        await featureGameBanner(gameId);
        await fetchGames();
        toast("Featuring Game", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
        });
      } catch (error) {
        toast("Error featuring game on banner", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
          type: "error",
        });
      }
    }
  };

  if (loading || !games) {
    return <Spinner />;
  }

  return (
    <>
      <div className="p-10">
        <h2 className="text-3xl mb-4">Admin</h2>
        <div className="flex flex-col gap-2 p-6" style={{ backgroundColor: "rgb(10,0,50)" }}>
          <div className="w-full h-100 bg-gray-800 mb-4 relative group">
            <img
              src={
                showBanner[0]?.image?.banner &&
                showBanner[0].image.banner !== "" &&
                `${API_URL}/${showBanner[0].image.banner}`
              }
              className="h-full w-full object-cover"
            />
            <a
              href={`#${showBanner[0]?._id}`}
              onClick={(e) => handleBannerClick(e, showBanner[0]?._id)}
              className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 flex justify-center items-center w-full h-full bg-black/75 transition-all duration-500 ease-in-out"
            >
              <h2 className="text-3xl font-bold">Current Banner</h2>
            </a>
          </div>
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Search"
            className="h-10 w-full md:w-80 p-2 bg-gray-800 border-2 border-gray-700 rounded-md col-12"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-6">
            {filteredGames?.map((game) => (
              <div
                key={game._id}
                id={`${game._id}`}
                className="relative bg-gray-700 p-1 rounded-md text-white flex flex-col h-full group overflow-hidden transition-all duration-300 ease-in-ou"
              >
                <div className="relative h-45 w-full">
                  <img
                    src={game.image?.thumbnail ? `${API_URL}/${game.image.thumbnail}` : "/placeholderImage.png"}
                    className="w-full h-full object-cover"
                  />

                  <div className="gap-2 absolute bottom-0 left-0 w-full h-0 group-hover:h-full bg-black/75 overflow-hidden flex flex-col items-center justify-center transition-all duration-300 ease-in-out">
                    <a
                      href={`/games/${game._id}`}
                      className="hover:underline text-white text-xl font-semibold px-2 text-center"
                    >
                      {game.title}
                    </a>
                    {showBanner[0]?._id === game._id ? (
                      <button
                        onClick={() => handleFeatureBanner(game._id)}
                        className="bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md"
                      >
                        Remove Banner
                      </button>
                    ) : (
                      <button
                        onClick={() => handleFeatureBanner(game._id)}
                        className="bg-purple-700 hover:bg-purple-600 px-2 py-1 rounded-md"
                      >
                        Set Banner
                      </button>
                    )}

                    <button
                      onClick={() => handleFeature(game._id)}
                      className="bg-purple-700 hover:bg-purple-600 px-2 py-1 rounded-md"
                    >
                      Set Featured
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
