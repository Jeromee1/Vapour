"use client";

import AddGameForm from "@/components/forms/AddGameForm";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function addGame() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/");
        return;
      }

      if (user.role < 1) {
        router.push("/");
      }
    }
  }, [user, router]);

  return (
    <div className="px-15 py-10 h-full w-full bg-gradient-to-t from-black to-purple-600/50">
      <h2 className="text-3xl text-center !text white mb-6">Add Game</h2>
      <AddGameForm />
      <ToastContainer />
    </div>
  );
}
