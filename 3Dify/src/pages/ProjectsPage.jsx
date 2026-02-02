import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProjectsPage() {
  const { token, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setError("You must be signed in to view projects.");
      setLoading(false);
      return;
    }

    fetchProjects();

    const interval = setInterval(fetchProjects, 8000);
    return () => clearInterval(interval);
  }, [authLoading, token, fetchProjects]);

  if (loading) {
    return <p className="p-6">Loading projects…</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (projects.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-xl mb-2">My Projects</h1>
        <p>No projects yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">My Projects</h1>

      <div className="grid gap-4">
        {projects.map((p) => (
          <div
            key={p.id}
            className="border border-white/10 rounded-lg p-4 bg-white/[0.03]"
          >
            <p className="font-mono text-sm">
              {p.name || "Untitled Project"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Status: {p.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
