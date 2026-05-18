"use client";

import { useState } from "react";
import { register } from "@/api/usersApi";
import { useRouter } from "next/navigation";

export default function Register() {
  const [user, setUser] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (user.password.length < 8) return alert("Password must be at least 8 characters");
    if (user.password !== user.password2) return alert("Passwords must match");

    register(user);
    console.log("Submitted");
    router.push("/login");
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        className="shadow-lg rounded-lg p-8 w-full max-w-2xl grid grid-cols-12 gap-y-6 gap-x-4"
        style={{ backgroundColor: "rgb(10, 0, 50)" }}
        onSubmit={handleSubmit}
      >
        <h2 className="col-span-12 text-2xl font-bold text-center mb-4">Register</h2>

        <div className="col-span-12 sm:col-span-6 sm:col-start-4">
          <label htmlFor="fullname" className="block text-sm font-medium mb-1">
            Fullname
          </label>
          <input
            required
            id="fullname"
            name="fullname"
            type="text"
            value={user.fullname}
            onChange={handleChange}
            className=" w-full px-4 py-2 border rounded-md focus:outline-none border-gray-500 bg-gray-800"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 sm:col-start-4">
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            required
            id="username"
            name="username"
            type="text"
            value={user.username}
            onChange={handleChange}
            className=" w-full px-4 py-2 border rounded-md focus:outline-none border-gray-500 bg-gray-800"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 sm:col-start-4">
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            required
            id="email"
            name="email"
            type="email"
            value={user.email}
            onChange={handleChange}
            className=" w-full px-4 py-2 border rounded-md focus:outline-none border-gray-500 bg-gray-800"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 sm:col-start-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            required
            id="password"
            name="password"
            type="password"
            value={user.password}
            onChange={handleChange}
            className=" w-full px-4 py-2 border rounded-md focus:outline-none border-gray-500 bg-gray-800"
          />
        </div>

        <div className="col-span-12 sm:col-span-6 sm:col-start-4">
          <label htmlFor="password2" className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            required
            id="password2"
            name="password2"
            type="password"
            value={user.password2}
            onChange={handleChange}
            className=" w-full px-4 py-2 border rounded-md focus:outline-none border-gray-500 bg-gray-800"
          />
        </div>
        <div className="col-span-12 sm:col-span-6 sm:col-start-4">
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Sign Up
          </button>
          <div className="w-full flex mt-4 text-sm justify-center">
            <h2 className="!text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="!text-blue-500 hover:underline">
                Sign In
              </a>
            </h2>
          </div>
        </div>
      </form>
    </div>
  );
}
