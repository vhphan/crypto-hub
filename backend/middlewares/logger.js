const {createLogger, format, transports} = require('winston');
require('winston-daily-rotate-file');

let myFormat = format.combine(
    format.timestamp({format: 'MMM-DD-YYYY HH:mm:ss'}),
    format.align(),
    format.printf(info => `${info.level}: ${[info.timestamp]}: ${info.message}`),
);

const isDev = process.env.NODE_ENV === 'development'
const transport = new transports.DailyRotateFile({
    filename: isDev? 'logs/%DATE%_dev.log': 'logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '5m',
    level: 'debug',
});

const logger = createLogger({
    level: 'debug',
    format: myFormat,
    transports: [
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `info.log`
        transport,
        new transports.File({filename: 'logs/error.log', level: 'error'}),
        new transports.File({filename: 'logs/info.log', level: 'info'}),
    ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: myFormat,
    }));
}

function logRequest(req, res, next) {
    logger.info(req.url);
    next();
}

function logError(err, req, res, next) {
    logger.error(err);
    next();
}

function createMyLogger(logFileName) {
    return createLogger({
            level: 'info',
            format: myFormat,
            transports: [
                new transports.File({filename: `logs/${logFileName}.log`}),
            ],

        }
    );
}

function logResponseTime(req, res, next) {
    const startHrTime = process.hrtime();
    res.on('finish', () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        logger.info(`${req.method} ${req.path} - ${elapsedTimeInMs/1000} s`);
    });
    next();
}

module.exports = {
    logger,
    logRequest,
    logError,
    createMyLogger,
    logResponseTime,
};