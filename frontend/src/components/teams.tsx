import axios from "axios";
import { useEffect, useState } from "react";

export default function Teams({currentUser}) {
    console.log("Current User in Teams component:", currentUser);
  const apiUrl = import.meta.env.VITE_API_KEY;
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await axios.get(`${apiUrl}/teams`, {
          withCredentials: true,
        });
        console.log("Teams response:", response.data);
        setTeams(response.data.teams || []);
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to fetch teams");
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [apiUrl]);

  if (loading) {
    return <p>Loading teams...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (teams.length === 0) {
    return <p>No teams found</p>;
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Your Teams</h2>
      <ul className="space-y-2">
        {teams.map((team) => (
          <li
            key={team._id}
            className="border p-3 rounded-md shadow-sm bg-white"
          >
            <h3 className="font-semibold">{team.title}</h3>
            <p className="text-sm text-gray-600">
              Admin: {team.admin?.username || "Unknown"}
            </p>
            <p className="text-sm text-gray-600">
              Members:{" "}
              {team.members?.map((m) => m.username).join(", ") || "No members"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
