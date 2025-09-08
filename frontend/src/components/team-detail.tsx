import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddMemberModal from "./add-member";
import AddTaskModal from "./create-task";

const apiUrl = import.meta.env.VITE_API_KEY;

export default function TeamDetail() {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showMemberModal, setShowMemberModal] = useState(false);

  // For assigning tasks
  const [taskModal, setTaskModal] = useState({ open: false, assignedTo: null });

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get(`${apiUrl}/team/${id}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setTeam(res.data.team);
          setTasks(res.data.tasks);
        } else {
          setError(res.data.message || "Something went wrong");
        }
      } catch (err) {
        setError("Failed to fetch team details");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [id]);

  if (loading) return <p className="text-center py-8">Loading team...</p>;
  if (error) return <p className="text-center py-8 text-red-500">{error}</p>;
  if (!team) return <p className="text-center py-8">No team found</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      {/* Team Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{team.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            <strong>Admin:</strong> {team.admin?.name} (@{team.admin?.username})
          </p>
        </CardContent>
      </Card>

      {/* Members */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Members</CardTitle>
          <Button size="sm" onClick={() => setShowMemberModal(true)}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-2 gap-2">
            {team.members.map((m) => (
              <li
                key={m._id}
                className="p-3 border rounded-md shadow-sm bg-gray-50 flex justify-between items-center"
              >
                <span>
                  {m.name} <span className="text-gray-500">(@{m.username})</span>
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setTaskModal({ open: true, assignedTo: m.username })
                  }
                >
                  Assign Task
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Tasks */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li
                  key={t._id}
                  className="p-3 border rounded-md shadow-sm flex justify-between bg-white"
                >
                  <span>{t.title}</span>
                  <span className="text-sm text-gray-500">
                    Assigned To: {t.assignedTo?.join(", ") || "None"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks assigned yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddMemberModal
        open={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        teamId={id}
      />

      <AddTaskModal
  open={taskModal.open}
  onClose={() => setTaskModal({ open: false, assignedTo: null })}
  teamId={id}   // ✅ use the id from useParams()
  assignedTo={taskModal.assignedTo}
/>

    </div>
  );
}
