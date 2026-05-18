"use client";

import { useState, useEffect } from "react";
import { getMyUser } from "@/api/usersApi";
import SettingsProfileForm from "@/components/forms/SettingsProfileForm";
import { ToastContainer } from "react-toastify";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(null);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const fetchUser = async () => {
      try {
        const userData = await getMyUser();
        if (userData) {
          setUser(userData);
          setLoading(false);
        } else {
          router.push("/");
          return;
        }
      } catch (e) {
        console.error("Failed to fetch user:", e);
      }
    };

    fetchUser();
  }, []);

  if (loading || !user) {
    return <Spinner />;
  }

  return (
    <div className="px-5 sm:px-15 pt-10 pb-40 w-full h-full bg-gradient-to-t from-black to-purple-600/20">
      <h2 className="text-4xl mb-6 text-center w-full">Settings</h2>
      <div className="bg-gray-950/50 p-10 rounded-xl">
        <SettingsProfileForm user={user} />
      </div>
      <ToastContainer />
    </div>
  );
}
