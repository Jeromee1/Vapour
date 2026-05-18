"use client";

import { useState, useEffect } from "react";
import { getMyUser, updateUser } from "@/api/usersApi";
import { PencilIcon } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Spinner from "../Spinner";

export default function SettingsProfileForm({ user }) {
  const [updatedUser, setUpdatedUser] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, files, value } = e.target;

    if (name === "pfp" && files && files.length > 0) {
      setUpdatedUser({ ...updatedUser, pfp: files[0] });
    } else {
      setUpdatedUser({ ...updatedUser, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      text: "Are you sure you want to save changes?",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "gray",
      confirmButtonText: "Save",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "!border-t-2 !border-b-2 !border-purple-500 !bg-gray-900/80 !h-40 !text-white",
      },
    });

    if (result.isConfirmed) {
      try {
        await updateUser(updatedUser);
        const upU = await getMyUser();
        setUpdatedUser(upU);
        toast("Profile updated", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
        });
        router.push("/profile");
      } catch (error) {
        toast("Error updating", {
          theme: "dark",
          position: "bottom-right",
          autoClose: 1000,
          type: "error",
        });
      }
    }
  };

  if (!updatedUser) {
    return <Spinner />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row w-full gap-6">
      <div className="flex justify-center md:justify-start items-center w-full h-full md:w-1/4 relative">
        <div className="h-[150px] w-[150px]">
          <img
            src={
              updatedUser?.pfp instanceof File
                ? URL.createObjectURL(updatedUser.pfp)
                : updatedUser?.pfp
                ? `${API_URL}/${updatedUser.pfp}`
                : "/Placeholder.jpg"
            }
            className="w-full h-full object-cover rounded"
            alt="Profile picture"
          />
        </div>
        <div className="ml-4 md:m-0 lg:ml-4 lg:mr-auto h-15 w-15 md:absolute md:bottom-[-10] md:right-0 lg:static flex justify-center items-center hover:bg-gray-600 bg-gray-700 rounded-lg border-2 border-gray-600">
          <label htmlFor="pfp-upload" className="cursor-pointer flex justify-center items-center">
            <PencilIcon className="size-8 sm:size-11" />
          </label>
          <input
            id="pfp-upload"
            name="pfp"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="w-full h-full hidden"
          />
        </div>
      </div>
      <div className="py-1 flex flex-col w-full md:w-2/3 gap-4">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="fullname">Fullname:</label>
            <input
              name="fullname"
              value={updatedUser.fullname || ""}
              onChange={handleChange}
              type="text"
              placeholder="Fullname"
              className="bg-gray-700 rounded-md border-2 border-gray-600 px-2 py-1 w-full"
            />
          </div>
          <div className="flex flex-col w-full gap-1">
            <label htmlFor="username">Username:</label>
            <input
              name="username"
              value={updatedUser.username || ""}
              onChange={handleChange}
              type="text"
              placeholder="Username"
              className="bg-gray-700 rounded-md border-2 border-gray-600 px-2 py-1 w-full"
            />
          </div>
        </div>
        <div className="flex flex-col w-full gap-1">
          <label htmlFor="username">Bio:</label>
          <textarea
            name="bio"
            value={updatedUser.bio || ""}
            onChange={handleChange}
            type="text"
            placeholder="Write bio here..."
            className="bg-gray-700 rounded-md border-2 border-gray-600 px-2 py-1 resize-none"
          />
        </div>
        <div className="w-50 flex flex-col gap-1">
          <label htmlFor="age">Years of existence:</label>
          <select
            name="age"
            className="p-2 bg-gray-700 w-30 max-h-[200px] overflow-y-auto"
            value={updatedUser.age || ""}
            onChange={handleChange}
          >
            <option value="" disabled>
              none
            </option>
            {Array.from({ length: 90 }, (_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
            <option value="100">Ancient</option>
            <option value="100">Prehistoric</option>
            <option value="100">Fossil</option>
          </select>
        </div>
        <div className="w-full flex justify-center md:justify-end mt-6 gap-2">
          <button
            onClick={() => router.push("/profile")}
            type="button"
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded-md"
          >
            Cancel
          </button>
          <button type="submit" className="bg-green-800 hover:bg-green-700 px-6 py-2 rounded-md">
            Save changes
          </button>
        </div>
      </div>
    </form>
  );
}
