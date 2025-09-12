import AddTaskModal from "./create-task"
import CreateTeamForm from "./create-team"



const myTask = ({ tasks }) => {
  return (
    <div>
      
      <h1>
        Tasks:  {
        tasks.length > 0 ? tasks.map((task) => task.title) : "No tasks assigned to you."
        }
      </h1>
    </div>
  )
}

export default myTask