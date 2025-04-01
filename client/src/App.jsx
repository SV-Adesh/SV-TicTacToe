import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
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

// Preload images to avoid flicker
const preloadImages = () => {
  const images = [];
  // Create a simple preloader for pattern backgrounds
  const preloader = new Image();
  preloader.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='1' fill='rgba(255, 255, 255, 0.1)'/%3E%3C/svg%3E`;
  images.push(preloader);
  return images; // Keep reference to avoid garbage collection
};

// Ensure Tailwind CSS is loaded
const injectFallbackStyles = () => {
  const styleExists = document.querySelectorAll('style').length > 0 || 
                     document.querySelectorAll('link[rel="stylesheet"]').length > 1;
  
  if (!styleExists) {
    // No styles loaded, create emergency styles
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    document.head.appendChild(style);
    console.log('Emergency styles injected!');
  }
};

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
  const [preloadedImages] = useState(preloadImages());

  useEffect(() => {
    // Ensure styles are loaded
    injectFallbackStyles();
    
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
      
      <div className="w-full mx-auto max-w-7xl px-4 sm:px-6 min-h-screen flex flex-col">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-10 pb-6 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Tic Tac Toe
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-2">Multiplayer Edition</p>
        </motion.header>

        <AnimatePresence mode="wait">
          {connecting && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-lg mx-auto glass text-cyan-300 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 justify-center"
            >
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Connecting to server...</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!connected && !connecting && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-lg mx-auto bg-red-900/20 border border-red-700 text-red-300 px-6 py-4 rounded-xl mb-8"
            >
              <p className="font-bold text-lg mb-1">Connection failed!</p>
              <p className="mb-3">Please check your internet connection and try again.</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()} 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Retry
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-grow flex justify-center items-center py-4 md:py-8">
          <AnimatePresence mode="wait">
            {currentScreen === 'home' ? (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Home 
                  socket={socket} 
                  setGameData={setGameData} 
                  setCurrentScreen={setCurrentScreen} 
                />
              </motion.div>
            ) : (
              <motion.div
                key="game"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Game 
                  socket={socket} 
                  gameData={gameData} 
                  setGameData={setGameData} 
                  setCurrentScreen={setCurrentScreen} 
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="py-4 text-center text-slate-500 text-sm flex items-center justify-center gap-3">
          <p>Made by adesh</p>
          <a 
            href="https://www.linkedin.com/in/s-v-adesh-29a78a239/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-slate-300 transition-colors"
            title="Connect on LinkedIn"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="currentColor"
              className="inline-block"
            >
              <path d="M20.47,2H3.53A1.45,1.45,0,0,0,2,3.39V20.61A1.45,1.45,0,0,0,3.53,22H20.47A1.45,1.45,0,0,0,22,20.61V3.39A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74H5.25V9.42H8.09ZM6.67,8.16A1.64,1.64,0,1,1,8.31,6.52,1.64,1.64,0,0,1,6.67,8.16ZM18.74,18.74H15.91V14.11c0-1.06,0-2.43-1.48-2.43s-1.7,1.16-1.7,2.36v4.7H9.9V9.42h2.66v1.23h0a3,3,0,0,1,2.7-1.48c2.9,0,3.44,1.91,3.44,4.38Z" />
            </svg>
          </a>
        </footer>
      </div>
    </div>
  );
}

export default App;
