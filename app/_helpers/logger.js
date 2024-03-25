const winston = require('winston');
const { LoggingWinston } = require('@google-cloud/logging-winston');

const loggingWinston = new LoggingWinston({
  projectId: 'csye-417822',
  keyFilename: 'key.json',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    loggingWinston,
  ],
});

module.exports = logger;