"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { Bars3Icon, ShoppingCartIcon } from "@heroicons/react/24/solid";
import { useAuth } from "@/context/AuthContext";
import { removeCookie } from "@/api/usersApi";
import { useRouter } from "next/navigation";
import FriendsList from "./FriendsList";

export default function Navbar() {
  const [show, setShow] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleLogout = async () => {
    const data = await removeCookie();
    if (data) {
      alert(data.msg);
      logout();
      router.push("/");
    }
  };

  useEffect(() => {
    const instances = tippy("#profileDropdown", {
      content: `
        <div class="dropdown_content">
          <a href="/profile" class="dropdown_item cursor-pointer">Profile</a>
          <a href="/settings" class="dropdown_item cursor-pointer">Settings</a>
          <a class="dropdown_item logout-btn cursor-pointer">Logout</a>
        </div>
      `,
      trigger: "mouseenter focus",
      allowHTML: true,
      interactive: true,
      theme: "custom",
      onMount(instance) {
        const logoutBtn = instance.popper.querySelector(".logout-btn");
        if (logoutBtn) {
          logoutBtn.onclick = () => {
            handleLogout();
            instance.hide();
          };
        }
      },
    });

    return () => {
      instances.forEach((instance) => instance.destroy());
    };
  }, [handleLogout]);

  // Render a loading placeholder while fetching user
  if (loading) {
    return (
      <div className="navbar py-3 w-full px-10 text-center">
        <div>Loading...</div>
      </div>
    );
  }

  const renderUserLinks = () => {
    if (!user) {
      return (
        <Link href="/login" className="bg-purple-800 hover:bg-purple-700 px-4 py-2 rounded-md">
          Sign in
        </Link>
      );
    }

    return (
      <>
        {user?.role >= 1 && (
          <Link href="/developer" className="mr-4 flex flex-col items-center hover:!text-white group">
            Developer
            <hr className="w-0 group-hover:w-[80%] transition-all duration-200" />
          </Link>
        )}
        {user?.role === 2 && (
          <Link href="/admin" className="mr-4 flex flex-col items-center hover:!text-white group">
            Admin
            <hr className="w-0 group-hover:w-[80%] transition-all duration-200" />
          </Link>
        )}
        <Link href="/cart" className="mr-4">
          <ShoppingCartIcon className="h-7 w-7 shake" />
        </Link>
        <button
          id="profileDropdown"
          className="flex items-center px-3 py-1 rounded-md"
          style={{ backgroundColor: "rgb(50, 0, 100)" }}
        >
          <div className="flex items-center">
            <div className="text-left mr-2">
              <div className="text-sm font-bold">{user.username}</div>
              <div className="text-xs font-medium text-center text-gray-300">
                {user.role === 1 && "Developer"}
                {user.role === 2 && "Admin"}
              </div>
            </div>
            <img
              src={user.pfp ? `${API_URL}/${user.pfp}` : "/Placeholder.jpg"}
              className="pfp h-8 w-8 object-cover rounded-xs"
              alt="Profile"
            />
          </div>
        </button>
      </>
    );
  };

  return (
    <>
      {/* Desktop Navbar */}
      <div className="hidden sm:flex navbar py-2 w-full justify-between items-center px-10">
        <div className="flex items-center">
          <Link href="/" className="mr-8 h-10 w-10 rounded-full">
            <img
              src="/Vapour_v2.png"
              className="h-full w-full object-cover rounded-full transform hover:-rotate-16 hover:scale-105 hover:shadow-md shadow-purple-600 transition-all duration-500 ease-in-out"
            />
          </Link>

          {user && (
            <Link href="/collections" className="mr-4 flex flex-col items-center hover:!text-white group">
              Collections
              <hr className="w-0 group-hover:w-[80%] transition-all duration-200" />
            </Link>
          )}

          {user && <FriendsList />}
        </div>

        <div className="flex items-center">{renderUserLinks()}</div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex sm:hidden navbar py-3 w-full items-center flex-col px-10 text-xl">
        {show ? (
          <>
            <Link href="/">Home</Link>
            {user && <Link href="/collections">Collections</Link>}
            {user && <FriendsList />}
            {renderUserLinks()}
            <Bars3Icon
              width={30}
              className="mx-auto hover:border-2 border-purple-700 rounded-md"
              onClick={() => setShow(!show)}
            />
          </>
        ) : (
          <Bars3Icon
            width={30}
            className="ml-auto hover:border-2 border-purple-700 rounded-md"
            onClick={() => setShow(!show)}
          />
        )}
      </div>
    </>
  );
}
