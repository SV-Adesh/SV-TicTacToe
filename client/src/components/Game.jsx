import { useEffect, useState } from 'react';
import Board from './Board';

const Game = ({ socket, gameData, setGameData, setCurrentScreen }) => {
  const [notification, setNotification] = useState('');
  const [waitingForPlayer, setWaitingForPlayer] = useState(gameData.players < 2);
  const [disconnected, setDisconnected] = useState(false);

  useEffect(() => {
    // Setup socket event listeners
    socket.on('gameStart', (data) => {
      console.log('Game started:', data);
      setGameData(prevData => ({
        ...prevData,
        currentTurn: data.currentTurn,
        board: data.board
      }));
      setWaitingForPlayer(false);
      setNotification('');
    });

    socket.on('boardUpdate', (data) => {
      console.log('Board updated:', data);
      setGameData(prevData => ({
        ...prevData,
        board: data.board,
        currentTurn: data.currentTurn
      }));
    });

    socket.on('gameOver', (data) => {
      console.log('Game over:', data);
      setGameData(prevData => ({
        ...prevData,
        board: data.board,
        winner: data.winner,
        isGameOver: true
      }));
    });

    socket.on('gameRestart', (data) => {
      console.log('Game restarted:', data);
      setGameData(prevData => ({
        ...prevData,
        board: data.board,
        currentTurn: data.currentTurn,
        winner: null,
        isGameOver: false
      }));
      setDisconnected(false);
      setNotification('');
    });

    socket.on('playerDisconnected', () => {
      console.log('Player disconnected');
      setDisconnected(true);
      setNotification('Other player has disconnected. Waiting for them to reconnect...');
    });

    // Cleanup
    return () => {
      socket.off('gameStart');
      socket.off('boardUpdate');
      socket.off('gameOver');
      socket.off('gameRestart');
      socket.off('playerDisconnected');
    };
  }, [socket, setGameData]);

  const handleCellClick = (index) => {
    console.log('Cell clicked:', index, 'Current turn:', gameData.currentTurn, 'Socket ID:', socket.id);
    // Prevent moves if it's not your turn or the game is over
    if (
      socket.id !== gameData.currentTurn || 
      gameData.isGameOver || 
      waitingForPlayer || 
      gameData.board[index] !== null
    ) {
      console.log('Move prevented. Not your turn or invalid move.');
      return;
    }

    console.log('Sending move to server:', { roomId: gameData.roomId, index });
    socket.emit('makeMove', {
      roomId: gameData.roomId,
      index
    });
  };

  const handleRestartGame = () => {
    socket.emit('restartGame', gameData.roomId);
  };

  const handleLeaveGame = () => {
    setCurrentScreen('home');
  };

  const getGameStatus = () => {
    if (waitingForPlayer) {
      return (
        <div className="mb-6 text-blue-600 text-center text-lg">
          <p>Waiting for another player to join...</p>
          <p className="mt-2">Share this Room ID with your friend: <span className="font-bold">{gameData.roomId}</span></p>
        </div>
      );
    }

    if (disconnected) {
      return (
        <div className="mb-6 text-red-500 text-center text-lg">
          {notification}
        </div>
      );
    }

    if (gameData.isGameOver) {
      if (gameData.winner === 'draw') {
        return <div className="mb-6 text-yellow-600 text-center text-xl font-bold">Game ended in a draw!</div>;
      } else {
        return (
          <div className={`mb-6 ${gameData.winner === gameData.symbol ? 'text-green-600' : 'text-red-600'} text-center text-xl font-bold`}>
            {gameData.winner === gameData.symbol ? 'You won!' : 'You lost!'}
          </div>
        );
      }
    }

    return (
      <div className={`mb-6 ${gameData.currentTurn === socket.id ? 'text-green-600' : 'text-blue-600'} text-center text-xl font-bold`}>
        {gameData.currentTurn === socket.id ? 'Your turn' : 'Opponent\'s turn'}
      </div>
    );
  };

  console.log('Game data:', gameData);
  console.log('Board state:', gameData.board);

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl">
        <div className="mb-8 flex justify-between items-center">
          <div className="text-xl font-semibold">
            Room: <span className="font-bold">{gameData.roomId}</span>
          </div>
          <div className="text-xl font-semibold">
            You: <span className="font-bold text-2xl">{gameData.symbol}</span>
          </div>
        </div>

        {getGameStatus()}

        <div className="w-full max-w-4xl mx-auto">
          <Board 
            board={gameData.board} 
            onCellClick={handleCellClick} 
            disabled={waitingForPlayer || disconnected}
          />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row sm:space-x-6 space-y-4 sm:space-y-0 justify-center">
          {gameData.isGameOver && (
            <button
              onClick={handleRestartGame}
              className="w-full sm:w-64 bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors text-lg"
            >
              Play Again
            </button>
          )}
          <button
            onClick={handleLeaveGame}
            className="w-full sm:w-64 bg-red-500 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors text-lg"
          >
            Leave Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game; 