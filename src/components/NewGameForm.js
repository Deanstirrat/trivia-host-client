import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';

const NewGameForm = ({socket, setNewGame, newGame}) => {

    const { user } = useAuth();
    const [quiz, setQuiz] = useState("");
    const [quizzes, setQuizzes] = useState([]);


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch('http://localhost:3000/hosts/quizzes', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json',
              }
        });
        const data = await response.json();
        setQuizzes(data);
      } catch (error) {
        console.error('An error occurred', error);
      }
    };
    fetchQuizzes();
  }, [user]);

  const handleChangeQuiz = (e) => {
    const selectedQuizId = e.target.value; // Get the selected quiz name
    const selectedQuiz = quizzes.find((quiz) => quiz._id === selectedQuizId); // Find the quiz object with the selected name
    if (selectedQuiz) {
      setQuiz(selectedQuiz._id); // Set the quiz state to the selected quiz ID
    } else {
      setQuiz(""); // Reset the quiz state if the selected quiz is not found
    }
  };

  const handleSubmitNewGame = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to your API's login endpoint
      const response = await fetch('http://localhost:3000/games/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          quiz: quiz.toString(),
          host: user.userId,
          socketId: socket.id
         }), // Convert quiz to string
      });
        const data = await response.json();
        console.log(data)
        //alert dashboard that new game should be retrieved
        setNewGame(!newGame);
        //TODO handle returned gameId
    } catch (error) {
      console.error('An error occurred', error);
    }
  };



  return(
    <div>
        <div className='container'>
          <div className="row justify-content-center">
            <div className="col-md-6">
            <form onSubmit={handleSubmitNewGame}>
            <select className="form-select form-select-lg mb-3" aria-label="Large select example" onChange={handleChangeQuiz} value={quiz}>
              <option value="">Latest quiz</option>
              {quizzes.map((quiz) => (
              <option key={quiz._id} value={quiz._id}>{quiz.name}</option>
              ))}
            </select>
            <button type="submit" className="btn btn-primary">new game</button>
          </form>
            </div>
          </div>
        </div>
  </div>
  );
}

export default NewGameForm;





