export default function FavoriteItem({ favoriteGames }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div>
      <div className="flex overflow-x-auto pb-2">
        {favoriteGames?.map((game) => (
          <a
            href={`/games/${game._id}`}
            key={game._id}
            className="group relative flex-shrink-0 w-48 h-30 mr-4 bg-purple-900 rounded-sm overflow-hidden"
          >
            <img
              src={`${game.image?.thumbnail ? `${API_URL}/${game.image.thumbnail}` : "/placeholderImage.png"}`}
              alt={game.title}
              className="object-cover w-full h-full"
            />

            <div
              className="absolute bottom-0 w-full h-0 bg-black bg-opacity-60 opacity-0 group-hover:h-12 group-hover:opacity-100 
               transition-all duration-300 ease-in-out flex items-center justify-center"
            >
              <p className="text-white text-sm px-2 text-center">{game.title}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
