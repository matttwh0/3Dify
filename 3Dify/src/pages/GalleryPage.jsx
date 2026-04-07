import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockPopular = [
  { id: 1, name: "Yellow Car", likes: 42 },
  { id: 2, name: "Modern Chair", likes: 28 },
  { id: 3, name: "Statue Scan", likes: 64 },
  { id: 4, name: "Sneaker Model", likes: 19 },
];

const mockFollowing = [
  { id: 5, name: "Robot Arm", likes: 12 },
  { id: 6, name: "Desk Lamp", likes: 8 },
  { id: 7, name: "Coffee Mug", likes: 15 },
];

const mockPublished = [
  { id: 8, name: "My Vase", likes: 5 },
  { id: 9, name: "Mini Statue", likes: 11 },
];

export default function GalleryPage() {
  const [popular] = useState(mockPopular);
  const [following] = useState(mockFollowing);
  const [published] = useState(mockPublished);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-16">

        <h1 className="text-3xl font-mono">
          Gallery
        </h1>

        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search models..."
            className="w-full max-w-md bg-white/5 border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-white/30"
          />
        </div>

        {/* Popular */}
        <HorizontalScroller
          title="Popular"
          projects={popular}
          clickable
          onClick={() => navigate("/gallery/popular")}
        />

        {/* Users You Follow */}
        <HorizontalScroller
          title="Users You Follow"
          projects={following}
        />

        {/* Your Published Projects */}
        <HorizontalScroller
          title="Your Published Projects"
          projects={published}
        />

      </div>
    </div>
  );
}

function HorizontalScroller({ title, projects, clickable, onClick }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2
          onClick={clickable ? onClick : undefined}
          className={`font-mono text-lg ${
            clickable ? "cursor-pointer hover:text-gray-300" : ""
          }`}
        >
          {title}
        </h2>

        {clickable && (
          <button
            onClick={onClick}
            className="text-sm text-gray-400 hover:text-white"
          >
            View All →
          </button>
        )}
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="min-w-[260px] border border-white/10 rounded-xl bg-white/[0.03] p-4 hover:bg-white/[0.06] transition"
          >
            <div className="h-40 bg-black/50 rounded-lg mb-4 flex items-center justify-center text-gray-600 text-xs">
              3D Preview
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="font-mono">
                {p.name}
              </span>
              <span className="text-gray-400">
                ❤️ {p.likes}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}