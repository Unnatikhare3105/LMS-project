
import app from './src/app.js';
import config from './src/config/config.js';
import initSocket from './src/utils/socket.io.js';
import http from 'http';

const port = config.PORT;

const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

