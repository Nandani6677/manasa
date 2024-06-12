const { format, createLogger, transports } = require("winston");
const { combine, timestamp, label, prettyPrint } = format;
const CATEGORY = "Log";
require("winston-daily-rotate-file");


const fileRotateTransport = new transports.DailyRotateFile({
    filename: "logs/%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "3d", 
});

const logger = createLogger({
    level: "info",
    format: combine(
        label({ label: CATEGORY }),
        timestamp({
            format: "MMM-DD-YYYY HH:mm:ss",
        }),
        prettyPrint()
    ),
    transports: [fileRotateTransport, new transports.Console()],
});

module.exports = logger;