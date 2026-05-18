import { fetchAllGames } from "@/api/gamesApi";
import GameItem from "@/components/GameItem";

export default async function Category({ params }) {
  const { filter } = await params;
  const games = await fetchAllGames();

  let filteredGames = null;

  if (filter === "freetoplay") {
    filteredGames = games.filter((game) => game.price === 0);
    return (
      <div className="justify-center p-10 text-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredGames?.map((game) => (
          <GameItem key={game._id} game={game} />
        ))}
      </div>
    );
  }
  if (filter === "earlyaccess") {
    filteredGames = games.filter((game) => game.earlyAccess);
    return (
      <div className="justify-center p-10 text-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredGames?.map((game) => (
          <GameItem key={game._id} game={game} />
        ))}
      </div>
    );
  } else {
    const filteredGames = games.filter((game) =>
      game.genre?.some((gen) => gen.replace(/\s+/g, "").toLowerCase() === filter.replace(/\s+/g, "").toLowerCase())
    );

    return (
      <div className="justify-center p-10 text-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredGames && filteredGames.length > 0 ? (
          filteredGames.map((game) => <GameItem key={game._id} game={game} />)
        ) : (
          <h2 className="col-span-full text-center text-2xl">No games found.</h2>
        )}
      </div>
    );
  }
}
