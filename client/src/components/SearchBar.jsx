"use client";

import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { getMyUser } from "@/api/usersApi";
import SearchList from "./SearchList";

export default function SearchBar({ games }) {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  const changeHandler = (e) => {
    setSearch(e.target.value);
  };

  const fetchUser = async () => {
    try {
      const userData = await getMyUser();
      if (userData) {
        setUser(userData);
      }
    } catch (e) {
      console.warn("User not logged in:", e.message);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [user]);

  const filteredSearch = (games || []).filter((game) => game.title.toLowerCase().startsWith(search.toLowerCase()));

  return (
    <div className="hidden sm:flex absolute rounded-md top-20 left-[10%] xl:left-[20%] right-0 z-50 justify-center w-[80%] xl:w-[60%] py-1 bg-gradient-to-l from-[rgb(26,26,26)] to-[rgb(53,53,53)] ">
      <div className="flex justify-between items-center w-full max-w-[90%] md:max-w-6xl px-4">
        <div className="flex gap-4">
          <a href="/" className="!text-white">
            Store
          </a>
          {user && (
            <a href={`/wishlist/${user._id}`} className="!text-white hover:underline">
              Wishlists ({user.wishlist?.length || 0})
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            name="search"
            onChange={changeHandler}
            className="w-[100%] relative py-1 px-2 bg-gradient-to-l from-[rgb(52,52,52)] to-[rgb(68,68,68)]"
            placeholder="Search"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-white absolute right-6" />
        </div>
      </div>
      <div className="absolute top-[41] right-0">
        {search.length < 1 ? null : <SearchList filteredSearch={filteredSearch} />}
      </div>
    </div>
  );
}
