import { useEffect, useState } from 'react';
import Board from './Board';

const Game = ({ socket, gameData, setGameData, setCurrentScreen }) => {
  const [notification, setNotification] = useState('');
  const [waitingForPlayer, setWaitingForPlayer] = useState(gameData.players < 2);
  const [disconnected, setDisconnected] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const copyRoomId = () => {
    navigator.clipboard.writeText(gameData.roomId)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch(err => console.error('Failed to copy:', err));
  };

  const getGameStatus = () => {
    if (waitingForPlayer) {
      return (
        <div className="mb-6 text-white text-center animate-appear">
          <div className="glass p-6 rounded-lg">
            <p className="text-xl font-semibold mb-4">Waiting for another player to join...</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <p className="text-lg">Share this Room ID:</p>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-gray-800 px-4 py-2 rounded-lg font-bold">{gameData.roomId}</span>
                <button 
                  onClick={copyRoomId} 
                  className="bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copySuccess ? '✓' : '📋'}
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (disconnected) {
      return (
        <div className="mb-6 text-red-300 glass bg-red-900/30 p-6 rounded-lg text-center text-lg font-semibold animate-appear">
          {notification}
        </div>
      );
    }

    if (gameData.isGameOver) {
      if (gameData.winner === 'draw') {
        return (
          <div className="mb-6 glass bg-amber-900/30 text-amber-200 p-6 rounded-lg text-center text-2xl font-bold animate-appear">
            Game ended in a draw!
          </div>
        );
      } else {
        return (
          <div className={`mb-6 glass ${gameData.winner === gameData.symbol ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'} p-6 rounded-lg text-center text-2xl font-bold animate-appear`}>
            {gameData.winner === gameData.symbol ? '🎉 You won! 🎉' : 'You lost!'}
          </div>
        );
      }
    }

    return (
      <div className={`mb-6 glass ${gameData.currentTurn === socket.id ? 'bg-cyan-900/30 text-cyan-300' : 'bg-gray-800/60 text-gray-300'} p-6 rounded-lg text-center text-2xl font-bold animate-appear`}>
        {gameData.currentTurn === socket.id ? 'Your turn' : 'Opponent\'s turn'}
      </div>
    );
  };

  console.log('Game data:', gameData);
  console.log('Board state:', gameData.board);

  return (
    <div className="w-full max-w-3xl mx-auto px-2 animate-appear">
      <div className="glass rounded-lg p-4 md:p-6 shadow-2xl">
        <div className="mb-4 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="text-gray-300 text-lg font-semibold">Room:</div>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-gray-800 px-3 py-1 rounded-lg text-gray-200 font-bold">{gameData.roomId}</span>
              <button 
                onClick={copyRoomId} 
                className="bg-gray-700 hover:bg-gray-600 p-1 rounded-lg transition-colors text-sm"
                title="Copy to clipboard"
              >
                {copySuccess ? '✓' : '📋'}
              </button>
            </div>
          </div>
          <div className="text-gray-300 text-xl font-semibold">
            You are: <span className={`font-bold text-3xl ${gameData.symbol === 'X' ? 'text-cyan-300' : 'text-pink-300'}`} style={{ textShadow: `0 0 10px ${gameData.symbol === 'X' ? '#38bdf8' : '#f472b6'}` }}>{gameData.symbol}</span>
          </div>
        </div>

        {getGameStatus()}

        <Board 
          board={gameData.board} 
          onCellClick={handleCellClick} 
          disabled={waitingForPlayer || disconnected || (gameData.currentTurn !== socket.id && !gameData.isGameOver)}
        />

        <div className="mt-6 flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-4 sm:space-y-0">
          {gameData.isGameOver && (
            <button
              onClick={handleRestartGame}
              className="w-full sm:w-64 bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:scale-105"
            >
              Play Again
            </button>
          )}
          <button
            onClick={handleLeaveGame}
            className="w-full sm:w-64 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:scale-105"
          >
            Leave Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game; 