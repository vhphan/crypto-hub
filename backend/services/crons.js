const cron = require("node-cron");
const {saveHeadlinesWithSummaries} = require("#src/services/cryptoPanic");
const {logger} = require("#src/middlewares/logger");

const createCronJobs = () => {
    console.log('created hourly cron job.');
    cron.schedule('0 * * * *', () => {
        saveHeadlinesWithSummaries().then(r => {
            logger.info('Saved headlines with summaries');
        });
    });
}

module.exports = {
    createCronJobs
}