import http from 'http';
import app from './app';
import initSocket from './utils/socket.io';
import logger from './utils/logger';
import config from '@config/config';

const port = config.PORT ;

const server = http.createServer(app);

initSocket(server);

server.listen(
  port,
  () => logger.info(`Server running on port ${port}`)
);
