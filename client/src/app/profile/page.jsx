"use client";

import { useState, useEffect } from "react";
import { getMyUser } from "@/api/usersApi";
import { fetchAllGames } from "@/api/gamesApi";
import { useRouter } from "next/navigation";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import Spinner from "@/components/Spinner";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);

    (async () => {
      try {
        const [userData, gamesData] = await Promise.all([getMyUser(), fetchAllGames()]);
        if (!userData) {
          router.push("/");
          return;
        }
        setUser(userData);
        setGames(gamesData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const favoriteGames = games.filter((game) => user.favorites.some((favorite) => favorite.game === game._id));

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <div className="h-full flex justify-center pb-20">
      <div className="h-full p-2 flex flex-col gap-2" style={{ backgroundColor: "rgb(20,20,20)" }}>
        <div className="h-full w-[90vw] md:w-[80vw] lg:w-[60vw]" style={{ backgroundColor: "rgb(30,30,30)" }}>
          <div className="h-full flex flex-col sm:flex-row p-6 gap-4">
            <div className="left md:w-[70%] flex flex-col md:flex-row">
              <div className="h-[180px] w-[180px] bg-gray-600 border-5 border-r-gray-400 border-b-gray-500">
                <img
                  src={user?.pfp ? `${API_URL}/${user.pfp}` : "/Placeholder.jpg"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="xl:px-10 ml-4">
                <h2 className="font-bold text-2xl !text-white mt-2 md:m-0">{user?.username}</h2>
                <div className="flex gap-2 items-center mt-2">
                  <h2 className="text-xs !text-gray-400"> Your User ID: {user?._id}</h2>
                  <DocumentDuplicateIcon className="size-4 cursor-pointer" />
                </div>
              </div>
            </div>
            <div className="right md:w-[30%]">
              <div className="flex flex-col h-full justify-between">
                <div className="flex flex-col h-full">
                  <h2 className="text-xl">User's Bio:</h2>
                  <p className="p-2 text-sm !text-gray-400 break-words overflow-y-auto h-30">{user.bio}</p>
                </div>
                <div className="mb-2">
                  <a
                    href="/settings"
                    className="text-center px-4 py-3 rounded-sm border-1 border-gray-700 hover:!bg-gray-800 transition duration-250"
                    style={{ backgroundColor: "rgb(20,20,20)" }}
                  >
                    Edit Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full w-[90vw] md:w-[80vw] lg:w-[60vw]" style={{ backgroundColor: "rgb(30,30,30)" }}>
          <div className="h-full flex flex-col sm:flex-row p-6 gap-4">
            <div className="left sm:w-[70%]">
              <div className="flex flex-col">
                <h2 className="h-10 flex items-center p-1 text-xl" style={{ backgroundColor: "rgb(10,10,10)" }}>
                  Your Favorites
                </h2>
                <div className="flex flex-col gap-1">
                  {user?.favorites?.length < 1 ? (
                    <h2>You do not have any favorite games.</h2>
                  ) : (
                    favoriteGames.map((game) => (
                      <a
                        href={`/games/${game._id}`}
                        key={game._id}
                        className="flex"
                        style={{ backgroundColor: "rgb(20,20,20)" }}
                      >
                        <div className="h-[80px] w-[120px]">
                          <img
                            src={game.image?.thumbnail ? `${API_URL}/${game.image.thumbnail}` : "/placeholderImage.png"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex p-2">
                          <h2>{game.title}</h2>
                        </div>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className="right sm:w-[30%]">
              <div className="flex flex-col w-full" style={{ backgroundColor: "rgb(20,20,20)" }}>
                <div className="w-full">
                  <h2 className="h-10 flex items-center p-1 !text-purple-500 text-xl">Friends</h2>
                  {user?.friends.length < 1 ? (
                    <h2 className="!text-gray-400 text-xs p-1">You haven't added any friends.</h2>
                  ) : (
                    user?.friends.map((friend) => (
                      <div key={friend._id} className="h-10 w-full flex items-center gap-2 p-1">
                        <div className="h-10 w-10">
                          <img
                            src={friend.pfp ? `${API_URL}/${friend.pfp}` : "/Placeholder.jpg"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <a href={`/users/${friend._id}`}>{friend.username}</a>
                      </div>
                    ))
                  )}
                  <hr className="opacity-20 my-2" />
                </div>
                <div className="flex flex-col p-2 gap-2">
                  <h2 className="!text-white hover:underline">Developed Games ({user?.developedGames.length})</h2>
                  <h2 className="!text-white hover:underline">Owned Games ({user?.ownedGames.length})</h2>
                  <a href={`/wishlist/${user?._id}`} className="!text-white hover:underline">
                    Wishlisted Games ({user?.wishlist.length})
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
