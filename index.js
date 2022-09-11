const http = require('http');
const app = require('./app');
const server = http.createServer(app);
const { PORT } = require('./utils/config');
const logger = require('./utils/logger');

server.listen(PORT, () => {
	logger.info(`Server running on port ${PORT}`);
});
