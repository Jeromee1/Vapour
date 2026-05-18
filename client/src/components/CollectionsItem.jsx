import { PlayIcon } from "@heroicons/react/24/solid";

export default function CollectionsItem({ ownedGames, setShowModal }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="overflow-auto h-85">
      <div className="flex flex-wrap gap-4 overflow-y-auto pb-5">
        {ownedGames.map((game) => (
          <div
            key={game._id}
            onClick={() => setShowModal(game._id)}
            className="flex-shrink-0 w-62 h-38 bg-gray-700 rounded-sm relative group"
          >
            <div className="w-full h-full">
              <img
                src={game.image?.thumbnail ? `${API_URL}/${game.image.thumbnail}` : "/placeholderImage.png"}
                className="w-full h-full object-cover transition-all group-hover:opacity-60 bg-black"
              />
            </div>
            <div className="absolute bottom-0 h-15 w-full bg-black opacity-60 flex justify-center items-center">
              {game.title}
            </div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
              <PlayIcon className="size-10" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
