# Multiplayer Tic Tac Toe

A real-time multiplayer Tic Tac Toe game built with React.js for the frontend and Node.js with Express and Socket.io for the backend.

## Features

- Real-time gameplay with Socket.io
- Automatic player assignment (X or O)
- Room-based multiplayer system
- Win detection
- Restart game functionality
- Player disconnect notification
- Responsive design with Tailwind CSS

## Project Structure

```
/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Board.jsx   # Game board component
│   │   │   ├── Game.jsx    # Game screen component
│   │   │   └── Home.jsx    # Home screen component
│   │   ├── App.jsx         # Main application component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles with Tailwind
│   └── ...
└── server/                 # Node.js backend
    ├── index.js            # Express & Socket.io server
    ├── package.json        # Server dependencies
    └── .env                # Environment variables
```

## Setup and Running Locally

### Backend Setup

1. Navigate to the server directory:
   ```
   cd server
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## How to Play

1. On the home screen, either:
   - Enter a room ID and click "Join Game" to join an existing game
   - Click "Create New Game" to start a new game

2. Share the room ID with a friend so they can join your game

3. Once both players join, the game will start automatically

4. Take turns placing X or O on the board

5. The game will detect wins, losses, and draws automatically

6. Click "Play Again" to restart the game or "Leave Game" to exit

## Deployment

### Deploying the Frontend to Vercel

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Navigate to the client directory and build the project:
   ```
   cd client
   npm run build
   ```

3. Deploy to Vercel:
   ```
   vercel
   ```

4. Follow the prompts to complete deployment

### Deploying the Backend to Render

1. Create a new Web Service on Render.com

2. Connect your GitHub repository

3. Configure the service:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment Variables: Add `PORT=10000` (or any port)

4. Enable WebSockets in the advanced settings

5. Deploy and get your service URL

6. Update the Socket.io connection URL in the frontend (in `App.jsx`):
   ```js
   const socket = io('https://your-render-service-url.com');
   ```

7. Redeploy the frontend with the updated backend URL

## Technologies Used

- **Frontend**:
  - React.js
  - Socket.io Client
  - Tailwind CSS
  - Vite

- **Backend**:
  - Node.js
  - Express.js
  - Socket.io
  - CORS

## License

MIT 