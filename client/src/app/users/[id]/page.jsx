import { getUser } from "@/api/usersApi";

export default async function UserPage({ params }) {
  const { id } = await params;
  const user = await getUser(id);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  if (!user) return <h2>user not found.</h2>;

  return (
    <div className="py-30 flex flex-col justify-center items-center h-full w-full">
      <div className="relative flex flex-col w-2/3 h-2/3 p-10 rounded-lg" style={{ backgroundColor: "rgb(10,0,50)" }}>
        <div className="absolute h-[150px] w-[150px] top-[-50px] bg-gray-600 border-5 border-r-gray-400 border-b-gray-500">
          <img src={user?.pfp ? `${API_URL}/${user.pfp}` : "/Placeholder.jpg"} className="h-full w-full object-cover" />
        </div>
        <div className="flex justify-center pb-10">
          <h2 className="text-3xl font-bold">{user.username}'s Profile</h2>
        </div>
        <div className="w-full h-full p-6 flex flex-col gap-6" style={{ backgroundColor: "rgb(20, 20, 60)" }}>
          <div
            className="flex flex-col p-4 rounded-md shadow-sm shadow-purple-700"
            style={{ backgroundColor: "rgb(10, 0, 50)" }}
          >
            <h2>Bio:</h2>
            {user.bio ? <p>{user.bio}</p> : <h2>User does not have a bio.</h2>}
          </div>
          <div className="flex w-full gap-6">
            <div
              className="w-1/3 p-4 text-center rounded-md shadow-sm shadow-purple-700"
              style={{ backgroundColor: "rgb(10, 0, 50)" }}
            >
              User's Favorites ({user.favorites.length})
            </div>
            <div
              className="w-1/3 p-4 text-center rounded-md shadow-sm shadow-purple-700"
              style={{ backgroundColor: "rgb(10, 0, 50)" }}
            >
              User's Owned Games ({user.ownedGames.length})
            </div>
            <a
              href={`/wishlist/${user._id}`}
              className="w-1/3 p-4 text-center rounded-md shadow-sm shadow-purple-700 hover:underline"
              style={{ backgroundColor: "rgb(10, 0, 50)" }}
            >
              User's Wishlist ({user.wishlist.length})
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
