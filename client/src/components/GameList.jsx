"use client";

import { useState, useEffect } from "react";

export default function GameList({ games }) {
  const categories = ["Top Sellers", "Specials", "Free"];
  const [filterCat, setFilterCat] = useState(categories[0]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [preview, setPreview] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    switch (filterCat) {
      case "Top Sellers":
        setFilteredGames([...games].sort((a, b) => (b.sales || 0) - (a.sales || 0)));
        break;
      case "Specials":
        setFilteredGames(games.filter((game) => game.onSale > 0));
        break;
      case "Free":
        setFilteredGames(games.filter((game) => game.price <= 0));
        break;
      default:
        setFilteredGames(games);
    }
  }, [filterCat, games]);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center md:justify-start">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className="px-2 py-1 rounded-t-sm"
            style={{
              backgroundColor: filterCat === cat ? "rgb(30, 30, 30)" : "rgba(0,0,0,0)",
              color: filterCat === cat ? "white" : "rgb(150,150,150)",
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="p-4 w-full flex justify-between h-[782px]" style={{ backgroundColor: "rgb(30, 30, 30)" }}>
        <div className="w-full overflow-y-auto">
          {filteredGames ? (
            <>
              {filteredGames?.map((game) => (
                <a
                  onMouseEnter={() => setPreview(game)}
                  href={`/games/${game._id}`}
                  key={game._id}
                  className={`flex md:mr-3 border-t border-gray-500 p-1 ${
                    preview?._id === game._id ? "bg-gray-500 md:!mr-0 md:pr-4" : "bg-gray-700"
                  }`}
                >
                  <div className="w-[98%] flex gap-2">
                    <div className="h-15 w-30">
                      <img
                        src={game.image?.thumbnail ? `${API_URL}/${game.image.thumbnail}` : "/placeholderImage.png"}
                        alt={game.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex justify-between w-full p-2">
                      <div className="flex flex-col justify-between w-[50%]">
                        <h2 className="line-clamp-1">{game.title}</h2>
                        <div className="flex text-xs !text-gray-400">
                          {game.genre.map((gen, i) => `${gen}${i < game.genre.length && ", "}`)}
                        </div>
                      </div>
                      {game.onSale != 0 ? (
                        <div className="flex items-center gap-x-4">
                          <h2 className="font-bold px-2 py-1 bg-green-800 !text-green-300 rounded-md">
                            -{game.onSale}%
                          </h2>
                          <div className="flex flex-col">
                            <h2 className="line-through !text-gray-400 text-xs text-center">
                              RM {game.price.toFixed(2)}
                            </h2>
                            <h2>RM {(game.price * (1 - game.onSale / 100)).toFixed(2)}</h2>
                          </div>
                        </div>
                      ) : (
                        <h2 className="my-auto">{game.price === 0 ? "Free" : `RM ${game.price.toFixed(2)}`}</h2>
                      )}
                    </div>
                  </div>
                </a>
              ))}
            </>
          ) : (
            <h2>No Games Found.</h2>
          )}
        </div>

        {/* Preview area */}
        <div className="hidden md:block w-[25vw] h-[750px] bg-gray-500 p-4">
          {preview ? (
            <div className="w-full">
              <h3 className="text-xl font-bold mb-2 line-clamp-1">{preview.title}</h3>
              <div className="flex flex-col justify-between my-1 p-1 text-xs bg-gray-600">
                <h2>Overall User Reviews:</h2>
                <h2>{`(${preview.reviews.length} reviews)`}</h2>
              </div>
              <div className="flex py-2 gap-1 w-40 md:w-full overflow-x-auto">
                {preview.genre?.map((gen) => (
                  <a href={`/categories/${gen.toLowerCase()}`} key={gen} className="rounded-md text-xs p-1 bg-gray-600">
                    {gen}
                  </a>
                ))}
              </div>
              <div>
                {preview.image ? (
                  <div className="flex flex-col gap-1 py-2">
                    {[preview.image.subImg1, preview.image.subImg2, preview.image.subImg3, preview.image.subImg4]
                      .filter(Boolean)
                      .map((img, index) => (
                        <img key={index} src={`${API_URL}/${img}`} className="h-36 w-full object-cover" />
                      ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Hover over a game to see details</p>
          )}
        </div>
      </div>
    </div>
  );
}
