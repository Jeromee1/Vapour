"use client";

import { updateStatus } from "@/api/gamesApi";
import { updateAccess } from "@/api/gamesApi";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { updateGame } from "@/api/gamesApi";
import Swal from "sweetalert2";

export default function EditGameForm({ game, setEditModal, fetchData }) {
  const [status, setStatus] = useState(false);
  const [access, setAccess] = useState(false);
  const [updatedGame, setUpdatedGame] = useState(game);
  const [updatedGenres, setUpdatedGenres] = useState(game.genre || []);
  const [updatedImages, setUpdatedImages] = useState(game.image || {});

  useEffect(() => {
    setStatus(game.isActive);
    setAccess(game.earlyAccess);
  }, [game]);

  const genres = [
    "Action",
    "Adventure",
    "Indie",
    "RPG",
    "Strategy",
    "Simulation",
    "Casual",
    "Sports",
    "Racing",
    "Multiplayer",
    "Singleplayer",
    "Co-op",
    "Open World",
    "Survival",
    "Horror",
    "Shooter",
    "Platformer",
    "Puzzle",
    "Sandbox",
    "Story Rich",
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setUpdatedImages((prev) => ({
        ...prev,
        [name]: file,
      }));
    } else {
      setUpdatedGame((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      title: updatedGame.title || "",
      description: updatedGame.description || "",
      genre: [...updatedGenres] || [],
      price: updatedGame.price || "",
      age: updatedGame.age || "",
      video: updatedGame.video || "",
      theme: updatedGame.theme || "",
      onSale: updatedGame.onSale || "",
      banner: updatedImages.banner || "",
      thumbnail: updatedImages.thumbnail || "",
      subImg1: updatedImages.subImg1 || "",
      subImg2: updatedImages.subImg2 || "",
      subImg3: updatedImages.subImg3 || "",
      subImg4: updatedImages.subImg4 || "",
    };

    const result = await Swal.fire({
      text: "Are you sure you want to save changes?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "gray",
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "!border-t-2 !border-b-2 !border-purple-500 !bg-gray-900/80 !h-40 !text-white",
      },
    });

    if (result.isConfirmed) {
      try {
        await updateGame(updatedFormData, game._id);
        toast("Game updated successfully", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
        });
        setEditModal(false);
        fetchData();
      } catch (error) {
        toast("Failed to update game", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
          type: "error",
        });
      }
    }
  };

  const filteredGenres = genres.filter((gen) => !updatedGenres.includes(gen));

  const handleGenre = (genre) => {
    setUpdatedGenres([...updatedGenres, genre]);
  };

  const handleStatus = async (gameId, e) => {
    const isChecked = e.target.checked;
    setStatus(isChecked);
    await updateStatus(gameId, isChecked);
    fetchData();
    toast(`Status has been ${isChecked ? "Enabled" : "Disabled"}`, {
      theme: "dark",
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleAccess = async (gameId, e) => {
    const isChecked = e.target.checked;
    setAccess(isChecked);
    await updateAccess(gameId, isChecked);
    fetchData();
    toast(`Early Access has been ${isChecked ? "Enabled" : "Disabled"}`, {
      theme: "dark",
      position: "bottom-right",
      autoClose: 2000,
    });
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="h-[100vh] w-[100vw] fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-60"
      onClick={() => setEditModal(false)}
    >
      <form
        className="p-4 bg-gray-950/95 rounded-md h-[90vh] w-[80vw] z-50 border-2 border-purple-500"
        onClick={handleModalContentClick}
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl text-center w-full h-1">Edit Game</h2>
        <div className="flex flex-col justify-between h-full">
          <div className="flex w-full p-10">
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <label
                  onChange={handleChange}
                  htmlFor="banner"
                  className="w-20 h-20 bg-gray-800 hover:bg-gray-700 flex items-center justify-center cursor-pointer text-xs rounded-lg"
                >
                  Banner
                  <input type="file" id="banner" name="banner" className="hidden" />
                </label>
                <label
                  onChange={handleChange}
                  htmlFor="thumbnail"
                  className="w-20 h-20 bg-gray-800 hover:bg-gray-700 flex items-center justify-center cursor-pointer text-xs rounded-lg"
                >
                  Thumbnail
                  <input type="file" id="thumbnail" name="thumbnail" className="hidden" />
                </label>
              </div>
              <div className="flex gap-4">
                <label
                  onChange={handleChange}
                  htmlFor="subImg1"
                  className="w-20 h-20 bg-gray-800 hover:bg-gray-700 flex items-center justify-center cursor-pointer text-xs rounded-lg"
                >
                  Sub Image 1
                  <input type="file" id="subImg1" name="subImg1" className="hidden" />
                </label>
                <label
                  onChange={handleChange}
                  htmlFor="subImg2"
                  className="w-20 h-20 bg-gray-800 hover:bg-gray-700 flex items-center justify-center cursor-pointer text-xs rounded-lg"
                >
                  Sub Image 2
                  <input type="file" id="subImg2" name="subImg2" className="hidden" />
                </label>
              </div>
              <div className="flex gap-4">
                <label
                  onChange={handleChange}
                  htmlFor="subImg3"
                  className="w-20 h-20 bg-gray-800 hover:bg-gray-700 flex items-center justify-center cursor-pointer text-xs rounded-lg"
                >
                  Sub Image 3
                  <input type="file" id="subImg3" name="subImg3" className="hidden" />
                </label>
                <label
                  onChange={handleChange}
                  htmlFor="subImg4"
                  className="w-20 h-20 bg-gray-800 hover:bg-gray-700 flex items-center justify-center cursor-pointer text-xs rounded-lg"
                >
                  Sub Image 4
                  <input type="file" id="subImg4" name="subImg4" className="hidden" />
                </label>
              </div>
            </div>
            <div className="flex w-full px-10">
              <div className="flex flex-col w-full gap-3">
                <label htmlFor="title" className="w-full">
                  Game Title:
                  <input
                    onChange={handleChange}
                    name="title"
                    className="bg-gray-800 p-1 w-full border-1 border-gray-700 rounded-md"
                    type="text"
                    value={updatedGame.title}
                  />
                </label>
                <label htmlFor="description" className="flex flex-col">
                  Game Description:
                  <textarea
                    name="description"
                    type="text"
                    value={updatedGame.description}
                    onChange={handleChange}
                    className="bg-gray-800 resize-none h-45 border-1 p-1 text-sm !text-gray-400 border-gray-700 rounded-md"
                  />
                </label>
                <div className="flex w-full gap-3">
                  <label htmlFor="title" className="w-full flex flex-col">
                    Price:
                    <input
                      onChange={handleChange}
                      type="number"
                      name="price"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="bg-gray-800 h-10 w-full"
                      value={updatedGame.price}
                    />
                  </label>
                  <label htmlFor="theme" className="w-full flex flex-col">
                    Theme:
                    <select
                      onChange={handleChange}
                      name="theme"
                      value={updatedGame.theme || ""}
                      className="text-xs h-10 w-full p-2 bg-gray-800 rounded-md border-2 border-gray-700"
                    >
                      <option value="0">Default (purple)</option>
                      <option value="1">Red</option>
                      <option value="2">Green</option>
                      <option value="3">Blue</option>
                      <option value="4">Gold</option>
                      <option value="5">White</option>
                      <option value="6">Black</option>
                    </select>
                  </label>
                  <label htmlFor="age" className="w-full flex flex-col">
                    Age Rating:
                    <select
                      onChange={handleChange}
                      name="age"
                      value={updatedGame.age || ""}
                      className="h-10 w-full p-2 text-sm bg-gray-800 rounded-md border-2 border-gray-700"
                    >
                      <option value="0" className="!text-gray-400">
                        Age Rating
                      </option>
                      <option value="1">Everyone</option>
                      <option value="2">Everyone 10+</option>
                      <option value="3">Teen</option>
                      <option value="4">Mature</option>
                      <option value="5">Adult Only</option>
                    </select>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full gap-3">
              <div className="relative h-19 w-full gap-2 p-2 flex flex-wrap items-center bg-gray-800 rounded-md border-2 overflow-y-auto border-gray-600">
                <h2 className="absolute !text-gray-400">Genres</h2>
                {updatedGenres.map((gen) => (
                  <div key={gen} value={gen} className="p-2 z-2 text-sm bg-gray-700 rounded-lg">
                    {gen}
                    <button
                      onClick={() => setUpdatedGenres(updatedGenres.filter((g) => g !== gen))}
                      type="button"
                      className="!text-gray-500 hover:!text-gray-400 pl-2 cursor-pointer text-xs"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-full flex flex-wrap gap-2 overflow-y-auto p-4 bg-gray-800 rounded-md border-2 border-gray-700">
                {filteredGenres.map((gen) => (
                  <button
                    key={gen}
                    onClick={() => handleGenre(gen)}
                    type="button"
                    className="px-2 py-1 text-xs bg-gray-700 rounded-lg h-8 cursor-pointer"
                  >
                    {gen}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between w-full h-10">
            <div className="flex gap-4 ">
              <label className="flex items-center cursor-pointer h-10">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  name="isActive"
                  checked={status}
                  onChange={(e) => handleStatus(game._id, e)}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Status</span>
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              </label>
              <label className="flex items-center cursor-pointer h-10">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  name="earlyAccess"
                  checked={access}
                  onChange={(e) => handleAccess(game._id, e)}
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-300">Early Access</span>
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
              </label>
              <label htmlFor="onSale" className="flex items-center gap-2">
                Sale:
                <input
                  name="onSale"
                  type="number"
                  className="bg-gray-800 rounded-md p-1"
                  min="0"
                  max="100"
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                onClick={handleSubmit}
                className="bg-green-700 px-4 py-2 hover:bg-green-600 rounded-md"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditModal(false)}
                className="bg-gray-700 px-4 py-2 hover:bg-gray-600 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
