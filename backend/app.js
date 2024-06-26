const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');

require('dotenv').config();
console.log('process.env.PORT:', process.env.PORT);
// routers
const cron = require('node-cron');
const {logResponseTime} = require("#src/middlewares/logger");

const apiRouter = require('#src/routes/v1/api');
const {createCronJobs} = require("#src/services/crons");

const app = express();
if (process.env.NODE_ENV === 'development') {
    app.use(cors());
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logResponseTime);
app.use('/v1/api', apiRouter);

createCronJobs();

module.exports = app;
