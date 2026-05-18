"use client";

import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

export default function CollectionSideBar({ ownedGames, setShowModal }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);

  useEffect(() => {
    setFilteredGames(ownedGames.filter((game) => game.title.toLowerCase().includes(search.toLowerCase())));
  }, [search, ownedGames]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div
      className={`overflow-y-auto h-[100%)] transition-all duration-300 ease-in-out flex flex-col border-r-2 border-purple-950 ${
        isExpanded ? "w-[300px] min-w-[300px]" : "w-[50px] min-w-[50px]"
      }`}
      style={{ backgroundColor: "rgb(10, 0, 50)" }}
    >
      <div className="py-2 flex justify-between items-center px-2 gap-2">
        {isExpanded && (
          <input
            type="text"
            name="search"
            value={search}
            className="bg-transparent border-b border-purple-700 focus:outline-none text-white w-full px-2 py-1"
            placeholder="Search..."
            onChange={handleChange}
          />
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-300 hover:text-white transition-colors flex justify-center items-center p-1"
          aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          {isExpanded ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="overflow-y-auto flex-1">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div
                key={game._id}
                onClick={() => setShowModal(game._id)}
                className="border-b border-purple-900/50 px-4 py-3 text-white hover:bg-purple-900/70 cursor-pointer transition-colors duration-200 flex items-center"
              >
                <span className="truncate">{game.title}</span>
              </div>
            ))
          ) : (
            <div className="text-purple-300 text-center py-4">No games found</div>
          )}
        </div>
      )}
    </div>
  );
}
