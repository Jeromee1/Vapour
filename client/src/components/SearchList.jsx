"use client";

export default function SearchList({ filteredSearch }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="h-full w-[400px]">
      {filteredSearch.length != 0 ? (
        <>
          {filteredSearch.map((game) => (
            <a
              href={`/games/${game._id}`}
              key={game._id}
              className="flex items-center gap-2 p-1 border-t-1 overflow-x-hidden bg-gray-700 border-gray-500 hover:bg-gray-600"
            >
              <div className="h-10 w-15">
                <img src={game.image?.thumbnail ? `${API_URL}/${game.image.thumbnail}` : "/placeholderImage.png"} />
              </div>
              <h2 className="line-clamp-1">{game.title}</h2>
            </a>
          ))}
        </>
      ) : (
        <div className="flex items-center gap-2 p-2 overflow-x-hidden bg-gray-700">
          <h2 className="line-clamp-1">No Games found.</h2>
        </div>
      )}
    </div>
  );
}
