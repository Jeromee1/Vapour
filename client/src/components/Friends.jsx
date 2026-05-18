import { removeFriend } from "@/api/friendsApi";
import { toast } from "react-toastify";

export default function Friends({ user, fetchUser }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleClick = async (friendId) => {
    try {
      await removeFriend(friendId);
      await fetchUser();
      toast("Removed friend", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 1000,
      });
    } catch (e) {
      console.error(`Error: ${e.response?.data?.msg || e.message}`);
    }
  };

  return (
    <div className="flex flex-col">
      {user.friends.length < 1 ? (
        <h2 className="text-sm text-center py-6">You haven't added any friends.</h2>
      ) : (
        user.friends.map((users) => (
          <div key={users._id} className="flex justify-between items-center border-y-1 border-gray-600">
            <div className="flex items-center">
              <div className="w-25 h-15 overflow-hidden mr-3">
                <img
                  src={users.pfp ? `${API_URL}/${users.pfp}` : "/Placeholder.jpg"}
                  className="h-full w-full object-cover"
                  alt={users.username}
                />
              </div>

              <a href={`/users/${users._id}`} className="text-white w-full overflow-x-hidden">
                {users.username}
              </a>
            </div>
            <button
              onClick={() => handleClick(users._id)}
              className="text-xs p-2 rounded-md bg-gray-600 hover:bg-gray-500 mr-4"
            >
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}
