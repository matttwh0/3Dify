import { useState } from "react";

const mockPopular = [
  { id: 1, name: "Yellow Car", likes: 42 },
  { id: 2, name: "Modern Chair", likes: 28 },
  { id: 3, name: "Statue Scan", likes: 64 },
  { id: 4, name: "Sneaker Model", likes: 19 },
];

export default function PopularPage() {
  const [popular] = useState(mockPopular);

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-7xl mx-auto space-y-12">

        <h1 className="text-3xl font-mono">
          Popular Works
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {popular.map((p) => (
            <div
              key={p.id}
              className="border border-white/10 rounded-xl bg-white/[0.03] p-4 hover:bg-white/[0.06] transition"
            >
              <div className="h-48 bg-black/50 rounded-lg mb-4 flex items-center justify-center text-gray-600 text-xs">
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
    </div>
  );
}