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
    <div className="w-full max-w-4xl mx-auto glass rounded-2xl p-8 md:p-12 shadow-2xl animate-appear">
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-10 text-center text-white">Join or Create a Game</h2>
        
        <div className="mb-8">
          <label 
            htmlFor="roomId" 
            className="block text-white text-lg font-bold mb-4"
          >
            Room ID
          </label>
          <input
            id="roomId"
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID to join"
            className="shadow appearance-none bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-xl w-full py-5 px-6 text-white text-xl leading-tight focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:border-transparent transition-all placeholder-white/50"
          />
        </div>

        {error && (
          <div className="mb-10 text-red-300 bg-red-500/20 p-4 rounded-xl text-lg font-medium animate-appear">
            ⚠️ {error}
          </div>
        )}

        <div className="flex flex-col space-y-8">
          <button
            onClick={() => handleJoinGame()}
            disabled={isJoining}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-5 px-8 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 text-xl shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-lg"
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
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/30"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="glass px-8 py-1 text-lg text-white/80 rounded-full">or</span>
            </div>
          </div>
          
          <button
            onClick={handleCreateGame}
            disabled={isJoining}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-5 px-8 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-all duration-300 text-xl shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:shadow-lg"
          >
            Create New Game
          </button>
        </div>
        
        <p className="text-white/70 text-center mt-12 text-sm">
          Invite a friend to play by sharing the room ID after creating a game.
        </p>
      </div>
    </div>
  );
};

export default Home; 