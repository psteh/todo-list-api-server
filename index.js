const fs = require('fs');
const http = require('http');
const express = require('express');
const conf = require('config-yml');
const swaggerUi = require('swagger-ui-express');
const yamljs = require('yamljs');
const ms = require('ms');
const limit = require('express-rate-limit');
const moment = require('moment-timezone').tz.setDefault(conf.timezone);
const crypto = require('crypto');
const cors = require('cors');

const log = require('./utils/log');
const db = require('./utils/db');

const Todo = require('./routes/Todo');

/**
 *  Initialize logging
 */
log.init({
    path: conf.logger.path || './',
    filename: conf.logger.filename || 'log.log',
    level: conf.logger.level || 'DEBUG',
    logToConsole: conf.logger.log_to_console || true,
    writeToFile: conf.logger.write_to_file || true,
});

/**
 *  Connect to database 
 * */
db.connect();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(
    express.urlencoded({
        extended: true,
        limit: '50mb',
    })
);

/**
 *  Limit request(s) per limit time set at configuration
 * */
app.use(
    limit({
        windowMs: ms(conf.api.limit_time),
        max: conf.api.limit_max,
        message: 'Too many requests, please try again later.',
    })
);

app.enable('trust proxy'); // to get IP from request

/**
 *  Routes middleware
 * */
app.use(function(req, res, next) {
    // transaction ID for logging purpose
    req.transactionId = crypto.randomBytes(5).toString('hex');
    next();
});

/**
 *  Routes
 * */
app.use('/api/v1/todo', Todo);

/**
 *  Server start
 * */
http.createServer(app).listen(conf.port, conf.host, async() => {
    log.info(`server listening to ${conf.host}:${conf.port}`);
});