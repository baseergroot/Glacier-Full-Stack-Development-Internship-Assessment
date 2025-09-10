import { useState, useEffect } from "react";
import { Users, User, Crown, Plus } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateTeamForm from "./create-team";

export default function TeamsCard() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false); // toggle create form
  const apiUrl = import.meta.env.VITE_API_KEY;
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/teams`, {
        withCredentials: true,
      });
      const data = response.data;

      if (data.success) {
        setTeams(data.teams);
      } else {
        setError("Failed to fetch teams");
      }
    } catch (err) {
      setError("Error fetching teams");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // when a new team is created, update list immediately
  const handleTeamCreated = (newTeam) => {
    setTeams((prev) => [...prev, newTeam]);
    setShowCreateForm(false);
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg shadow-sm border p-6 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchTeams}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">My Teams</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Team
        </button>
      </div>

      {/* Show form if button is clicked */}
      {showCreateForm && (
        <CreateTeamForm
          onTeamCreated={handleTeamCreated}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <div
            key={team._id}
            className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              {/* Team Name */}
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {team.name}
                </h3>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-blue-600" />
                </div>
              </div>

              {/* Admin Info */}
              <div className="flex items-center gap-2 mb-3">
                <Crown className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600">Admin:</span>
                <span className="text-sm font-medium text-gray-900">
                  {team.admin?.name || "Unknown"}
                </span>
              </div>

              {/* Members Count */}
              <div className="flex items-center gap-2 mb-4">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {team.members?.length || 0} members
                </span>
              </div>

              {/* Members List (First 3) */}
              {team.members && team.members.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Members:</p>
                  <div className="space-y-1">
                    {team.members.slice(0, 3).map((member) => (
                      <div
                        key={member._id}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {member.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span>{member.name}</span>
                        <span className="text-gray-400">@{member.username}</span>
                      </div>
                    ))}
                    {team.members.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{team.members.length - 3} more members
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-4 pt-4 border-t">
                <button
                  onClick={() => navigate(`/team/${team._id}`)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Team
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {teams.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams found</h3>
          <p className="text-gray-500">You're not a member of any teams yet.</p>
        </div>
      )}
    </div>
  );
}
