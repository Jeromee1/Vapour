import { useState, useEffect } from "react";
import Launcher from "./Launcher";
import { PlayIcon } from "@heroicons/react/24/solid";

export default function GameOpenModal({ showModal, setShowModal, modalGame }) {
  const [showLauncher, setShowLauncher] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (showModal.length < 1) {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showModal]);

  if (modalGame.length > 0) {
    return (
      <>
        {showLauncher ? <Launcher setShowLauncher={setShowLauncher} showLauncher={showLauncher} /> : null}

        <div onClick={() => setShowModal([])} className="h-[100vh] w-[100vw] bg-black/20 fixed top-0 left-0 z-50"></div>
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[90vh] w-[70vw] border-2 border-purple-900 rounded-lg z-51"
          style={{ backgroundColor: "rgb(10,0,50)" }}
        >
          <div className="w-full h-70 relative overflow-hidden rounded-t-lg">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/90 to-black/30"></div>
            <img
              src={modalGame[0]?.image?.banner ? `${API_URL}/${modalGame[0].image.banner}` : "/BannerPlaceholder.jpg"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="py-4 w-full h-70">
            <div className="flex items-center justify-between px-8 pb-4">
              <h2 className="text-3xl">{modalGame[0]?.title}</h2>
              <button
                onClick={() => setShowLauncher(true)}
                className="bg-green-800 hover:bg-green-700 rounded-xs px-4 py-2 w-[150px] flex justify-center items-center text-xl"
              >
                <PlayIcon className="size-5 mr-2" fill="rgb(200,200,200)" />
                Launch
              </button>
            </div>
            <div className="w-full h-full overflow-y-auto">
              <div className="flex flex-col rounded-b-lg mx-8" style={{ backgroundColor: "rgb(10,20,70)" }}>
                <div className="bg-gray-700 w-full p-1 rounded-sm gap-1 flex">
                  <a href={`/games/${modalGame[0]?._id}`} className="hover:bg-gray-600 px-2 py-1 rounded-md">
                    Store Page
                  </a>
                  {/* <a href={`/games/${modalGame[0]?._id}/#reviews`} className="hover:bg-gray-600 px-2 py-1 rounded-md">
                    Reviews
                  </a> */}
                </div>
                <div className="p-4 h-100">
                  <div className="h-40 w-80 rounded-md overflow-hidden">
                    <img
                      src={
                        modalGame[0]?.image?.thumbnail
                          ? `${API_URL}/${modalGame[0].image.thumbnail}`
                          : "/placeholderImage.png"
                      }
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="my-2 !text-gray-400">{modalGame[0]?.description}</h2>
                  <h2 className="my-6 !text-gray-400">
                    Release Date:{" "}
                    {modalGame[0]?.releaseDate
                      ? new Date(modalGame[0]?.releaseDate).toLocaleDateString("en-GB")
                      : "Not available yet"}
                  </h2>
                  <h2 className="my-2 !text-gray-400">Game Sales: {modalGame[0]?.sales}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return null;
  }
}
