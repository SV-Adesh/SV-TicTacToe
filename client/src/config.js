// Environment-specific configuration
const config = {
  // Server URL
  SERVER_URL: import.meta.env.PROD 
    ? 'https://sv-tictactoe-backend.onrender.com'
    : 'http://localhost:10000',
};

export default config; 