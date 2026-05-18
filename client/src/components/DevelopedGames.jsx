import { useState, useEffect, useRef } from "react";
import EditGameForm from "./forms/EditGameForm";
import tippy from "tippy.js";
import { WrenchIcon } from "@heroicons/react/24/solid";
import { deleteGame } from "@/api/gamesApi";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function DevelopedGames({ games, fetchData }) {
  const [editModal, setEditModal] = useState(false);
  const [description, setDescription] = useState("");
  const [game, setGame] = useState();
  const tooltipRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!tooltipRef.current) {
      tooltipRef.current = tippy("#description", {
        content: description || "Hover to see description",
        placement: "right",
      })[0];
    } else {
      tooltipRef.current.setContent(description || "Hover to see description");
    }
  }, [description]);

  if (games?.length < 1) return <h2>You have not developed any games.</h2>;

  const handleDelete = async (gameId, title) => {
    const result = await Swal.fire({
      text: `Are you sure you want to delete ${title}?`,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "rgb(150,0,0)",
      cancelButtonColor: "gray",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "!border-t-2 !border-b-2 !border-purple-500 !bg-gray-900/80 !h-40 !text-white",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteGame(gameId);
        fetchData();
        toast(`${title} Deleted`, {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
        });
        router.push("/");
      } catch (error) {
        toast(`Failed to delete ${title}`, {
          type: "error",
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
        });
      }
    }
  };

  return (
    <div className="relative">
      {editModal ? <EditGameForm game={game} setEditModal={setEditModal} fetchData={fetchData} /> : null}
      <div>
        {games.map((game) => (
          <div key={game._id} className="p-2 rounded-sm w-full my-2 flex" style={{ backgroundColor: "rgb(20, 0, 80)" }}>
            <a href={`/games/${game._id}`} className="w-[240px] h-[120px] overflow-hidden">
              <img
                src={game.image?.thumbnail ? `${API_URL}/${game.image.thumbnail}` : "/placeholderImage.png"}
                className="w-full h-full object-cover"
              />
            </a>

            <div className="flex w-full gap-4">
              <div className="flex p-2 px-4 w-full justify-between">
                <div className="flex flex-col w-full justify-between">
                  <div className="flex w-full justify-between">
                    <h2 className="text-2xl !text-white mb-4 line-clamp-2">{game.title}</h2>
                    <h2 className="text-xl mr-10 !text-gray-400">
                      Release Date:
                      {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString("en-GB") : "Not available yet"}
                    </h2>
                  </div>
                  <div className="flex justify-around">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl">Status: {game.isActive ? "Active" : "Inactive"}</h2>
                      <div
                        className={`h-[15px] w-[15px] border-1 border-gray-700 rounded-xl ${
                          game.isActive ? "bg-green-600" : "bg-gray-600"
                        }`}
                      ></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl">Early Access: {game.earlyAccess ? "Enabled" : "Disabled"}</h2>
                      <div
                        className={`h-[15px] w-[15px] border-1 border-gray-700 rounded-xl ${
                          game.earlyAccess ? "bg-green-600" : "bg-gray-600"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="h-full">
                  <button
                    onClick={() => {
                      setGame(game), setEditModal(true);
                    }}
                    className="px-4 py-2 bg-green-800 rounded-md w-full h-1/2 flex justify-center items-center mb-1  border-b-4 border-green-900 hover:border-b-0 hover:translate-y-0.5"
                  >
                    <WrenchIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(game._id, game.title);
                    }}
                    className="px-4 py-2 bg-red-800 rounded-md w-full h-1/2 flex justify-center items-center border-b-4 border-red-900 hover:border-b-0 hover:translate-y-0.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                      <path
                        fillRule="evenodd"
                        d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
