import { getUser } from "@/api/usersApi";
import { getUserWishlist } from "@/api/wishlistApi";
import WishlistList from "@/components/WishlistList";
import { fetchAllGames } from "@/api/gamesApi";

export default async function Wishlist({ params }) {
  const userId = await params;
  const user = await getUser(userId.id);
  const wishlist = await getUserWishlist(userId.id);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  return (
    <div className="p-0 sm:p-10 md:px-20 py-10">
      <div className="flex justify-center md:justify-start items-center w-full gap-x-6 pb-6">
        <div className="h-[80px] w-[80px] bg-gray-600 border-4 border-r-gray-400 border-b-gray-500">
          <img src={user?.pfp ? `${API_URL}/${user.pfp}` : "/Placeholder.jpg"} className="h-full w-full object-cover" />
        </div>
        <h2 className="text-3xl w-[150px] sm:w-full">{user?.username}'s Wishlist</h2>
      </div>
      <WishlistList wishlist={wishlist} />
    </div>
  );
}
