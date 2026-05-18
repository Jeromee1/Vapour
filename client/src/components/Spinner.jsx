export default function Spinner() {
  return (
    <div className="h-[80vh] w-full flex justify-center items-center">
      <div className="w-30 h-30 relative rounded-full">
        <img src="/Vapour_v2.png" className="h-full w-full object-cover" />
        <div className="absolute w-full h-full rounded-full spin bg-black/50 bottom-0 left-0 border-2 border-t-purple-700 border-b-purple-700 border-l-purple-500 border-r-purple-500"></div>
      </div>
    </div>
  );
}
