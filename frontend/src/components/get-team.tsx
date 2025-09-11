
const Team = ({ teams }) => {
  return (
    <div>
      <h1>
        Teams:  {teams > 1 ? teams.map((team) => team.title) : "No teams "}
      </h1>

    </div>
  )
}

export default Team