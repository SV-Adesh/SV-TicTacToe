const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors({
  origin: '*',  // Allow all origins for now
  methods: ['GET', 'POST', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',  // Allow all origins for now
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
  },
});

// Game state
const rooms = {};

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join game
  socket.on('joinGame', (roomId) => {
    console.log(`User ${socket.id} joining room ${roomId}`);
    
    // Create room if it doesn't exist
    if (!rooms[roomId]) {
      rooms[roomId] = {
        id: roomId,
        players: [],
        currentTurn: null,
        board: Array(9).fill(null),
        gameOver: false,
        winner: null
      };
    }

    const room = rooms[roomId];

    // Add player to room if there's space
    if (room.players.length < 2) {
      const isPlayerX = room.players.length === 0;
      const player = {
        id: socket.id,
        symbol: isPlayerX ? 'X' : 'O'
      };

      room.players.push(player);
      socket.join(roomId);

      // If this is the first player, set them as the current turn
      if (isPlayerX) {
        room.currentTurn = socket.id;
      }

      // Notify the player they've joined and what symbol they are
      socket.emit('gameJoined', {
        roomId,
        symbol: player.symbol,
        board: room.board,
        currentTurn: room.currentTurn,
        players: room.players.length
      });

      // If the room is now full, notify both players that the game is starting
      if (room.players.length === 2) {
        io.to(roomId).emit('gameStart', {
          currentTurn: room.currentTurn,
          board: room.board
        });
      }
    } else {
      // Room is full
      socket.emit('roomFull');
    }
  });

  // Handle a player's move
  socket.on('makeMove', ({ roomId, index }) => {
    const room = rooms[roomId];
    
    if (!room) return;
    
    // Check if it's the player's turn and the move is valid
    if (
      room.currentTurn === socket.id &&
      !room.gameOver &&
      index >= 0 &&
      index < 9 &&
      room.board[index] === null
    ) {
      // Find the player to get their symbol
      const player = room.players.find(p => p.id === socket.id);
      
      if (player) {
        // Update the board
        room.board[index] = player.symbol;
        
        // Check for a win
        const winner = checkWinner(room.board);
        
        if (winner) {
          room.gameOver = true;
          room.winner = winner;
          io.to(roomId).emit('gameOver', { winner, board: room.board });
        } else if (!room.board.includes(null)) {
          // Check for a draw
          room.gameOver = true;
          io.to(roomId).emit('gameOver', { winner: 'draw', board: room.board });
        } else {
          // Switch turns
          room.currentTurn = room.players.find(p => p.id !== socket.id).id;
          
          // Broadcast the updated board and current turn
          io.to(roomId).emit('boardUpdate', {
            board: room.board,
            currentTurn: room.currentTurn
          });
        }
      }
    }
  });

  // Handle game restart
  socket.on('restartGame', (roomId) => {
    const room = rooms[roomId];
    
    if (room) {
      room.board = Array(9).fill(null);
      room.gameOver = false;
      room.winner = null;
      
      // Set first player to start
      room.currentTurn = room.players[0].id;
      
      io.to(roomId).emit('gameRestart', {
        board: room.board,
        currentTurn: room.currentTurn
      });
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find rooms the player was in and notify other players
    Object.keys(rooms).forEach(roomId => {
      const room = rooms[roomId];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        if (room.players.length === 0) {
          // If no players left, delete the room
          delete rooms[roomId];
        } else {
          // Notify remaining player
          io.to(roomId).emit('playerDisconnected');
        }
      }
    });
  });
});

// Check for a winner
function checkWinner(board) {
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a]; // Return the winner (X or O)
    }
  }

  return null; // No winner
}

// Routes
app.get('/', (req, res) => {
  res.send('Tic Tac Toe Server is running');
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 