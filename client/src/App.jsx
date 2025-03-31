import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import Home from './components/Home';
import Game from './components/Game';
import config from './config';

// Initialize socket with the server URL from config
const socket = io(config.SERVER_URL, {
  withCredentials: false,
  extraHeaders: {
    "my-custom-header": "abcd"
  },
  transports: ['websocket', 'polling']
});

function App() {
  const [connected, setConnected] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [gameData, setGameData] = useState({
    roomId: null,
    symbol: null,
    board: Array(9).fill(null),
    currentTurn: null,
    players: 0,
    winner: null,
    isGameOver: false
  });

  useEffect(() => {
    // Setup socket event listeners
    socket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    // Cleanup on component unmount
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-blue-50 to-indigo-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-8 text-blue-700">
          Multiplayer Tic Tac Toe
        </h1>
        
        {!connected && (
          <div className="w-full max-w-2xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-8">
            Connecting to server...
          </div>
        )}

        <div className="flex justify-center items-center w-full">
          {currentScreen === 'home' ? (
            <Home 
              socket={socket} 
              setGameData={setGameData} 
              setCurrentScreen={setCurrentScreen} 
            />
          ) : (
            <Game 
              socket={socket} 
              gameData={gameData} 
              setGameData={setGameData} 
              setCurrentScreen={setCurrentScreen} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
