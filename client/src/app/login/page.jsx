"use client";

import { useState } from "react";
import { login } from "@/api/usersApi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { EyeIcon } from "@heroicons/react/24/solid";

export default function Login() {
  const { setUser: setUserData } = useAuth();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let data = await login(user);

    if (!data.success) {
      alert(data.msg);
      return;
    }

    try {
      setUserData(data.data.user);
      router.push("/");
    } catch (e) {
      alert("Something went wrong", e);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="shadow-lg rounded-lg p-8 py-10 w-full max-w-2xl grid grid-cols-12 gap-y-6 gap-x-4"
        style={{ backgroundColor: "rgb(10, 0, 50)" }}
      >
        <h2 className="col-span-12 text-2xl font-bold text-center">Login</h2>

        <div className="col-span-12 sm:col-span-6 sm:col-start-4">
          <label htmlFor="username" className="block text-sm-center font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={user.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none border-gray-500 bg-gray-800"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 sm:col-start-4">
          <label htmlFor="password" className="block text-sm-center font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={user.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none border-gray-500 bg-gray-800"
            />
            <span
              className="absolute right-4"
              style={{ top: "35%", color: "rgba(0,0,0, 0.3)" }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {!showPassword ? <EyeIcon className="size-5" /> : <EyeIcon className="size-5" fill="gray" />}
            </span>
          </div>
        </div>

        <div className="col-span-12 sm:col-span-6 sm:col-start-4">
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Sign in
          </button>
          <div className="w-full flex mt-4 text-sm justify-center">
            <h2 className="!text-gray-400">
              Don't have an account?{" "}
              <a href="/register" className="!text-blue-500 hover:underline">
                Sign Up
              </a>
            </h2>
          </div>
        </div>
      </form>
    </div>
  );
}
