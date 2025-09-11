import { useState } from "react";
import CreateTeamForm from "./create-team";
import AddTaskModal from "./create-task";
import MyTasks from "./myTask";
import TeamsCard from "./get-team";
import { Button } from "./ui/button";
import axios from "axios";

type Props = {
  tasks: { _id: string; title: string }[];
  teams: { _id: string; title: string }[];
};

export default function DashboardCard({ tasks, teams }: Props) {
    const [tasksData, setTasksData] = useState(tasks);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const handleCreateTeam = async () => {
    const response = await axios.post(`${import.meta.env.VITE_API_KEY}/create/team`, {
      title: "New Team",
    }, { withCredentials: true });
    
  }

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Heading */}
        <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          <span className="block text-blue-600">Dashboard</span>
        </h1>

        {/* Action buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <Button onClick={() => setShowTeamModal(true)}>+ Create Team</Button>
          {teams.length > 0 && (
            <Button onClick={() => setShowTaskModal(true)}>+ Add Task</Button>
          )}
        </div>

        {/* Create Team Modal */}
        {showTeamModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                onClick={() => setShowTeamModal(false)}
              >
                ✕
              </button>
              <CreateTeamForm
                onCancel={() => setShowTeamModal(false)}
                onTeamCreated={() => setShowTeamModal(false)}
              />
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {showTaskModal && teams.length > 0 && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                onClick={() => setShowTaskModal(false)}
              >
                ✕
              </button>
              <AddTaskModal
                open={showTaskModal}
                onClose={() => setShowTaskModal(false)}
                teamId={teams[0]._id} // placeholder
                assignedTo={"some-user-id"} // placeholder
              />
            </div>
          </div>
        )}

        {/* Task list & Teams list */}
        <MyTasks tasks={tasks} />
        <TeamsCard teams={teams} />
      </div>
    </section>
  );
}
