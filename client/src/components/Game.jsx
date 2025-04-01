import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Board from './Board';

const Game = ({ socket, gameData, setGameData, setCurrentScreen }) => {
  const [notification, setNotification] = useState('');
  const [waitingForPlayer, setWaitingForPlayer] = useState(gameData.players < 2);
  const [disconnected, setDisconnected] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showRestartButton, setShowRestartButton] = useState(false);

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
      setShowRestartButton(true);
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
      setShowRestartButton(false);
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-white text-center"
        >
          <div className="glass p-6 rounded-xl border border-slate-700/50">
            <p className="text-xl font-semibold mb-4">Waiting for another player to join...</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <p className="text-lg">Share this Room ID:</p>
              <div className="flex items-center gap-2">
                <span className="font-mono bg-slate-800 px-4 py-2 rounded-lg font-bold">{gameData.roomId}</span>
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyRoomId} 
                  className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copySuccess ? '✓' : '📋'}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (disconnected) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-red-300 glass bg-red-900/30 p-6 rounded-xl text-center text-lg font-semibold"
        >
          {notification}
        </motion.div>
      );
    }

    if (gameData.isGameOver) {
      if (gameData.winner === 'draw') {
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 glass bg-amber-900/30 text-amber-200 p-6 rounded-xl text-center text-2xl font-bold"
          >
            Game ended in a draw!
          </motion.div>
        );
      } else {
        const isWinner = gameData.winner === gameData.symbol;
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 400,
              damping: 17
            }}
            className={`mb-6 glass ${isWinner ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'} p-6 rounded-xl text-center text-2xl font-bold`}
          >
            {isWinner ? (
              <span className="flex flex-col items-center justify-center">
                <span className="text-3xl mb-2">🎉 You Won! 🎉</span>
                <span className="text-xl font-normal">Congratulations!</span>
              </span>
            ) : (
              <span>You lost this round!</span>
            )}
          </motion.div>
        );
      }
    }

    const isYourTurn = gameData.currentTurn === socket.id;
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`mb-6 glass ${isYourTurn ? 'bg-cyan-900/30 text-cyan-300' : 'bg-slate-800/60 text-slate-300'} p-6 rounded-xl text-center flex flex-col items-center justify-center`}
      >
        <div className="mb-2 text-lg">
          {isYourTurn ? "It's your turn!" : "Waiting for opponent..."}
        </div>
        <div className="flex items-center justify-center space-x-8 mt-1">
          <div className={`player-indicator flex flex-col items-center ${gameData.symbol === 'X' ? 'text-cyan-400' : 'text-slate-400'}`}>
            <span className="text-2xl font-bold" style={{ textShadow: gameData.symbol === 'X' ? '0 0 10px #38bdf8' : 'none' }}>X</span>
            <span className="text-xs mt-1">{gameData.symbol === 'X' ? 'You' : 'Opponent'}</span>
          </div>
          <div className="text-slate-400">vs</div>
          <div className={`player-indicator flex flex-col items-center ${gameData.symbol === 'O' ? 'text-pink-400' : 'text-slate-400'}`}>
            <span className="text-2xl font-bold" style={{ textShadow: gameData.symbol === 'O' ? '0 0 10px #f472b6' : 'none' }}>O</span>
            <span className="text-xs mt-1">{gameData.symbol === 'O' ? 'You' : 'Opponent'}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  console.log('Game data:', gameData);
  console.log('Board state:', gameData.board);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto px-2"
    >
      <div className="glass rounded-xl p-4 md:p-6 shadow-2xl border border-slate-700/30">
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="text-slate-300 text-lg font-semibold">Room:</div>
            <div className="flex items-center gap-2">
              <span className="font-mono bg-slate-800 px-3 py-1 rounded-lg text-slate-200 font-bold">{gameData.roomId}</span>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={copyRoomId} 
                className="bg-slate-700 hover:bg-slate-600 p-1.5 rounded-lg transition-colors text-sm"
                title="Copy to clipboard"
              >
                {copySuccess ? '✓' : '📋'}
              </motion.button>
            </div>
          </div>
          <div className="player-symbol text-center">
            <div className="text-slate-300 text-base font-medium mb-1">You are playing as</div>
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ 
                duration: 0.5, 
                ease: "easeInOut",
                times: [0, 0.2, 0.8, 1],
                repeatDelay: 5,
                repeat: Infinity,
              }}
              className={`inline-block font-bold text-3xl ${gameData.symbol === 'X' ? 'text-cyan-400' : 'text-pink-400'} px-3 py-1 rounded-lg bg-slate-800/80`} 
              style={{ 
                textShadow: `0 0 10px ${gameData.symbol === 'X' ? '#38bdf8' : '#f472b6'}`,
                boxShadow: `0 0 20px 0 ${gameData.symbol === 'X' ? 'rgba(56, 189, 248, 0.3)' : 'rgba(244, 114, 182, 0.3)'}`,
              }}
            >
              {gameData.symbol}
            </motion.div>
          </div>
        </div>

        {getGameStatus()}

        <Board 
          board={gameData.board} 
          onCellClick={handleCellClick} 
          disabled={waitingForPlayer || disconnected || (gameData.currentTurn !== socket.id && !gameData.isGameOver)}
        />

        <div className="mt-8 flex flex-col sm:flex-row justify-center sm:space-x-6 space-y-4 sm:space-y-0">
          <AnimatePresence>
            {(gameData.isGameOver || showRestartButton) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(56, 189, 248, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRestartGame}
                className="w-full sm:w-64 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all duration-300 text-lg shadow-lg"
              >
                Play Again
              </motion.button>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(239, 68, 68, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLeaveGame}
            className="w-full sm:w-64 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/50 transition-all duration-300 text-lg shadow-lg"
          >
            Leave Game
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Game; 