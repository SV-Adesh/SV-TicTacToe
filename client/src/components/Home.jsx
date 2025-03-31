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
    <div className="w-full max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-xl">
      <div className="w-full max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-10 text-center text-gray-800">Join or Create a Game</h2>
        
        <div className="mb-8">
          <label 
            htmlFor="roomId" 
            className="block text-gray-700 text-lg font-bold mb-4"
          >
            Room ID
          </label>
          <input
            id="roomId"
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter room ID to join"
            className="shadow appearance-none border-2 border-gray-300 rounded-lg w-full py-5 px-6 text-gray-700 text-xl leading-tight focus:outline-none focus:ring-4 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {error && (
          <div className="mb-10 text-red-500 text-lg font-medium">{error}</div>
        )}

        <div className="flex flex-col space-y-8">
          <button
            onClick={() => handleJoinGame()}
            disabled={isJoining}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-5 px-8 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 transition-colors text-xl shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {isJoining ? 'Joining...' : 'Join Game'}
          </button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-8 text-lg text-gray-500">or</span>
            </div>
          </div>
          
          <button
            onClick={handleCreateGame}
            disabled={isJoining}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-5 px-8 rounded-lg focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 transition-colors text-xl shadow-md hover:shadow-lg disabled:opacity-50"
          >
            Create New Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home; 