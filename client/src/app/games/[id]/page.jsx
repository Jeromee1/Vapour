import { fetchGame } from "@/api/gamesApi";
import { fetchAllGames } from "@/api/gamesApi";
import SearchBar from "@/components/SearchBar";
import AddToCart from "@/components/AddToCart";
import Preview from "@/components/Preview";
import FavoriteButton from "@/components/FavoriteButton";
import WishlistButton from "@/components/WishlistButton";
import { ToastContainer } from "react-toastify";
import AgeRatingImg from "@/components/AgeRatingImg";
import ReviewList from "@/components/ReviewList";
import AgeVerification from "@/components/AgeVerification";

export default async function GamePage({ params }) {
  const { id } = params;
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const ageDesc = [
    "Final rating not yet assigned.",
    "Minimal cartoon/fantasy violence, no strong language or suggestive themes.",
    "Mild violence, crude humor, or very mild suggestive themes.",
    "Moderate violence, mild blood, simulated gambling, or infrequent strong language.",
    "Intense violence, blood/gore, sexual content, or frequent strong language.",
    "Extreme violence, or real gambling.",
  ];

  try {
    const game = await fetchGame(id);
    const games = await fetchAllGames();

    if (!game) {
      return (
        <div className="p-15 pt-20 flex justify-center">
          <div className="w-[60vw] text-center">
            <h2 className="text-2xl font-bold text-red-500">Game Not Found!</h2>
            <p>Please ensure the URL is correct or try again later.</p>
          </div>
        </div>
      );
    }

    let overall = "";

    if (game) {
      const summary = game.reviews?.reduce(
        (acc, review) => {
          if (review.recommended === true) {
            acc.positive++;
          } else {
            acc.negative++;
          }
          return acc;
        },
        { positive: 0, negative: 0 }
      );

      const total = summary.positive + summary.negative;
      const positiveRatio = total > 0 ? summary.positive / total : 0;

      if (positiveRatio >= 0.7) {
        overall = "Positive";
      } else if (positiveRatio <= 0.3) {
        overall = "Negative";
      } else {
        overall = "Mixed";
      }
    }

    const thumbnail = game.image?.thumbnail ? `${API_URL}/${game.image.thumbnail}` : "/placeholderImage.png";

    return (
      <>
        <AgeVerification game={game} />
        <SearchBar games={games} />
        <div className="sm:p-15 pt-20 flex justify-center">
          <div className="w-full md:w-[80vw] xl:w-[60vw] flex flex-col">
            <div className="flex py-2 w-full px-4 sm:px-0">
              <h2 className="font-bold text-3xl">{game.title}</h2>
              <WishlistButton game={game} />
            </div>
            <div className="flex flex-col-reverse md:flex md:flex-row">
              <div className="left flex flex-col md:w-[70%]">
                <div className="md:w-[98%]">
                  <Preview game={game} />
                </div>
              </div>
              <div
                className="right mb-2 md:mb-0 flex flex-col md:w-[300px] md:h-full"
                style={{ backgroundColor: "rgb(10, 0, 50)" }}
              >
                <div className="w-full h-[50%] md:h-[180px] bg-gray-700 relative">
                  <img src={thumbnail} alt={`${game.title} thumbnail`} className="h-full w-full object-cover" />
                  <div className="absolute top-1 sm:left-auto sm:right-1 z-10">
                    <FavoriteButton game={game} />
                  </div>
                </div>
                <div className="p-2 flex flex-col h-full md:h-[80%]">
                  <p className="text-wrap break-words overflow-hidden line-clamp-4 !text-gray-400 text-sm">
                    {game.description || "No description available"}
                  </p>

                  <div className="flex gap-2 items-center py-2">
                    <span>Rating: </span>
                    {game.reviews?.length < 1 ? (
                      <h2 className="text-sm !text-gray-300">No reviews yet</h2>
                    ) : (
                      <div className="flex items-center gap-1">
                        {overall === "Positive" ? (
                          <div className="!text-[#009e2f] font-bold text-sm">{overall}</div>
                        ) : overall === "Mixed" ? (
                          <div className="!text-[#A8926A] font-bold text-sm">{overall}</div>
                        ) : overall === "Negative" ? (
                          <div className="!text-[#512026] font-bold text-sm">{overall}</div>
                        ) : null}
                        <h2 className=" !text-gray-400 flex items-center text-xs">({game.reviews.length} reviews)</h2>
                      </div>
                    )}
                  </div>

                  <h2 className="text-sm">
                    <span>Release Date: </span>
                    {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString("en-GB") : "Not available yet"}
                  </h2>
                  <h2 className="text-sm py-2">
                    <span>Developer: </span>
                    {game.developer?.username ? game.developer.username : "Not available yet"}
                  </h2>
                  <div className="flex mt-auto gap-1 flex-wrap">
                    {game.genre?.map((genre) => (
                      <a
                        href={`/categories/${genre.toLowerCase()}`}
                        key={genre}
                        className="rounded-sm p-1 px-2 bg-gray-600 text-xs"
                      >
                        {genre}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row mt-3 gap-3 md:gap-0">
              <div className="left flex flex-col md:w-[70%]">
                <div className="flex flex-col md:w-[98%] gap-4">
                  {game.earlyAccess ? (
                    <div className="p-2 pt-4 bg-gradient-to-t rounded-md from-[rgb(0,49,108)] to-[rgb(0,104,145)]">
                      <h2 className="text-3xl">Early Access</h2>
                      <h2 className="py-1">
                        Get instant access and start playing; get involved with this game as it develops.
                      </h2>
                      <p className="text-[12px]">
                        <span className="!text-amber-400">Note:</span> Games in Early Access are not complete and may or
                        may not change further. If you are not excited to play this game in its current state, then you
                        should wait to see if the game progresses further in development. Learn more
                      </p>
                    </div>
                  ) : null}

                  <div>
                    <div className="px-5 rounded-t-sm pt-1 h-[6vh] shadow-md shadow-green-900 bg-gradient-to-r from-[rgb(0,49,6)] to-[rgb(0,107,21)] relative">
                      <div className="bg-black absolute h-[40px] right-2 top-[10px] flex items-center rounded-md">
                        {game.price === 0 ? (
                          <h2 className="px-5">Free</h2>
                        ) : game.onSale ? (
                          <h2 className="px-5">RM {(game.price * (1 - game.onSale / 100)).toFixed(2)}</h2>
                        ) : (
                          <h2 className="px-5">RM {game.price.toFixed(2)}</h2>
                        )}
                        <AddToCart game={game} />
                      </div>
                    </div>
                    <div
                      className="h-[8vh] flex justify-between items-center px-5"
                      style={{ backgroundColor: "rgb(10, 0, 50)" }}
                    >
                      <h2 className="text-[4vw] md:text-[2vw] line-clamp-1 w-100">BUY {game.title}</h2>
                      <div className="h-full flex items-end pb-2">
                        <h2 className="text-xs !text-gray-600 hidden sm:block">Purchase includes game</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="right flex flex-col md:w-[300px] gap-2">
                <div
                  className="flex justify-around h-full md:h-40 lg:h-33 p-4 overflow-y-auto"
                  style={{ backgroundColor: "rgb(10, 0, 50)" }}
                >
                  <AgeRatingImg game={game} />
                  <div className="px-2 w-[70%]">
                    {game.age === 0 ? null : <h2 className="text-xs font-bold">This game might contain:</h2>}
                    <p className="text-xs py-2 !text-gray-300">{ageDesc[game.age]}</p>
                  </div>
                </div>
                <div className="flex h-20 p-4 overflow-y-auto" style={{ backgroundColor: "rgb(10, 0, 50)" }}>
                  <h2>Game Sales: {game?.sales}</h2>
                </div>
              </div>
            </div>
            <div className="mt-10" id="reviews">
              <h2 className="p-2 text-2xl text-center">Reviews</h2>
              <hr className="opacity-75 mb-4" />
              <ReviewList game={game} />
            </div>
          </div>
        </div>
        <ToastContainer />
      </>
    );
  } catch (error) {
    console.error("Error loading game:", error);
    return (
      <div className="p-15 pt-20 flex justify-center">
        <div className="w-[60vw] text-center">
          <h2 className="text-2xl font-bold text-red-500">Error Loading Game</h2>
          <p>Please try again later.</p>
        </div>
      </div>
    );
  }
}
