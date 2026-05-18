import { sendFriendRequest, statusFriendRequest } from "@/api/friendsApi";
import { toast } from "react-toastify";

export default function AddFriends({
  user,
  allUsers,
  friendRequestsOut,
  friendRequestsIn,
  fetchRequestsIn,
  fetchRequestsOut,
}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleClick = async (userId) => {
    try {
      await sendFriendRequest(userId);

      await fetchRequestsOut();

      toast("Sent Friend Request", {
        theme: "dark",
        position: "bottom-right",
        autoClose: 1000,
      });
    } catch (e) {
      toast(`${e.response?.data?.msg || e.message}`, {
        theme: "dark",
        position: "bottom-right",
        autoClose: 1000,
        type: "error",
      });
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      await statusFriendRequest(requestId, action);
      if (action === "accepted") {
        fetchRequestsIn();

        toast("Accepted Friend Request", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
        });
      }
      if (action === "declined") {
        fetchRequestsIn();

        toast("Declined Friend Request", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
        });
      }
    } catch (e) {
      console.error(`Error: ${e.response?.data?.msg || e.message}`);
    }
  };

  return (
    <div className="flex flex-col">
      {allUsers
        .filter((users) => users._id !== user._id && !user.friends.some((friend) => friend._id === users._id))
        .map((users) => (
          <div key={users._id} className="flex justify-between items-center border-y-1 border-gray-600">
            <div className="flex items-center">
              <div className="w-15 h-15 overflow-hidden mr-3">
                <img
                  src={users.pfp ? `${API_URL}/${users.pfp}` : "/Placeholder.jpg"}
                  className="h-full w-full object-cover"
                  alt={users.username}
                />
              </div>

              <a href={`/users/${users._id}`} className="text-white overflow-x-hidden">
                {users.username}
              </a>
            </div>
            {friendRequestsOut.some((sent) => sent.receive._id === users._id) ? (
              <button
                onClick={() => handleClick(users._id)}
                className="w-[60px] text-xs p-2 rounded-md bg-gray-600 hover:bg-gray-500 mr-4 cursor-not-allowed"
              >
                Sent
              </button>
            ) : friendRequestsIn.some((received) => received.request._id === users._id) ? (
              <button
                onClick={() => handleAction(friendRequestsIn.find((r) => r.request._id === users._id)._id, "accepted")}
                className="w-[60px] text-xs p-2 rounded-md bg-purple-800 hover:bg-purple-700 transition-colors mr-4"
              >
                Accept
              </button>
            ) : (
              <button
                onClick={() => handleClick(users._id)}
                className="w-[60px] text-xs p-2 rounded-md bg-purple-800 hover:bg-purple-700 transition-colors mr-4"
              >
                Add
              </button>
            )}
          </div>
        ))}
    </div>
  );
}
