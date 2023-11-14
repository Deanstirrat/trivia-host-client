
function Scoreboard({teams}) {

    const sortedTeams = teams.sort((a, b) => b.score - a.score);
  
    return (
        <div>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        <th scope="col">Score</th>
                    </tr>
                </thead>
                <tbody>
                {sortedTeams.map((team, index) => (
                    <tr key={team._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{team.team.teamName}</td>
                    <td>{team.score}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
  }
  
  export default Scoreboard;