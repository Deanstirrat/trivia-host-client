import Questions from './game_display_elements/Questions';
import Scoreboard from './game_display_elements/Scoreboard';

function GameDisplay({game, nextRound, correctScore, setFocusedGame, nextQuestion, generateScript}) {
  return (
    <div>
      <button type="button" className="btn btn-secondary" onClick={()=>setFocusedGame(null)}>Back</button>
      <button type="button" className="btn btn-info" onClick={()=>generateScript()}>generate script</button>
      {game.currentRound===-1 && <h2>'Waiting to begin'</h2>}

      {/* Questions */}
      {game && game.currentRound>-1 && game.currentRound<game.quiz.questionSet.rounds.length && 
        <Questions 
          roundData={game.quiz.questionSet.rounds[game.currentRound]} 
          currentRound={game.currentRound} 
          teams={game.teams} 
          correctScore={correctScore} 
          currentQuestion={game.currentQuestion}
          script={game.script}
        />
      }
      {/* script */}
      {game && game.script && game.currentRound===-1 && <h4>{game.script.gameIntro}</h4>}
      {game && game.script && game.currentRound===game.quiz.questionSet.rounds.length && <h4>{game.script.gameOutro}</h4>}


      {/* SCOREBOARD */}
      <Scoreboard teams={game.teams}/>

      {game && game.currentRound>-1 && game.currentRound<game.quiz.questionSet.rounds.length && <button type="button" className="btn btn-primary" onClick={nextQuestion} disabled={game.currentQuestion>=game.quiz.questionSet.rounds[game.currentRound].questions.length-1}>Next Question</button>}
      {game && game.currentRound<game.quiz.questionSet.rounds.length-1 && <button type="button" className="btn btn-primary" onClick={nextRound} disabled={game.currentRound>-1 && game.currentQuestion<game.quiz.questionSet.rounds[game.currentRound].questions.length-1}>Next Round</button>}
      {game && game.currentRound===game.quiz.questionSet.rounds.length-1  && <button type="button" className="btn btn-success" onClick={nextRound} disabled={game.currentRound>-1 && game.currentQuestion<game.quiz.questionSet.rounds[game.currentRound].questions.length-1}>End Game</button>}
    </div>
  );
}

export default GameDisplay;
