function Questions({roundData, currentRound, teams, correctScore, currentQuestion, script}) {
  return (
    <div className='container'>
      <div className='col'>
        {script && 
        <div className='row'>
          <div className="card m-2" style={{width: "36rem"}}>
            <div className="card-body">
              <h5 className="card-title">Round {currentRound+1}</h5>
              <p className="card-text">{script.rounds[currentRound].roundIntro}</p>
            </div>
          </div>  
        </div>
        }
        {roundData.questions.map((question, questionIndex) => {
          const isCurrentQuestion = currentQuestion===questionIndex ? 'text-bg-primary' : 'text-bg-tertiary';
          return (
            <div className='row' key={questionIndex}>
              {/* script */}
              {script && 
              <div className={`card m-2 p-0 ${isCurrentQuestion}`} style={{width: "18rem"}} key={`script-${questionIndex}`}>
                <div className='card-body'>
                  <p>{script.rounds[currentRound].questions[questionIndex]}</p>
                </div>
              </div>
              }
              {/* question */}
              <div className="card m-2 p-0" style={{width: "18rem"}} key={`question-${questionIndex}`}>
                <div className={`card-header ${isCurrentQuestion}`}>
                    {question.question}
                </div>
                <ul className="list-group list-group-flush">
                    {teams.map((team, teamIndex) => {
                      const round = team.team.rounds.find(
                        (round) => round.round === currentRound
                      );
                      if(round){
                        const teamAnswer = round.answers[questionIndex].answer;
                        const color = round.answers[questionIndex].isCorrect ? 'text-bg-success' : 'text-bg-danger';
                        return (
                          <li className={`list-group-item ${color}`} key={`team-${teamIndex}`}>
                            {team.team.teamName} - {teamAnswer}
                          </li>
                        );
                      }
                      return null;
                    })}
                </ul>
                <div className="card-footer">
                  {question.answer}
                </div>
              </div>
            </div>
        )})}
        {script && 
        <div className='row'>
          <div className="card" style={{width: "36rem"}}>
            <div className="card-body">
              <h5 className="card-title">{currentRound+1}</h5>
              <p className="card-text">{script.rounds[currentRound].roundOutro}</p>
            </div>
          </div>  
        </div>
        }
      </div>
    </div>
  );
}

export default Questions;