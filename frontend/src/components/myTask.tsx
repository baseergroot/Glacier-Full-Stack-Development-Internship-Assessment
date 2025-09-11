import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";

const apiUrl = import.meta.env.VITE_API_KEY;

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${apiUrl}/my-tasks`, { withCredentials: true });
        setTasks(res.data.tasks || res.data); // support both shapes
      } catch (err: any) {
        if (err.response?.status === 401) {
          console.warn("401 on /my-tasks — user still logged in, just no tasks");
          setTasks([]);
          return;
        }
        console.error("Error fetching tasks:", err);
      }

    };
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <p className="text-center text-gray-500 py-6">No tasks assigned to you yet.</p>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task._id} className="p-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                {task.title}
              </CardTitle>
              <CardDescription>
                {task.description || "No description"}
              </CardDescription>
              <p className="text-sm text-gray-500 mt-2">
                Team: {task.team?.title || "Unknown"}
              </p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
