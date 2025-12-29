import http from 'http';
import config from '@config/config';
import initSocket from '@utils/socket.io';
import app from 'app';
import logger from '@utils/logger';

const port = config.PORT || 5000;

const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});