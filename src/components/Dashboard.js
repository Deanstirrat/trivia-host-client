import { useState, useEffect } from 'react';
import { useAuth } from '../components/AuthProvider';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
// import styled from 'styled-components';
import GameList from './GameList';
import GameDisplay from './GameDisplay';
import NewGameForm from './NewGameForm';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [games, setGames] = useState([]);
  const [ focusedGame, setFocusedGame ] = useState(null);
  const [newGame, setNewGame] = useState(false);

  //update local socket on mount
  useEffect(() => {
    const newSocket = io('https://trivia-backend.fly.dev');
    newSocket.on('connect' , () => {
      setSocket(newSocket);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  //set socket listeners
  useEffect(() => {
    if(socket){
      //handle team data request
      socket.on('requestGameData', async (data) => {
        console.log('team requested game data');
        try {
          //find game that has team in it
          const gameWithTeam = games.find(game => game.teams.some(team => team.team._id === data.teamId));
          if(gameWithTeam){
            //send game data to the team via socket
            gameWithTeam.teams.forEach((team) => {
              if(team.team._id===data.teamId) {
                socket.emit('updateTeamClient', {gameData: gameWithTeam, teamSocket: team.socketId});
                console.log(`sent updated data to ${team.socketId}`);
              }
            });
          }
        } catch (error) {
          console.error(error);
        }
      });
    }
  }, [socket, games]);

  //game altering socket listeners
  useEffect(() => {
    if(socket){
      //handle team joined
      socket.on('teamJoined', async (data) => {
        console.log('new team joined');
        try {
          //fetch game data
          const response = await fetch(`http://localhost:3000/games/${data}`, {
              headers: {
                  'Content-Type': 'application/json',
                }
          });
          const responseData = await response.json();
          
          // Update the game in the games state
          setGames(prevGames => {
            const updatedGames = prevGames.map(game => {
              if (game._id === responseData._id) {
                return responseData;
              }
              return game;
            });
            return updatedGames;
          });
  
          // tell server to update teams with new data
          socket.emit('updateTeamClients', {updatedGame: responseData});
  
        } catch (error) {
          console.error(error);
        }
      });
      //handle game update
      socket.on('updateGameData', ({updatedGame}) => {
        console.log('update game')
        setGames(prevGames => {
          const updatedGames = prevGames.map(game => {
            if (game._id === updatedGame._id) {
              return updatedGame;
            }
            return game;
          });
          return updatedGames;
        });
      })
    }
  }, [socket]);

  //update server with socketId on change
  useEffect(() => {
    if (socket) {
      console.log('share updated socketId:' + socket.id);
      socket.emit('updateHostSocketId', { socketId: socket.id, hostId: user.userId});
    }
  }, [socket, user]);

  //get games user is host of on load/new game/socket change
  useEffect(() => {
    const fetchGames = async () => {
      console.log('fetch games');
      try {
        const response = await fetch(`https://trivia-backend.fly.dev/hosts/${user.userId}`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json',
              }
        });
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error(error);
      }
    };

    if(socket) fetchGames();
  }, [user, newGame, socket]);

  //update focused game on games update
  useEffect(() => {
    if(focusedGame){
      const updatedFocusedGame = games.find(game => game._id === focusedGame._id);
      setFocusedGame(updatedFocusedGame);
    }
  }, [games])

  if (!user) {
    navigate('/login');
    return null;
  }

  //increment round
  const nextRound = () => {
    console.log('next round');
    if (focusedGame) {
      const updatedGame = { ...focusedGame, currentRound: focusedGame.currentRound + 1, currentQuestion: -1};
      setGames(prevGames => {
        const updatedGames = prevGames.map(game => {
          if (game._id === updatedGame._id) {
            return updatedGame;
          }
          return game;
        });
        return updatedGames;
      });
      socket.emit('incrementRound', { gameData: updatedGame });
    }
  }

  //increment question
  const nextQuestion = () => {
    console.log('next question');
    if (focusedGame && focusedGame.currentQuestion < focusedGame.quiz.questionSet.rounds[focusedGame.currentRound].questions.length) {
      const updatedGame = { ...focusedGame, currentQuestion: focusedGame.currentQuestion + 1 };
      setGames(prevGames => {
        const updatedGames = prevGames.map(game => {
          if (game._id === updatedGame._id) {
            return updatedGame;
          }
          return game;
        });
        return updatedGames;
      });
      socket.emit('incrementQuestion', { gameData: updatedGame });
    }
  }

  //Correct auto scoring for user answer
  const correctScore = ({teamId, roundNumber, questionIndex, newVal}) => {
    console.log('correcting score')

     // Find the game with the matching id
     const updatedGames = games.map(game => {
      if (game._id === focusedGame._id) {
        const updatedTeams = game.teams.map(team => {
          if (team.team._id === teamId) {
            const updatedRounds = team.team.rounds.map((round, index)=> {
              if (index === roundNumber) {
                const updatedAnswers = round.answers.map((answer, index) => {
                  if (index === questionIndex) {
                    return { ...answer, isCorrect: newVal };
                  }
                  return answer;
                });
                return { ...round, answers: updatedAnswers };
              }
              return round;
            });
            return { ...team, team: {...team.team, rounds: updatedRounds }};
          }
          return team;
        });
        return { ...game, teams: updatedTeams };
      }
      return game;
    });

    //update server with correct score
    socket.emit('correctScore', {
      teamId,
      roundNumber,
      answers: updatedGames
        .find(game => game._id === focusedGame._id)
        .teams.find(team => team.team._id === teamId)
        .team.rounds[roundNumber]
        .answers
    });

    setGames(updatedGames);
  }

  //generate script
  const generateScript = () => {
    console.log('generate script');
    socket.emit('generateScript', { gameId: focusedGame._id });
  }

  // debuggin
  // useEffect(() => {
  //   console.log('updated games:');
  //   console.log(games);
  // }, [games])

  // useEffect(() => {
  //   console.log('updated focused game:');
  //   console.log(focusedGame);
  // }, [focusedGame])

  return (
    <div>
        { focusedGame && 
          <GameDisplay
            game={focusedGame} 
            nextRound={nextRound} 
            correctScore={correctScore} 
            setFocusedGame={setFocusedGame} 
            nextQuestion={nextQuestion} 
            generateScript={generateScript}
          />
        }
        { !focusedGame && 
          <NewGameForm 
            socket={socket} 
            setNewGame={setNewGame} 
            newGame={newGame}
          />
        }
        { !focusedGame && 
          <GameList 
            games={games} 
            setFocusedGame={setFocusedGame}
          />
        }
    </div>
  );
}

export default Dashboard;
