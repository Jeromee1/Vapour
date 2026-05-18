export default function GameItem({ game }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <a
      href={`/games/${game._id}`}
      className="relative h-[200px] w-[100%] rounded-lg transform hover:scale-102 overflow-hidden transition-all ease-in-out hover:shadow-lg shadow-black/50"
    >
      <div className="w-full h-full">
        <img
          src={game.image ? `${API_URL}/${game.image.thumbnail}` : "/placeholderImage.png"}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute bottom-0 h-18 bg-gray-950/75 w-full flex p-1">
        <h2 className="text-2xl w-full text-wrap">{game.title}</h2>
      </div>
    </a>
  );
}
