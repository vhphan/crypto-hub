const onlyStatus200 = (req, res) => res.statusCode === 200;

const createCache = (durationString) => require('apicache').options({
    debug: true
}).middleware(
    // cacheString examples are: '10 minutes', '1 hour', '24 hours', '10 days'
    durationString,
    onlyStatus200);

module.exports = {
    createCache,
};