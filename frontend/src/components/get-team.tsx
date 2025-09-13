import { useState } from "react";
import { Users, Plus, Crown, CheckCircle, Calendar, User } from "lucide-react";
import AddMemberForm from "./add-member";
import AddTaskModal from "./create-task";

const TeamCard = ({ teams, user }: any) => {
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Teams
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Collaborate, manage, and achieve greatness together
          </p>
        </div>

        {(!teams || teams.length === 0) ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-500 text-xl mb-4">No teams yet</p>
            <p className="text-gray-400">Create your first team to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team._id}
                className="group bg-white/70 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Team Header */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {team.title}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users size={16} />
                      <span>{team.members.length} members</span>
                    </div>
                  </div>
                  <AddMemberForm teamId={team._id} />
                </div>

                {/* Tasks Section */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Calendar size={16} className="text-blue-500" />
                      Tasks
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                      {team.tasks.length}
                    </span>
                  </div>
                  
                  {team.tasks.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {team.tasks.map((task: any) => (
                        <div
                          key={task._id}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <CheckCircle 
                            size={16} 
                            className={task.completed ? "text-green-500" : "text-gray-300"} 
                          />
                          <span className={`text-sm flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                            {task.title}
                            <span className="mx-5 ">-</span>
                            <span className="text-blue-400 text-lg">{task.assignedTo.username}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      <Calendar size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tasks yet</p>
                    </div>
                  )}
                </div>

                {/* Members Section */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <User size={16} className="text-indigo-500" />
                    Members
                  </h3>
                  
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {team.members.map((member) => (
                      <div key={member._id} className="flex items-center justify-between">
                        {member._id === team.admin._id ? (
                          <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-full flex-1">
                            <Crown size={16} className="text-yellow-600" />
                            <span className="font-semibold text-yellow-800 text-sm">
                              {member.username}
                            </span>
                            <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full ml-auto">
                              Admin
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {member.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {member.username}
                              </span>
                            </div>
                            <button
                              className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 shadow-sm hover:shadow-md"
                              onClick={() => {
                                setSelectedMember(member._id)
                                setSelectedTeam(team._id)
                              }}
                            >
                              Assign Task
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Task Assignment Modal */}
        {selectedMember && (
          <AddTaskModal
            open={!!selectedMember}
            onClose={() => setSelectedMember(null)}
            teamId={selectedTeam}
            assignedTo={selectedMember}
          />
        )}
      </div>
    </section>
  );
};

export default TeamCard;