import { useState } from "react";
import CreateTeamForm from "./create-team";
import AddTaskModal from "./create-task";
import MyTasks from "./myTask";
import TeamsCard from "./get-team";
import { Button } from "./ui/button";

type Props = {
  tasks: { _id: string; title: string }[];
  teams: { _id: string; title: string }[];
  user: any
};

export default function DashboardCard({ tasks, teams, user }: Props) {
  console.log("Tasks and teams dash card:", tasks, teams);
    const [tasksData, setTasksData] = useState(tasks);
    const [teamsData, setTeamsData] = useState(teams);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

    // const handleTask = async () => {
    //   const response = await axios.post(`${import.meta.env.VITE_API_KEY}/team/add/task`, {
    //     title: "New Task",
    //   }, { withCredentials: true });
      
    // }

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

        <TeamsCard teams={teams} user={user} />
        <MyTasks tasks={tasks} />
        
      </div>
    </section>
  );
}
