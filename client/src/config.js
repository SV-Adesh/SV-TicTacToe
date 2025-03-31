// Environment-specific configuration
const config = {
  // Server URL
  SERVER_URL: import.meta.env.PROD 
    ? 'https://your-backend-url.onrender.com' // Update with your Render URL once deployed
    : 'http://localhost:5001',
};

export default config; 