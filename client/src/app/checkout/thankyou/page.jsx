"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ThankYouPage() {
  const [remaining, setRemaining] = useState(5);
  const router = useRouter();

  useEffect(() => {
    if (remaining === 0) {
      router.push("/collections");
      return;
    }

    const timer = setTimeout(() => {
      setRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [remaining, router]);

  return (
    <div className="w-full h-115 flex justify-center items-center">
      <div
        className="gap-4 p-6 w-80 h-50 shadow-lg shadow-purple-950 rounded-xl border-2 border-purple-950 flex flex-col justify-center items-center"
        style={{ backgroundColor: "rgba(10,0,50,0.8)" }}
      >
        <h2 className="text-center font-bold">Your transaction was successful.</h2>
        <h2 className="text-center text-xs !text-gray-500">The games are now available in your library.</h2>
        <h2 className="text-center">Redirecting in {remaining}s...</h2>
      </div>
    </div>
  );
}
