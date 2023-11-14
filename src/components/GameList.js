const GameList = ({ games, setFocusedGame}) => {

  return (
    <div className='container'>
        <div className="col">
          <h2>Games</h2>  
          {games.map((game) => (
            <div key={game._id} className="row">
              <button key={game._id} onClick={() => setFocusedGame(game)}>{game.createdAt}</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default GameList;