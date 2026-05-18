"use client";

import { addGame } from "@/api/gamesApi";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function AddGameForm() {
  const [addedGenres, setAddedGenres] = useState([]);
  const [formData, setFormData] = useState();
  const [images, setImages] = useState({});

  const router = useRouter();

  const fileInputs = {
    banner: useRef(),
    thumbnail: useRef(),
    subImg1: useRef(),
    subImg2: useRef(),
    subImg3: useRef(),
    subImg4: useRef(),
  };

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

  const filteredGenres = genres.filter((gen) => !addedGenres.includes(gen));

  const handleGenre = (genre) => {
    setAddedGenres([...addedGenres, genre]);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    const name = e.target.name;
    if (file) {
      setImages((prev) => ({ ...prev, [name]: file }));
    }
  };

  const triggerInput = (name) => {
    fileInputs[name].current.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalFormData = {
      title: formData.title || "",
      description: formData.description || "",
      genre: [...addedGenres] || [],
      price: formData.price || "",
      age: formData.age || "",
      video: formData.video || "",
      theme: formData.theme || "",
      banner: images.banner || "",
      thumbnail: images.thumbnail || "",
      subImg1: images.subImg1 || "",
      subImg2: images.subImg2 || "",
      subImg3: images.subImg3 || "",
      subImg4: images.subImg4 || "",
      onSale: formData.onSale || "",
    };

    const result = await Swal.fire({
      text: `Upload ${formData.title}?`,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "gray",
      confirmButtonText: "Upload",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "!border-t-2 !border-b-2 !border-purple-500 !bg-gray-900/80 !h-40 !text-white",
      },
    });

    if (result.isConfirmed) {
      try {
        await addGame(finalFormData);
        toast("Game uploaded", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
        });
        router.push("/developer");
      } catch (error) {
        toast("Failed to upload game :(", {
          type: "error",
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-6 bg-gray-950/50 rounded-xl">
      <div className="flex w-full">
        <div className="flex flex-col w-101">
          <div className="w-full h-79 flex flex-col p-4 bg-gray-800 gap-3">
            <div
              onClick={() => triggerInput("banner")}
              className="banner w-93 bg-gray-700 hover:bg-gray-600 h-30 flex justify-center items-center cursor-pointer"
            >
              {images.banner ? (
                <img src={URL.createObjectURL(images.banner)} alt="Banner" className="h-full w-full object-cover" />
              ) : (
                "Banner"
              )}
              <input ref={fileInputs.banner} onChange={handleImage} type="file" name="banner" className="hidden" />
            </div>

            <div className="flex gap-3">
              <div
                onClick={() => triggerInput("thumbnail")}
                className="thumbnail w-45 h-25 bg-gray-700 hover:bg-gray-600 flex justify-center items-center cursor-pointer"
              >
                {images.thumbnail ? (
                  <img
                    src={URL.createObjectURL(images.thumbnail)}
                    alt="Thumbnail"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "Thumbnail"
                )}
                <input
                  ref={fileInputs.thumbnail}
                  onChange={handleImage}
                  type="file"
                  name="thumbnail"
                  className="hidden"
                />
              </div>

              <div className="flex flex-col gap-3 px-2">
                <div className="flex gap-3">
                  {["subImg1", "subImg2"].map((key) => (
                    <div
                      key={key}
                      onClick={() => triggerInput(key)}
                      className="w-20 h-11 bg-gray-700 hover:bg-gray-600 flex justify-center items-center text-xs cursor-pointer"
                    >
                      {images[key] ? (
                        <img src={URL.createObjectURL(images[key])} alt={key} className="h-full w-full object-cover" />
                      ) : (
                        key
                      )}
                      <input ref={fileInputs[key]} onChange={handleImage} type="file" name={key} className="hidden" />
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  {["subImg3", "subImg4"].map((key) => (
                    <div
                      key={key}
                      onClick={() => triggerInput(key)}
                      className="w-20 h-11 bg-gray-700 hover:bg-gray-600 flex justify-center items-center text-xs cursor-pointer"
                    >
                      {images[key] ? (
                        <img src={URL.createObjectURL(images[key])} alt={key} className="h-full w-full object-cover" />
                      ) : (
                        key
                      )}
                      <input ref={fileInputs[key]} onChange={handleImage} type="file" name={key} className="hidden" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <input
              onChange={handleChange}
              type="text"
              name="video"
              placeholder="Paste video link here"
              className="h-10 w-full p-2 bg-gray-700 rounded-md border-2 border-gray-600"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-600 cursor-pointer py-4 mt-6 rounded-md font-bold"
          >
            ADD GAME
          </button>
        </div>

        <div className="flex flex-col w-full px-6">
          <div className="w-full flex flex-col p-2 gap-4 h-full">
            <input
              onChange={handleChange}
              type="text"
              name="title"
              placeholder="Game Title"
              className="h-10 w-full p-2 bg-gray-700 rounded-md border-2 border-gray-600"
            />
            <textarea
              onChange={handleChange}
              type="text"
              name="description"
              placeholder="Game Description"
              className="h-20 w-full p-2 bg-gray-700 rounded-md border-2 border-gray-600 resize-none"
            />
          </div>
          <div className="w-full flex flex-col p-2 gap-4 h-full">
            <div className="flex w-full gap-3">
              <div className="flex flex-col w-full gap-3">
                <div className="relative h-15 w-full gap-2 p-2 flex flex-wrap items-center bg-gray-700 rounded-md border-2 overflow-y-auto border-gray-600">
                  <h2 className="absolute !text-gray-400">Genres</h2>
                  {addedGenres.map((gen) => (
                    <div key={gen} value={gen} className="p-2 z-2 text-sm bg-gray-800 rounded-lg">
                      {gen}
                      <button
                        onClick={() => setAddedGenres(addedGenres.filter((g) => g !== gen))}
                        type="button"
                        className="!text-gray-500 hover:!text-gray-400 pl-2 cursor-pointer text-xs"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
                <div className="w-full flex flex-wrap gap-2 overflow-y-auto p-4 bg-gray-800 rounded-md border-2 border-gray-600">
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
              <div className="flex flex-col gap-3">
                <div className="flex gap-3">
                  <div className="flex items-center border-2 border-gray-600 bg-gray-700 rounded-md overflow-hidden">
                    <span className="pl-2 text-white">RM</span>
                    <input
                      onChange={handleChange}
                      type="number"
                      name="price"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      className="h-10 w-full p-2 bg-gray-700 text-white focus:outline-none"
                    />
                  </div>
                  <select
                    onChange={handleChange}
                    name="theme"
                    className="text-xs h-10 w-full p-2 bg-gray-700 rounded-md border-2 border-gray-600"
                  >
                    <option value="0">Default (purple)</option>
                    <option value="1">Red</option>
                    <option value="2">Green</option>
                    <option value="3">Blue</option>
                    <option value="4">Gold</option>
                    <option value="5">White</option>
                    <option value="6">Black</option>
                  </select>
                </div>
                <select
                  onChange={handleChange}
                  name="age"
                  className="h-10 w-full p-2 text-sm bg-gray-700 rounded-md border-2 border-gray-600"
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
