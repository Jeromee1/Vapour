import SearchBar from "@/components/SearchBar";
import GameBanner from "@/components/GameBanner";
import GameCarousel from "@/components/GameCarousel";
import GameCategories from "@/components/GameBrowse";
import SpecialOffers from "@/components/SpecialOffers";
import GameList from "@/components/GameList";
import BrowseCategory from "@/components/BrowseCategory";

import { fetchAllGames } from "@/api/gamesApi";

export default async function Home() {
  const games = (await fetchAllGames()) ?? [];

  return (
    <>
      <SearchBar games={games} />
      <GameBanner games={games} />
      <div className="md:px-20 py-6 sm:py-20 flex justify-center">
        <div className="hidden lg:block w-[15vw]">
          <GameCategories games={games} />
        </div>
        <div className="w-[100vw] md:w-[80vw] xl:w-[60vw]">
          <div className="p-4 rounded-sm" style={{ backgroundColor: "rgb(20,20,20)" }}>
            <h2 className="text-2xl">Featured Games</h2>
            <GameCarousel games={games} />
          </div>

          <div className="p-4 my-10" style={{ backgroundColor: "rgb(20,20,20)" }}>
            <h2 className="text-2xl">Special Offers</h2>
            <SpecialOffers games={games} />
          </div>

          <div className="my-10 rounded-sm">
            <h2 className="text-2xl rounded-sm">Browse By Category</h2>
            <BrowseCategory games={games} />
          </div>

          <div className="my-10 rounded-sm" id="gameList">
            <GameList games={games} />
          </div>
        </div>
        <div className="hidden xl:block w-[15vw]"></div>
      </div>
    </>
  );
}
