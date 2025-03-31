import { useState } from 'react';

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
    <div className="w-full max-w-xl mx-auto glass rounded-lg p-6 md:p-8 shadow-2xl animate-appear">
      <div className="w-full mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center text-white">Join or Create a Game</h2>
        
        <div className="mb-6">
          <label 
            htmlFor="roomId" 
            className="block text-gray-300 text-lg font-bold mb-3"
          >
            Room ID
          </label>
          <input
            id="roomId"
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID to join"
            className="shadow appearance-none bg-gray-800 border-2 border-gray-700 rounded-lg w-full py-4 px-5 text-white text-xl leading-tight focus:outline-none focus:ring-4 focus:ring-cyan-600/50 focus:border-transparent transition-all placeholder-gray-500"
          />
        </div>

        {error && (
          <div className="mb-8 text-red-300 bg-red-900/20 p-4 rounded-lg text-lg font-medium animate-appear">
            ⚠️ {error}
          </div>
        )}

        <div className="flex flex-col space-y-6">
          <button
            onClick={() => handleJoinGame()}
            disabled={isJoining}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-6 rounded-lg focus:outline-none focus:ring-4 focus:ring-cyan-500/50 transition-all duration-300 text-xl shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-lg"
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
          </button>
          
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-gray-800 px-6 py-1 text-lg text-gray-400 rounded-full">or</span>
            </div>
          </div>
          
          <button
            onClick={handleCreateGame}
            disabled={isJoining}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg focus:outline-none focus:ring-4 focus:ring-pink-500/50 transition-all duration-300 text-xl shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-lg"
          >
            Create New Game
          </button>
        </div>
        
        <p className="text-gray-400 text-center mt-10 text-sm">
          Invite a friend to play by sharing the room ID after creating a game.
        </p>
      </div>
    </div>
  );
};

export default Home; 