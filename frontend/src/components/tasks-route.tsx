import axios from "axios";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TasksRoute() {
  const apiUrl = import.meta.env.VITE_API_KEY;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${apiUrl}/my-tasks`, {
          withCredentials: true,
        });
        setTasks(response.data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [apiUrl]);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (tasks.length === 0) return <p>No tasks assigned to you.</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      {tasks.map((task) => (
        <Card key={task._id} className="border shadow-sm bg-white hover:bg-gray-50 transition">
          <CardHeader>
            <CardTitle className="text-lg font-bold">{task.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}
            <p className="text-sm text-gray-700">
              <span className="font-medium">Team:</span> {task.team?.title || "N/A"}
            </p>
            <p className="text-sm">
              <span className="font-medium">Status:</span>{" "}
              <span
                className={
                  task.status === "done"
                    ? "text-green-600"
                    : task.status === "in-progress"
                    ? "text-yellow-600"
                    : "text-gray-600"
                }
              >
                {task.status}
              </span>
            </p>
            {task.dueDate && (
              <p className="text-sm text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
