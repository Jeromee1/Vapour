import { statusFriendRequest } from "@/api/friendsApi";
import { toast } from "react-toastify";

export default function FriendRequest({ friendRequestsIn, fetchRequestsIn }) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleClick = async (requestId, action) => {
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
      {friendRequestsIn.length < 1 ? (
        <h2 className="text-sm text-center py-6">You have no friend requests.</h2>
      ) : (
        friendRequestsIn.map((request) => (
          <div key={request._id} className="flex justify-between items-center border-y-1 border-gray-600">
            <div className="flex items-center">
              <div className="w-15 h-15 overflow-hidden mr-3">
                <img
                  src={request.request.pfp ? `${API_URL}/${request.request.pfp}` : "/Placeholder.jpg"}
                  className="h-full w-full object-cover"
                  alt={request.request.username}
                />
              </div>
              <a href={`/users/${request.request._id}`} className="text-white">
                {request.request.username}
              </a>
            </div>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => handleClick(request._id, "accepted")}
                className="text-xs px-3 py-1 rounded-md bg-purple-700 hover:bg-purple-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleClick(request._id, "declined")}
                className="text-xs px-3 py-1 rounded-md bg-gray-600 hover:bg-gray-500"
              >
                Decline
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
