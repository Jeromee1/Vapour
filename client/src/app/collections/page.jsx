"use client";

import { useState, useEffect } from "react";
import CollectionSideBar from "@/components/CollectionSidebar";
import CollectionsItem from "@/components/CollectionsItem";
import FavoriteItem from "@/components/FavoriteItem";
import { getMyUser } from "@/api/usersApi";
import { fetchAllGames } from "@/api/gamesApi";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";
import GameOpenModal from "@/components/GameOpenModal";

export default function Collections() {
  const [userData, setUserData] = useState(null);
  const [games, setGames] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [user, gameList] = await Promise.all([getMyUser(), fetchAllGames()]);

        if (!user) {
          router.push("/");
          return;
        }

        setUserData(user);
        setGames(gameList);
      } catch (err) {
        console.warn("Error fetching data:", err);
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading || !userData || !games) {
    return <Spinner />;
  }

  const favoriteGames = userData.favorites.map((fav) => games.find((game) => game._id === fav.game)).filter(Boolean);

  const ownedGames = games.filter((game) => userData.ownedGames.includes(game._id));
  const modalGame = ownedGames.filter((game) => game._id === showModal);

  return (
    <div className="flex min-h-screen relative">
      <div className="hidden lg:block">
        <GameOpenModal showModal={showModal} setShowModal={setShowModal} modalGame={modalGame} />
      </div>
      <CollectionSideBar ownedGames={ownedGames} setShowModal={setShowModal} />
      <div className="flex-1 p-2 sm:p-10 overflow-hidden">
        <h2 className="text-3xl pb-10">Collections</h2>
        <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: "rgb(10,0,50)" }}>
          <h2 className="text-2xl pb-4">Favorites</h2>
          <FavoriteItem favoriteGames={favoriteGames} />
        </div>
        <div className="p-6 rounded-lg h-[450px]" style={{ backgroundColor: "rgb(10,0,50)" }}>
          <h2 className="text-2xl pb-4">Owned Games</h2>
          {ownedGames.length < 1 ? (
            <h2>You don't own any games.</h2>
          ) : (
            <CollectionsItem ownedGames={ownedGames} setShowModal={setShowModal} />
          )}
        </div>
      </div>
    </div>
  );
}
