import { useState } from 'react';
import { motion } from 'framer-motion';

const Home = ({ socket, setGameData, setCurrentScreen }) => {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const generateRandomRoomId = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const handleCreateGame = () => {
    const newRoomId = generateRandomRoomId();
    console.log('Creating new game with room ID:', newRoomId);
    handleJoinGame(newRoomId);
  };

  const handleJoinGame = (providedRoomId = null) => {
    const roomToJoin = providedRoomId || roomId;
    
    if (!roomToJoin.trim()) {
      setError('Please enter a room ID');
      return;
    }

    setIsJoining(true);
    setError('');
    console.log('Joining game with room ID:', roomToJoin);

    // Join the room
    socket.emit('joinGame', roomToJoin);

    // Set up event listeners for joining a game
    socket.once('gameJoined', (data) => {
      console.log('Game joined:', data);
      setGameData({
        roomId: data.roomId,
        symbol: data.symbol,
        board: data.board,
        currentTurn: data.currentTurn,
        players: data.players,
        winner: null,
        isGameOver: false
      });
      setCurrentScreen('game');
      setIsJoining(false);
    });

    socket.once('roomFull', () => {
      console.log('Room is full');
      setError('This room is full. Please try another room.');
      setIsJoining(false);
    });

    // Handle any connection errors
    socket.once('connect_error', (err) => {
      console.error('Connection error:', err);
      setError('Failed to connect to the server. Please try again.');
      setIsJoining(false);
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto glass rounded-xl p-8 shadow-2xl border border-slate-700/30"
    >
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full mx-auto"
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center text-white">
          Join or Create a Game
        </h2>
        
        <div className="mb-6">
          <label 
            htmlFor="roomId" 
            className="block text-slate-300 text-lg font-medium mb-3"
          >
            Room ID
          </label>
          <motion.div whileHover={{ scale: 1.02 }} className="relative">
            <input
              id="roomId"
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter room ID to join"
              className="shadow appearance-none bg-slate-800/70 border-2 border-slate-700/80 rounded-xl w-full py-4 px-5 text-white text-xl leading-tight focus:outline-none focus:ring-4 focus:ring-cyan-600/50 focus:border-transparent transition-all placeholder-slate-500"
            />
            {roomId && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setRoomId('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                title="Clear input"
              >
                ✕
              </motion.button>
            )}
          </motion.div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-red-300 bg-red-900/20 border border-red-900/50 p-4 rounded-xl text-base font-medium"
          >
            ⚠️ {error}
          </motion.div>
        )}

        <div className="flex flex-col space-y-6">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(56, 189, 248, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            disabled={isJoining}
            onClick={() => handleJoinGame()}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all duration-300 text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isJoining ? (
              <span className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Joining...
              </span>
            ) : 'Join Game'}
          </motion.button>
          
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-slate-800 px-6 py-1 text-lg text-slate-400 rounded-full">or</span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(236, 72, 153, 0.3)" }}
            whileTap={{ scale: 0.97 }}
            disabled={isJoining}
            onClick={handleCreateGame}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl focus:outline-none focus:ring-4 focus:ring-pink-500/50 transition-all duration-300 text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create New Game
          </motion.button>
        </div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 0.8 }}
          className="text-slate-400 text-center mt-10 text-sm"
        >
          Invite a friend to play by sharing the room ID after creating a game.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default Home; 