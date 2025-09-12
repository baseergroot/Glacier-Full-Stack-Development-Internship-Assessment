import { useState } from "react";
import AddMemberForm from "./add-member";
import AddTaskModal from "./create-task";

const TeamCard = ({ teams, user }: any) => {
  console.log("TeamsCard :", teams, user);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">
        Teams
      </h1>

      <section className="  flex flex-col gap-1">
        {teams.length > 0 ? teams.map((team: any) => (
          <div key={team._id} className="bg-blue-300 rounded-xl py-2">
            <div className="flex justify-between items-center px-5 py-4">
              <h2 className="text-lg font-semibold">{team.title}:</h2>
              <AddMemberForm teamId={team._id} />
            </div>
            <div className="h-px bg-gray-200 mx-5 my-5 "></div>
            {/* <h3>{team.admin.username}</h3> */}
            <h4>{team.tasks.length > 0 &&
              team.tasks.map((task: any) => (
                <li key={task._id}>
                  {task.title}
                </li>
              ))
            }</h4>
            <h5>

              {
                team.members.map((member: any) => (
                  <li key={member._id} className="flex justify-center">
                   
                   <div className="space-y-3 my-0.5">
                      {
                         

                        member._id === team.admin._id ? (
                          <span className="font-bold">Admin: {member.username}</span>
                        ) :

                          <section className="bg-blue-400 rounded px-5 py-2">
                            <span className="bg-red-400 px-2 py-1 rounded text-white">
                              {member.username}
                            </span>
                            <button
                              className="ml-5 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-900 text-sm"
                              onClick={() => setSelectedMember(member._id)}
                            >
                              Assign Task
                            </button>
                          </section>
                          
                      }
                      </div>

                      {/* Modal opens when a member is selected */}
                      {selectedMember && (
                        <AddTaskModal
                          open={!!selectedMember}
                          onClose={() => setSelectedMember(null)}
                          teamId={team._id}
                          assignedTo={selectedMember}
                        />
                      )}
                    

                  </li>
                ))
              }</h5>
          </div>
        )) : "No teams "}
      </section>
    </div>
  )
}

export default TeamCard