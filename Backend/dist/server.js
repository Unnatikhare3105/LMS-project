"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const socket_io_1 = __importDefault(require("./utils/socket.io"));
const logger_1 = __importDefault(require("./utils/logger"));
const config_1 = __importDefault(require("@config/config"));
const port = config_1.default.PORT;
const server = http_1.default.createServer(app_1.default);
(0, socket_io_1.default)(server);
server.listen(port, () => logger_1.default.info(`Server running on port ${port}`));
// import http from 'http';
// import app from 'app';
// import logger from '@utils/logger';
// import config from '@config/config';
// import initSocket from '@utils/socket.io';
// const port = config.PORT || 5000;
// const server = http.createServer(app);
// initSocket(server);
// server.listen(port, () => {
//   logger.info(`Server is running on port ${port}`);
// });
//# sourceMappingURL=server.js.map