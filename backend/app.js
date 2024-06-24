const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');

require('dotenv').config();
console.log('process.env.PORT:', process.env.PORT);
// routers

const apiRouter = require('#src/routes/v1/api');

const app = express();
if (process.env.NODE_ENV === 'development') {
    app.use(cors());
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/v1/api', apiRouter);

// create cron job to fetch crypto news
const cron = require('node-cron');
const {getHeadlinesWithSummaries} = require('#src/services/cryptoPanic');
const {saveHeadlinesWithSummaries} = require('#src/services/cryptoPanic');
cron.schedule('0 * * * *', () => {
    console.log('running a task every day');
    saveHeadlinesWithSummaries().then(r => {
        logger.info('Saved headlines with summaries');
    });
});

module.exports = app;
