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
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

function App() {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(true);
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
      setConnecting(false);
      console.log('Connected to server');
    });

    socket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnecting(false);
    });

    // Set a timeout to stop showing "connecting" after 5 seconds
    const timer = setTimeout(() => {
      setConnecting(false);
    }, 5000);

    // Cleanup on component unmount
    return () => {
      clearTimeout(timer);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
    };
  }, []);

  return (
    <div className="min-h-screen game-container">
      <div className="w-full mx-auto">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center mb-8 text-white drop-shadow-lg">
          Multiplayer Tic Tac Toe
        </h1>
        
        {connecting && (
          <div className="w-full max-w-2xl mx-auto glass text-white px-6 py-4 rounded-lg mb-8 animate-pulse">
            Connecting to server...
          </div>
        )}

        {!connected && !connecting && (
          <div className="w-full max-w-2xl mx-auto bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 animate-appear">
            <p className="font-bold">Connection failed!</p>
            <p>Please check your internet connection and try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex justify-center items-center w-full animate-appear">
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
