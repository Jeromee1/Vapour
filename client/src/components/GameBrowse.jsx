export default function GameBrowse() {
  const recommended = ["By Friends"];
  const categories = ["Top Sellers", "New Releases"];
  const genre = [
    "Free to Play",
    "Early Access",
    "Action",
    "Adventure",
    "Casual",
    "Indie",
    "Racing",
    "RPG",
    "Sandbox",
    "Simulation",
    "Sports",
    "Strategy",
    "Survival",
    "Horror",
  ];

  return (
    <div className="flex flex-col">
      <div className="flex flex-col p-4">
        <h2 className="font-bold text-lg">CATEGORY</h2>
        {categories.map((cat) => (
          <a key={cat} href="#gameList" className="text-gray-600 hover:underline">
            {cat}
          </a>
        ))}
      </div>
      <div className="flex flex-col p-4">
        <h2 className="font-bold text-lg">GENRE</h2>
        {genre.map((gen) => (
          <a
            key={gen}
            href={`categories/${gen.trim().replace(/\s+/g, "").toLowerCase()}`}
            className="text-gray-600 hover:underline"
          >
            {gen}
          </a>
        ))}
      </div>
    </div>
  );
}
