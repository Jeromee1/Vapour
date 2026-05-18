"use client";

import { useState, useEffect, useRef } from "react";
import { getMyUser, getAllUsers } from "@/api/usersApi";
import { fetchFriendRequestsOut, fetchFriendRequestsIn } from "@/api/friendsApi";
import Draggable from "react-draggable";
import Friends from "./Friends";
import AddFriends from "./AddFriends";
import FriendRequest from "./FriendRequest";
import { ToastContainer } from "react-toastify";

export default function FriendsList() {
  const [user, setUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [showing, setShowing] = useState("friends");
  const nodeRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const [friendRequestsOut, setFriendRequestsOut] = useState([]);
  const [friendRequestsIn, setFriendRequestsIn] = useState([]);

  const fetchUser = async () => {
    const data = await getMyUser();
    setUser(data);
  };
  const fetchAllUsers = async () => {
    const data = await getAllUsers();
    setAllUsers(data);
  };
  const fetchRequestsIn = async () => {
    const data = await fetchFriendRequestsIn();
    setFriendRequestsIn(data);
  };
  const fetchRequestsOut = async () => {
    const data = await fetchFriendRequestsOut();
    setFriendRequestsOut(data);
  };

  useEffect(() => {
    fetchUser();
    fetchAllUsers();
    fetchRequestsIn();
    fetchRequestsOut();
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [friendRequestsIn, friendRequestsOut]);

  const renderContent = () => {
    switch (showing) {
      case "friends":
        return <Friends user={user} fetchUser={fetchUser} />;
      case "add friends":
        return (
          <AddFriends
            user={user}
            allUsers={allUsers}
            friendRequestsOut={friendRequestsOut}
            friendRequestsIn={friendRequestsIn}
            fetchRequestsIn={fetchRequestsIn}
            fetchRequestsOut={fetchRequestsOut}
          />
        );
      case "friend requests":
        return <FriendRequest user={user} friendRequestsIn={friendRequestsIn} fetchRequestsIn={fetchRequestsIn} />;
      default:
        return <Friends user={user} />;
    }
  };

  return (
    <>
      {!loading && (
        <button
          onClick={() => setShow(!show)}
          className="cursor-pointer  flex flex-col items-center hover:!text-white group"
        >
          Friends
          <hr className="w-0 group-hover:w-[80%] transition-all duration-200" />
        </button>
      )}
      {show && (
        <Draggable
          nodeRef={nodeRef}
          handle=".handle"
          defaultPosition={{
            x: typeof window !== "undefined" ? window.innerWidth / 2 - 200 : 0,
            y: typeof window !== "undefined" ? window.innerHeight / 2 - 150 : 0,
          }}
        >
          <div
            ref={nodeRef}
            className="fixed z-99 handle w-80 h-[500px]"
            style={{
              backgroundColor: "rgb(20,20,20)",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="flex flex-col p-4 relative h-full" style={{ backgroundColor: "rgb(35,35,35)" }}>
              <div
                className="absolute top-0 right-2 !text-gray-500 text-2xl cursor-pointer hover:!text-gray-300"
                onClick={() => setShow(false)}
              >
                x
              </div>
              <h2
                className="!text-purple-500 h-10 flex justify-center items-center"
                style={{ backgroundColor: "rgb(20,20,20)" }}
              >
                Friends
              </h2>
              <div className="border-y border-purple-700 flex">
                <button
                  className={`px-2 py-1 text-xs w-1/3 cursor-pointer ${
                    showing === "friends" ? "bg-purple-800" : "bg-none hover:bg-purple-800"
                  }`}
                  onClick={() => setShowing("friends")}
                >
                  Friends ({user.friends.length})
                </button>
                <button
                  className={`px-2 py-1 text-xs w-1/3 cursor-pointer ${
                    showing === "add friends" ? "bg-purple-800" : "bg-none hover:bg-purple-800"
                  }`}
                  onClick={() => setShowing("add friends")}
                >
                  Add Friends
                </button>
                <button
                  className={`px-2 py-1 text-xs w-1/3 cursor-pointer ${
                    showing === "friend requests" ? "bg-purple-800" : "bg-none hover:bg-purple-800"
                  }`}
                  onClick={() => setShowing("friend requests")}
                >
                  Friend Requests ({friendRequestsIn.length})
                </button>
              </div>
              <div className="h-full overflow-y-auto">{renderContent()}</div>
            </div>
          </div>
        </Draggable>
      )}
      <ToastContainer />
    </>
  );
}
