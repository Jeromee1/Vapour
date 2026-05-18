import Spinner from "./Spinner";
import { useState, useEffect } from "react";

export default function Launcher({ setShowLauncher, showLauncher }) {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    let timer;

    if (showLauncher) {
      setShowSpinner(true);
      timer = setTimeout(() => {
        setShowSpinner(false);
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showLauncher]);

  if (!showLauncher) return null;

  return (
    <>
      <div
        onClick={() => setShowLauncher(false)}
        className="h-[100vh] w-[100vw] bg-black/60 fixed top-0 left-0 z-60"
      ></div>
      <div
        className="fixed left-1/2 transform -translate-x-1/2 h-[80vh] w-[40vw] rounded-xl z-61 flex justify-center items-center"
        style={{ backgroundColor: "rgb(20,10,60)" }}
      >
        {!showSpinner ? (
          <div className="w-100 h-100">
            <img src="/catBreakdance.gif" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center relative">
            <Spinner />
            <h2 className="absolute bottom-20 text-center w-50 !text-gray-500">Launching Game...</h2>
          </div>
        )}
      </div>
    </>
  );
}
