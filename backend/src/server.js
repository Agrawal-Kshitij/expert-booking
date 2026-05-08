require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { setupSocket } = require('./socket');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    const server = http.createServer(app);
    setupSocket(server);

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
