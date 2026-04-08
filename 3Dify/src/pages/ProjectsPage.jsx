import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

/* ---------------- SAMPLE PROJECTS (FOR LOGGED OUT USERS) ---------------- */

const sampleProjects = [
  { id: 1, name: "Sneaker Scan" },
  { id: 2, name: "Coffee Mug" },
  { id: 3, name: "Car Model" },
  { id: 4, name: "Statue" },
  { id: 5, name: "Chair" },
  { id: 6, name: "Head Scan" },
];

export default function ProjectsPage() {
  const { token, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  /* ---------------- FETCH PROJECTS ---------------- */

  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:8000/uploads", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch projects (${res.status})`);
      }

      const data = await res.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setLoading(false);
      return;
    }

    fetchProjects();

    const interval = setInterval(fetchProjects, 8000);
    return () => clearInterval(interval);
  }, [authLoading, token, fetchProjects]);

  /* ---------------- LOGGED OUT VIEW ---------------- */

  if (!token && !authLoading) {
    return (
      <div className="min-h-screen bg-black text-white px-8 py-12">
        <div className="max-w-7xl mx-auto">

          {/* TITLE */}
          <h1 className="text-3xl font-mono mb-10">
            Explore Models
          </h1>

          {/* SAMPLE PROJECTS GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleProjects.map((p) => (
              <div
                key={p.id}
                className="border border-white/10 rounded-xl bg-white/[0.03] p-4"
              >
                <div className="h-40 bg-black/50 rounded-lg mb-4 flex items-center justify-center text-gray-600 text-xs">
                  3D Preview
                </div>

                <p className="font-mono text-sm">
                  {p.name}
                </p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <p className="text-gray-300 mb-4 text-lg">
              Want to create your own 3D model?
            </p>

            <p className="text-gray-500 mb-6">
              Make an account to start modeling.
            </p>

            <div className="flex justify-center gap-4">
              <Link
                to="/signin"
                className="border px-5 py-2 rounded hover:bg-white hover:text-black transition"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="border px-5 py-2 rounded hover:bg-white hover:text-black transition"
              >
                Register
              </Link>
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Loading your projects…
      </div>
    );
  }

  /* ---------------- ERROR ---------------- */

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  /* ---------------- EMPTY STATE ---------------- */

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white px-8 py-12 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-mono mb-4">
          No projects yet
        </h1>

        <Link
          to="/create"
          className="border px-5 py-2 rounded hover:bg-white hover:text-black"
        >
          Create Your First Model
        </Link>
      </div>
    );
  }

  /* ---------------- LOGGED IN PROJECT GRID ---------------- */

  return (
    <div className="min-h-screen bg-black text-white px-8 py-12">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-mono">
            Your Models
          </h1>

          <Link
            to="/create"
            className="text-sm border border-white/20 px-4 py-2 rounded hover:bg-white hover:text-black transition"
          >
            + Create Model
          </Link>
        </div>

        {/* PROJECT GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/projects/${p.id}`)}
              className="cursor-pointer border border-white/10 rounded-xl bg-white/[0.03] p-4 hover:bg-white/[0.06] transition"
            >
              {/* PREVIEW */}
              <div className="h-40 bg-black/50 rounded-lg mb-4 flex items-center justify-center text-gray-600 text-xs">
                3D Preview
              </div>

              {/* INFO */}
              <div className="flex justify-between items-center">
                <span className="font-mono text-sm">
                  {p.name || "Untitled Project"}
                </span>

                <span
                  className={`text-xs ${
                    p.status === "completed"
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}