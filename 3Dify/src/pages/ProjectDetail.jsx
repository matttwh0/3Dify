import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProjectDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    fetch(`http://localhost:8000/uploads/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setProject)
      .catch(() => setError("Failed to load project"));
  }, [id, token]);

  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!project) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl mb-2">Project {project.id}</h1>
      <p>Status: {project.status}</p>
    </div>
  );
}
