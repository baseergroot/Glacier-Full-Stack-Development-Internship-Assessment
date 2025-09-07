import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Dashboard = () => {
  const apiUrl = import.meta.env.VITE_API_KEY;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // form states
  const [teamTitle, setTeamTitle] = useState("");
  const [memberTeamId, setMemberTeamId] = useState("");
  const [memberUserId, setMemberUserId] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskAssigned, setTaskAssigned] = useState("");
  const [taskTeamId, setTaskTeamId] = useState("");

  // ✅ Check authentication
  useEffect(() => {
    axios
      .get(`${apiUrl}/user/isauthenticated`, { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [apiUrl]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-xl">
              Please log in first
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // ✅ Handlers
  const createTeam = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${apiUrl}/create/team`,
        { title: teamTitle },
        { withCredentials: true }
      );
      setTeamTitle("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `${apiUrl}/team/members/add`,
        { teamId: memberTeamId, userId: memberUserId },
        { withCredentials: true }
      );
      setMemberTeamId("");
      setMemberUserId("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${apiUrl}/team/add/task`,
        {
          title: taskTitle,
          description: taskDesc,
          assignedTo: taskAssigned,
          teamId: taskTeamId,
        },
        { withCredentials: true }
      );
      setTaskTitle("");
      setTaskDesc("");
      setTaskAssigned("");
      setTaskTeamId("");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-6">
      <h1 className="text-2xl font-bold mb-6">
        Welcome, <span className="text-primary">{user.username}</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Create Team */}
        <Card>
          <CardHeader>
            <CardTitle>Create Team</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createTeam} className="space-y-4">
              <Input
                value={teamTitle}
                onChange={(e) => setTeamTitle(e.target.value)}
                placeholder="Team title"
              />
              <Button type="submit" className="w-full">
                Create
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ✅ Add Member */}
        <Card>
          <CardHeader>
            <CardTitle>Add Member</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addMember} className="space-y-4">
              <Input
                value={memberTeamId}
                onChange={(e) => setMemberTeamId(e.target.value)}
                placeholder="Team ID"
              />
              <Input
                value={memberUserId}
                onChange={(e) => setMemberUserId(e.target.value)}
                placeholder="User ID"
              />
              <Button type="submit" className="w-full">
                Add Member
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* ✅ Create Task */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Create Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={createTask} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="Task title"
              />
              <Input
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
                placeholder="Description"
              />
              <Input
                value={taskAssigned}
                onChange={(e) => setTaskAssigned(e.target.value)}
                placeholder="Assigned User ID"
              />
              <Input
                value={taskTeamId}
                onChange={(e) => setTaskTeamId(e.target.value)}
                placeholder="Team ID"
              />
              <Button type="submit" className="md:col-span-2 w-full">
                Create Task
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
