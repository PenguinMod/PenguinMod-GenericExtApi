const fs = require('fs');
const path = require('path');

function logger(req, res, next) {
    const logFilePath = path.join(__dirname, '../../logs/access.log');

    // Log the incoming request
    const start = new Date();
    console.log(`[REQ] ${req.method} ${req.url} (${req.hostname})`);

    // Log the outgoing response
    res.on('finish', () => {
        const end = new Date();
        const duration = end - start;
        const timestamp = new Date().toISOString();
        const logMessage = `[RES] ${req.method} ${req.url} (${req.hostname}) -> ${res.statusCode} (${duration}ms)\n`;

        console.log(logMessage);

        // Append log to file
        fs.appendFile(logFilePath, `${timestamp} - ` + logMessage, (err) => {
            if (err) {
                console.error('[LOGGER] Error writing to log file:', err);
            }
        });
    });

    next();
}

module.exports = logger;